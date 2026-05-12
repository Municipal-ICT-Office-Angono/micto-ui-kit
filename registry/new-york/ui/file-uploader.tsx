"use client";

import * as React from "react";
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileArchive,
  File,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Camera,
  RefreshCw,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- Types ---

export interface FileStatus {
  file: File;
  progress: number;
  status: "idle" | "uploading" | "success" | "error";
  error?: string;
  url?: string;
}

export interface FileUploaderProps {
  /** Mode A: Local Form State Array of Files */
  value?: File[];
  /** Fired when local state files are added or deleted */
  onChange?: (files: File[]) => void;

  /** Mode B: Perform actual upload and report progress (0 to 100) */
  onUpload?: (file: File, onProgress: (progress: number) => void) => Promise<string>;
  /** Fired after successful remote uploads, returning the list of remote URLs */
  onUploadComplete?: (urls: string[]) => void;

  /** Constraints */
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // In megabytes (MB)
  accept?: string[]; // MIME types or extension globs e.g. ["image/*", "application/pdf"]

  /** Visual Settings */
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "avatar";
}

// Helper to generate a unique key for each raw File
const getFileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

// Helper to format bytes to human readable sizes
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Helper to validate MIME Types
const validateFileType = (file: File, acceptList?: string[]) => {
  if (!acceptList || acceptList.length === 0) return true;
  return acceptList.some((pattern) => {
    if (pattern.endsWith("/*")) {
      const typeGroup = pattern.split("/")[0];
      return file.type.startsWith(`${typeGroup}/`);
    }
    if (pattern.startsWith(".")) {
      return file.name.toLowerCase().endsWith(pattern.toLowerCase());
    }
    return file.type === pattern;
  });
};

export function FileUploader({
  value = [],
  onChange,
  onUpload,
  onUploadComplete,
  multiple = false,
  maxFiles = 10,
  maxSize = 5, // Default 5MB
  accept = [],
  placeholder = "Drag & drop files here, or click to browse",
  className,
  disabled = false,
  variant = "default",
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [localQueue, setLocalQueue] = React.useState<Record<string, FileStatus>>({});
  const [errors, setErrors] = React.useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Keep track of blob URLs to revoke on unmount and prevent memory leaks
  const previewUrlsRef = React.useRef<Record<string, string>>({});

  React.useEffect(() => {
    return () => {
      // Clean up all object URLs when component unmounts
      Object.values(previewUrlsRef.current).forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const getPreviewUrl = (file: File) => {
    const key = getFileKey(file);
    if (!file.type.startsWith("image/")) return undefined;
    if (!previewUrlsRef.current[key]) {
      previewUrlsRef.current[key] = URL.createObjectURL(file);
    }
    return previewUrlsRef.current[key];
  };

  // Synchronize Mode A files
  React.useEffect(() => {
    if (!onUpload && value) {
      setLocalQueue((prev) => {
        const next: Record<string, FileStatus> = {};
        value.forEach((file) => {
          const key = getFileKey(file);
          next[key] = prev[key] || { file, progress: 0, status: "idle" };
        });
        return next;
      });
    }
  }, [value, onUpload]);

  const handleFiles = async (fileList: FileList) => {
    if (disabled) return;
    setErrors([]);

    const incomingFiles = Array.from(fileList);
    const validIncoming: File[] = [];
    const newErrors: string[] = [];

    // Calculate current queue capacity
    const currentCount = onUpload 
      ? Object.keys(localQueue).length 
      : value.length;

    if (!multiple && incomingFiles.length > 1) {
      newErrors.push("Multi-selection is disabled. Only a single file is allowed.");
      setErrors(newErrors);
      return;
    }

    if (multiple && currentCount + incomingFiles.length > maxFiles) {
      newErrors.push(`Maximum file limit exceeded. You can only upload up to ${maxFiles} files.`);
      setErrors(newErrors);
      return;
    }

    incomingFiles.forEach((file) => {
      // Validate Type
      if (!validateFileType(file, accept)) {
        newErrors.push(`"${file.name}" has an unsupported file extension or type.`);
        return;
      }
      // Validate Size
      if (file.size / 1024 / 1024 > maxSize) {
        newErrors.push(`"${file.name}" exceeds the maximum ${maxSize}MB size limit.`);
        return;
      }
      validIncoming.push(file);
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
    }

    if (validIncoming.length === 0) return;

    // --- Mode A: Local State Accumulation ---
    if (!onUpload) {
      if (multiple) {
        const mergedFiles = [...value, ...validIncoming].slice(0, maxFiles);
        onChange?.(mergedFiles);
      } else {
        onChange?.([validIncoming[0]]);
      }
      return;
    }

    // --- Mode B: Immediate Remote Uploads ---
    const newStatuses: Record<string, FileStatus> = { ...localQueue };
    const uploadPromises: Promise<string | undefined>[] = [];

    // Reset single selection if multi is off
    if (!multiple) {
      Object.keys(previewUrlsRef.current).forEach((key) => {
        URL.revokeObjectURL(previewUrlsRef.current[key]);
        delete previewUrlsRef.current[key];
      });
      // Clear status lists
      Object.keys(newStatuses).forEach((key) => delete newStatuses[key]);
    }

    validIncoming.forEach((file) => {
      const key = getFileKey(file);
      const statusObj: FileStatus = {
        file,
        progress: 0,
        status: "uploading",
      };
      newStatuses[key] = statusObj;

      // Trigger actual upload Promise
      const promise = onUpload(file, (progress) => {
        setLocalQueue((prev) => {
          if (!prev[key]) return prev;
          return {
            ...prev,
            [key]: { ...prev[key], progress },
          };
        });
      })
        .then((url) => {
          setLocalQueue((prev) => {
            if (!prev[key]) return prev;
            return {
              ...prev,
              [key]: { ...prev[key], progress: 100, status: "success" as const, url },
            };
          });
          return url;
        })
        .catch((err) => {
          setLocalQueue((prev) => {
            if (!prev[key]) return prev;
            return {
              ...prev,
              [key]: {
                ...prev[key],
                status: "error" as const,
                error: err instanceof Error ? err.message : "Upload failed.",
              },
            };
          });
          return undefined;
        });

      uploadPromises.push(promise);
    });

    setLocalQueue(newStatuses);

    // Wait for all uploads to complete to fire complete callbacks
    const completedUrls = (await Promise.all(uploadPromises)).filter(
      (url): url is string => typeof url === "string"
    );

    if (completedUrls.length > 0) {
      onUploadComplete?.(completedUrls);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || !e.dataTransfer.files) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (key: string, file: File, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Clean up preview blob URL
    if (previewUrlsRef.current[key]) {
      URL.revokeObjectURL(previewUrlsRef.current[key]);
      delete previewUrlsRef.current[key];
    }

    setLocalQueue((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });

    if (!onUpload) {
      onChange?.(value.filter((f) => getFileKey(f) !== key));
    }
  };

  const triggerBrowse = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  // Render icons for files based on MIME types
  const renderFileIcon = (file: File) => {
    const type = file.type;
    if (type.includes("sheet") || type.includes("excel") || type.includes("csv")) {
      return <FileSpreadsheet className="h-5 w-5 text-emerald-600 shrink-0" />;
    }
    if (type.includes("zip") || type.includes("tar") || type.includes("rar") || type.includes("compressed")) {
      return <FileArchive className="h-5 w-5 text-amber-600 shrink-0" />;
    }
    if (type.includes("pdf") || type.includes("word") || type.includes("text")) {
      return <FileText className="h-5 w-5 text-blue-600 shrink-0" />;
    }
    return <File className="h-5 w-5 text-slate-500 shrink-0" />;
  };

  const activeQueue = React.useMemo(() => {
    return Object.entries(localQueue);
  }, [localQueue]);

  // --- RENDERS ---

  // 1. Variant: Profile/Avatar Bubble View
  if (variant === "avatar") {
    const firstKey = Object.keys(localQueue)[0];
    const firstItem = firstKey ? localQueue[firstKey] : undefined;
    const avatarUrl = firstItem?.file ? getPreviewUrl(firstItem.file) : undefined;
    const isUploading = firstItem?.status === "uploading";

    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          disabled={disabled}
          accept={accept?.join(",")}
          onChange={handleFileInputChange}
        />
        
        <div className="relative">
          <div
            role="button"
            tabIndex={disabled ? -1 : 0}
            onClick={triggerBrowse}
            onKeyDown={(e) => {
              if (e.key === "Enter") triggerBrowse();
            }}
            className={cn(
              "relative group flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/40 overflow-hidden outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all hover:border-primary/50",
              isDragging && "border-primary bg-primary/5 scale-95",
              disabled && "cursor-not-allowed opacity-60 hover:border-muted-foreground/30"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {avatarUrl ? (
              <>
                <img
                  src={avatarUrl}
                  alt="Profile Preview"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </>
            ) : isUploading ? (
              <div className="flex flex-col items-center gap-1">
                <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                <span className="text-[10px] font-medium text-muted-foreground">
                  {firstItem?.progress}%
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                <Camera className="h-5 w-5 shrink-0" />
              </div>
            )}
          </div>

          {avatarUrl && !disabled && firstItem && (
            <button
              type="button"
              onClick={(e) => removeFile(firstKey, firstItem.file, e)}
              className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border bg-background text-muted-foreground hover:text-foreground shadow-md transition-all hover:scale-110 active:scale-95 focus:outline-hidden focus:ring-1 focus:ring-ring"
              title="Remove profile image"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {errors.length > 0 && (
          <p className="text-center text-[10px] font-semibold text-destructive mt-1 max-w-[150px] line-clamp-2">
            {errors[0]}
          </p>
        )}
      </div>
    );
  }

  // 2. Variant: Standard Grid/Dashboard View
  return (
    <div className={cn("w-full space-y-4", className)}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple={multiple}
        disabled={disabled}
        accept={accept?.join(",")}
        onChange={handleFileInputChange}
      />

      {/* Main Drag-and-Drop Area */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={triggerBrowse}
        onKeyDown={(e) => {
          if (e.key === "Enter") triggerBrowse();
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center cursor-pointer rounded-xl border border-dashed border-muted-foreground/20 bg-muted/20 px-6 py-10 text-center outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all hover:bg-muted/30 hover:border-primary/50",
          isDragging && "border-primary bg-primary/5 scale-[0.99]",
          disabled && "cursor-not-allowed opacity-50 hover:bg-muted/20 hover:border-muted-foreground/20"
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="pb-2">
            <Upload className={cn("h-6 w-6 text-muted-foreground transition-transform duration-300", isDragging && "translate-y-[-4px] text-primary")} />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">{placeholder}</p>
            <p className="text-xs text-muted-foreground">
              Max file size: <span className="font-semibold text-foreground/80">{maxSize}MB</span> •{" "}
              {accept.length > 0 ? (
                <span>Allowed: {accept.map(a => a.replace("image/", "").replace("application/", "").toUpperCase()).join(", ")}</span>
              ) : (
                <span>Any file type</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Validation Errors Panel */}
      {errors.length > 0 && (
        <div className="rounded-lg bg-destructive/5 border border-destructive/10 p-3.5 space-y-1">
          {errors.map((err, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>{err}</span>
            </div>
          ))}
        </div>
      )}

      {/* File Queue List */}
      {activeQueue.length > 0 && (
        <div className="rounded-xl border overflow-hidden bg-background divide-y">
          {activeQueue.map(([key, item]) => {
            const isUploading = item.status === "uploading";
            const isSuccess = item.status === "success";
            const isError = item.status === "error";
            const isImage = item.file.type.startsWith("image/");
            const previewUrl = isImage ? getPreviewUrl(item.file) : undefined;

            return (
              <div
                key={key}
                className="flex flex-col p-3.5 transition-colors hover:bg-muted/10"
              >
                <div className="flex items-center gap-3.5">
                  {/* Thumbnail Preview or Icon */}
                  {isImage && previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={item.file.name}
                      className="h-10 w-10 rounded-lg object-cover shrink-0 border"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted border shrink-0">
                      {renderFileIcon(item.file)}
                    </div>
                  )}

                  {/* File Metadata */}
                  <div className="flex-1 min-w-0 leading-tight">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatBytes(item.file.size)}
                    </p>
                  </div>

                  {/* Operational Controls & Status Icons */}
                  <div className="flex items-center gap-3">
                    {isUploading && (
                      <span className="text-xs font-semibold text-primary font-mono shrink-0">
                        {item.progress}%
                      </span>
                    )}

                    {isSuccess && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    )}

                    {isError && (
                      <div className="flex items-center gap-1.5 text-destructive shrink-0">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span className="text-[11px] font-semibold hidden sm:inline max-w-[120px] truncate">
                          {item.error}
                        </span>
                      </div>
                    )}

                    {!disabled && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-md hover:bg-muted hover:text-foreground text-muted-foreground/60 p-0"
                        onClick={(e) => removeFile(key, item.file, e)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Inline Progress Bar for Uploading items */}
                {isUploading && (
                  <div className="w-full bg-muted rounded-full h-1 mt-3 overflow-hidden">
                    <div
                      className="bg-primary h-1 rounded-full transition-all duration-150 animate-pulse"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
