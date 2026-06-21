"use client";

/**
 * @title File Uploader
 * @description A beautiful drag-and-drop file uploader supporting local accumulation and async uploads.
 * @categories react, component
 */
import {
  FileText,
  FileSpreadsheet,
  FileArchive,
  File,
  X,
  AlertCircle,
  CheckCircle2,
  Camera,
  Upload,
} from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  onUpload?: (
    file: File,
    onProgress: (progress: number) => void,
  ) => Promise<string>;
  /** Fired after successful remote uploads, returning the list of remote URLs */
  onUploadComplete?: (urls: string[]) => void;

  /** Edit Mode: Pre-existing file URLs from server/database */
  initialUrls?: string[];
  /** Callback fired when a pre-existing file URL is removed */
  onRemoveInitial?: (url: string) => void;

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
  /** Fallback initials to show in avatar mode if no image is present */
  fallbackInitials?: string;
}

// Helper to generate a unique key for each raw File
const getFileKey = (file: File) =>
  `${file.name}-${file.size}-${file.lastModified}`;

// Helper to format bytes to human readable sizes
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Helper to validate MIME Types
const validateFileType = (file: File, acceptList?: string[]) => {
  if (!acceptList || acceptList.length === 0) {
    return true;
  }

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
  initialUrls = [],
  onRemoveInitial,
  multiple = false,
  maxFiles = 10,
  maxSize = 5, // Default 5MB
  accept = [],
  placeholder = "Drag & drop files here, or click to browse",
  className,
  disabled = false,
  variant = "default",
  fallbackInitials,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [localQueue, setLocalQueue] = React.useState<
    Record<string, FileStatus>
  >({});
  const [localInitialUrls, setLocalInitialUrls] = React.useState<string[]>(
    initialUrls || [],
  );
  const [errors, setErrors] = React.useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Keep track of blob URLs to revoke on unmount and prevent memory leaks
  const [previewUrls, setPreviewUrls] = React.useState<Record<string, string>>(
    {},
  );

  // Synchronize initialUrls prop to local state during render to avoid cascading renders in useEffect
  const serializedInitialUrls = initialUrls?.join(",") || "";
  const [prevSerializedInitialUrls, setPrevSerializedInitialUrls] =
    React.useState<string>(serializedInitialUrls);

  if (serializedInitialUrls !== prevSerializedInitialUrls) {
    setPrevSerializedInitialUrls(serializedInitialUrls);
    setLocalInitialUrls(initialUrls || []);
  }

  const activeQueue = React.useMemo(() => {
    if (!onUpload) {
      return (value || []).map((file) => {
        const key = getFileKey(file);
        const item: FileStatus = { file, progress: 0, status: "idle" };

        return [key, item] as [string, FileStatus];
      });
    }

    return Object.entries(localQueue);
  }, [localQueue, value, onUpload]);

  // Synchronize preview URLs during render to avoid accessing refs or triggering cascading renders in useEffect
  const activeKeys = React.useMemo(
    () => new Set(activeQueue.map(([key]) => key)),
    [activeQueue],
  );
  const [prevActiveQueueKeys, setPrevActiveQueueKeys] =
    React.useState<string>("");
  const currentActiveQueueKeys = Array.from(activeKeys).join(",");

  if (currentActiveQueueKeys !== prevActiveQueueKeys) {
    setPrevActiveQueueKeys(currentActiveQueueKeys);

    // 1. Identify URLs to revoke
    const nextPreviews = { ...previewUrls };
    let changed = false;

    Object.keys(previewUrls).forEach((key) => {
      if (!activeKeys.has(key)) {
        const url = previewUrls[key];

        if (url) {
          URL.revokeObjectURL(url);
        }

        delete nextPreviews[key];
        changed = true;
      }
    });

    // 2. Identify new URLs to create
    activeQueue.forEach(([key, item]) => {
      if (item.file.type.startsWith("image/") && !nextPreviews[key]) {
        nextPreviews[key] = URL.createObjectURL(item.file);
        changed = true;
      }
    });

    if (changed) {
      setPreviewUrls(nextPreviews);
    }
  }

  React.useEffect(() => {
    return () => {
      // Clean up all object URLs when component unmounts
      setPreviewUrls((prev) => {
        Object.values(prev).forEach((url) => URL.revokeObjectURL(url));

        return {};
      });
    };
  }, []);

  // Determine actual constraints depending on uploader variant
  const isAvatar = variant === "avatar";
  const actualMultiple = isAvatar ? false : multiple;
  const actualMaxFiles = isAvatar ? 1 : maxFiles;

  const handleFiles = async (fileList: FileList) => {
    if (disabled) {
      return;
    }

    setErrors([]);

    const incomingFiles = Array.from(fileList);
    const validIncoming: File[] = [];
    const newErrors: string[] = [];

    // Calculate current queue capacity including remaining server-side files
    const currentCount =
      (onUpload ? Object.keys(localQueue).length : value.length) +
      localInitialUrls.length;

    if (!actualMultiple && incomingFiles.length > 1) {
      newErrors.push(
        "Multi-selection is disabled. Only a single file is allowed.",
      );
      setErrors(newErrors);

      return;
    }

    if (
      actualMultiple &&
      currentCount + incomingFiles.length > actualMaxFiles
    ) {
      newErrors.push(
        `Maximum file limit exceeded. You can only upload up to ${actualMaxFiles} files.`,
      );
      setErrors(newErrors);

      return;
    }

    incomingFiles.forEach((file) => {
      // Validate Type
      if (!validateFileType(file, accept)) {
        newErrors.push(
          `"${file.name}" has an unsupported file extension or type.`,
        );

        return;
      }

      // Validate Size
      if (file.size / 1024 / 1024 > maxSize) {
        newErrors.push(
          `"${file.name}" exceeds the maximum ${maxSize}MB size limit.`,
        );

        return;
      }

      validIncoming.push(file);
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
    }

    if (validIncoming.length === 0) {
      return;
    }

    // --- Mode A: Local State Accumulation ---
    if (!onUpload) {
      if (actualMultiple) {
        const mergedFiles = [...value, ...validIncoming].slice(
          0,
          actualMaxFiles,
        );
        onChange?.(mergedFiles);
      } else {
        const firstIncoming = validIncoming[0];

        if (firstIncoming) {
          onChange?.([firstIncoming]);
        }

        // In single file mode, if a new image is selected, clear existing database URL
        const removedUrl = localInitialUrls[0];

        if (removedUrl) {
          setLocalInitialUrls([]);
          onRemoveInitial?.(removedUrl);
        }
      }

      return;
    }

    // --- Mode B: Immediate Remote Uploads ---
    const newStatuses: Record<string, FileStatus> = { ...localQueue };
    const uploadPromises: Promise<string | undefined>[] = [];

    // Reset single selection if multi is off
    if (!actualMultiple) {
      // Clear status lists
      Object.keys(newStatuses).forEach((key) => delete newStatuses[key]);

      // Clear existing server URL in single/avatar mode
      const removedUrl = localInitialUrls[0];

      if (removedUrl) {
        setLocalInitialUrls([]);
        onRemoveInitial?.(removedUrl);
      }
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
          if (!prev[key]) {
            return prev;
          }

          return {
            ...prev,
            [key]: { ...prev[key], progress },
          };
        });
      })
        .then((url) => {
          setLocalQueue((prev) => {
            if (!prev[key]) {
              return prev;
            }

            return {
              ...prev,
              [key]: {
                ...prev[key],
                progress: 100,
                status: "success" as const,
                url,
              },
            };
          });

          return url;
        })
        .catch((err) => {
          setLocalQueue((prev) => {
            if (!prev[key]) {
              return prev;
            }

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
      (url): url is string => typeof url === "string",
    );

    if (completedUrls.length > 0) {
      onUploadComplete?.(completedUrls);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    if (disabled) {
      return;
    }

    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled || !e.dataTransfer.files) {
      return;
    }

    void handleFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      void handleFiles(e.target.files);
    }

    // Reset value so selecting/uploading the exact same file again triggers onChange
    e.target.value = "";
  };

  const removeFile = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (onUpload) {
      setLocalQueue((prev) => {
        const next = { ...prev };
        delete next[key];

        return next;
      });
    } else {
      onChange?.(value.filter((f) => getFileKey(f) !== key));
    }
  };

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // 1. Clear any raw upload queue items
    if (onUpload) {
      const firstKey = Object.keys(localQueue)[0];

      if (firstKey) {
        setLocalQueue((prev) => {
          const next = { ...prev };
          delete next[firstKey];

          return next;
        });
      }
    } else {
      onChange?.([]);
    }

    // 2. Clear any existing database image URLs
    const removedUrl = localInitialUrls[0];

    if (removedUrl) {
      setLocalInitialUrls([]);
      onRemoveInitial?.(removedUrl);
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

    if (
      type.includes("sheet") ||
      type.includes("excel") ||
      type.includes("csv")
    ) {
      return <FileSpreadsheet className="h-5 w-5 shrink-0 text-emerald-600" />;
    }

    if (
      type.includes("zip") ||
      type.includes("tar") ||
      type.includes("rar") ||
      type.includes("compressed")
    ) {
      return <FileArchive className="h-5 w-5 shrink-0 text-amber-600" />;
    }

    if (
      type.includes("pdf") ||
      type.includes("word") ||
      type.includes("text")
    ) {
      return <FileText className="h-5 w-5 shrink-0 text-blue-600" />;
    }

    return <File className="h-5 w-5 shrink-0 text-slate-500" />;
  };

  // --- RENDERS ---

  // 1. Variant: Profile/Avatar Bubble View
  if (variant === "avatar") {
    const firstItemEntry = activeQueue[0];
    const firstKey = firstItemEntry ? firstItemEntry[0] : undefined;
    const firstItem = firstItemEntry ? firstItemEntry[1] : undefined;
    const localAvatarUrl = firstKey ? previewUrls[firstKey] : undefined;
    const isUploading = firstItem?.status === "uploading";
    const progress = firstItem?.progress || 0;

    // Unified avatar preview url selection (prioritizes local file, then initial url)
    const avatarUrl =
      localAvatarUrl ||
      (localInitialUrls.length > 0 ? localInitialUrls[0] : undefined);
    const initials = fallbackInitials?.trim().substring(0, 2).toUpperCase();

    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          disabled={disabled || isUploading}
          accept={accept?.join(",")}
          onChange={handleFileInputChange}
        />

        <div className="relative flex items-center justify-center">
          {/* Circular SVG Progress Ring surrounding the avatar during uploads */}
          {isUploading && (
            <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full scale-102 -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="45"
                className="stroke-muted/30"
                strokeWidth="3"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="45"
                className="stroke-primary transition-all duration-300"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                strokeLinecap="round"
              />
            </svg>
          )}

          <div
            role="button"
            tabIndex={disabled || isUploading ? -1 : 0}
            onClick={isUploading ? undefined : triggerBrowse}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isUploading) {
                triggerBrowse();
              }
            }}
            className={cn(
              "group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/40 outline-hidden transition-all hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isDragging && "scale-95 border-primary bg-primary/5",
              (disabled || isUploading) &&
                "cursor-not-allowed opacity-60 hover:border-muted-foreground/30",
            )}
            onDragOver={isUploading ? undefined : handleDragOver}
            onDragLeave={isUploading ? undefined : handleDragLeave}
            onDrop={isUploading ? undefined : handleDrop}
          >
            {avatarUrl ? (
              <>
                <img
                  src={avatarUrl}
                  alt="Profile Preview"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                {!disabled && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-all duration-200 group-hover:opacity-100">
                    <Camera className="mb-0.5 h-5 w-5 text-white" />
                    <span className="text-[9px] font-bold tracking-wider text-white uppercase">
                      Change
                    </span>
                  </div>
                )}
              </>
            ) : isUploading ? (
              <div className="z-10 flex animate-pulse flex-col items-center justify-center gap-0.5">
                <span className="font-mono text-xs font-bold text-primary">
                  {progress}%
                </span>
                <span className="text-[9px] font-semibold tracking-tight text-muted-foreground uppercase">
                  Uploading
                </span>
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/5 to-primary/15 font-semibold text-primary transition-all duration-300 group-hover:from-primary/10 group-hover:to-primary/20">
                {initials ? (
                  <span className="text-xl font-bold tracking-tight text-primary/80">
                    {initials}
                  </span>
                ) : (
                  <Camera className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                )}
              </div>
            )}
          </div>

          {avatarUrl && !disabled && !isUploading && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="absolute -top-1 -right-1 z-30 flex h-6 w-6 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-md transition-all hover:scale-110 hover:text-foreground focus:ring-1 focus:ring-ring focus:outline-hidden active:scale-95"
              title="Remove profile image"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {errors.length > 0 && (
          <p className="mt-1 line-clamp-2 max-w-[150px] text-center text-[10px] font-semibold text-destructive">
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
        multiple={actualMultiple}
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
          if (e.key === "Enter") {
            triggerBrowse();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/20 bg-muted/20 px-6 py-10 text-center outline-hidden transition-all hover:border-primary/50 hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isDragging && "scale-[0.99] border-primary bg-primary/5",
          disabled &&
            "cursor-not-allowed opacity-50 hover:border-muted-foreground/20 hover:bg-muted/20",
        )}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="pb-2">
            <Upload
              className={cn(
                "h-6 w-6 text-muted-foreground transition-transform duration-300",
                isDragging && "translate-y-[-4px] text-primary",
              )}
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">{placeholder}</p>
            <p className="text-xs text-muted-foreground">
              Max file size:{" "}
              <span className="font-semibold text-foreground/80">
                {maxSize}MB
              </span>{" "}
              •{" "}
              {accept.length > 0 ? (
                <span>
                  Allowed:{" "}
                  {accept
                    .map((a) =>
                      a
                        .replace("image/", "")
                        .replace("application/", "")
                        .toUpperCase(),
                    )
                    .join(", ")}
                </span>
              ) : (
                <span>Any file type</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Validation Errors Panel */}
      {errors.length > 0 && (
        <div className="space-y-1 rounded-lg border border-destructive/10 bg-destructive/5 p-3.5">
          {errors.map((err, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-xs text-destructive"
            >
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{err}</span>
            </div>
          ))}
        </div>
      )}

      {/* File Queue List containing both pre-existing server URLs and newly uploaded local files */}
      {(activeQueue.length > 0 || localInitialUrls.length > 0) && (
        <div className="divide-y overflow-hidden rounded-xl border bg-background shadow-xs">
          {/* Section A: Pre-existing database file URLs */}
          {localInitialUrls.map((url, idx) => {
            const fileName =
              url.substring(url.lastIndexOf("/") + 1) || `file-${idx}`;
            const isImage = url.match(/\.(jpeg|jpg|gif|png|webp|svg)/i);

            return (
              <div
                key={`initial-${url}-${idx}`}
                className="flex items-center gap-3.5 bg-muted/5 p-3.5 transition-colors hover:bg-muted/10"
              >
                {/* Thumbnail Preview or Icon */}
                {isImage ? (
                  <>
                    <img
                      src={url}
                      alt={fileName}
                      className="h-10 w-10 shrink-0 rounded-lg border object-cover"
                    />
                  </>
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted text-slate-500">
                    <FileText className="h-5 w-5" />
                  </div>
                )}

                {/* File Metadata */}
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-sm font-medium text-foreground">
                    {fileName}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Server Asset
                  </p>
                </div>

                {/* Status Indicator & Deletion */}
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="border-emerald-500/15 bg-emerald-500/10 px-2 py-0.5 text-[10px] tracking-wider text-emerald-600 uppercase"
                  >
                    Saved
                  </Badge>

                  {!disabled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-md p-0 text-muted-foreground/60 hover:bg-muted hover:text-foreground"
                      onClick={() => {
                        setLocalInitialUrls((prev) =>
                          prev.filter((u) => u !== url),
                        );
                        onRemoveInitial?.(url);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Section B: Client-side files currently uploading or completed */}
          {activeQueue.map(([key, item]) => {
            const isUploading = item.status === "uploading";
            const isSuccess = item.status === "success";
            const isError = item.status === "error";
            const isImage = item.file.type.startsWith("image/");
            const previewUrl = isImage ? previewUrls[key] : undefined;

            return (
              <div
                key={key}
                className="flex flex-col p-3.5 transition-colors hover:bg-muted/10"
              >
                <div className="flex items-center gap-3.5">
                  {/* Thumbnail Preview or Icon */}
                  {isImage && previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt={item.file.name}
                        className="h-10 w-10 shrink-0 rounded-lg border object-cover"
                      />
                    </>
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted">
                      {renderFileIcon(item.file)}
                    </div>
                  )}

                  {/* File Metadata */}
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.file.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatBytes(item.file.size)}
                    </p>
                  </div>

                  {/* Operational Controls & Status Icons */}
                  <div className="flex items-center gap-3">
                    {isUploading && (
                      <span className="shrink-0 font-mono text-xs font-semibold text-primary">
                        {item.progress}%
                      </span>
                    )}

                    {isSuccess && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    )}

                    {isError && (
                      <div className="flex shrink-0 items-center gap-1.5 text-destructive">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span className="hidden max-w-[120px] truncate text-[11px] font-semibold sm:inline">
                          {item.error}
                        </span>
                      </div>
                    )}

                    {!disabled && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-md p-0 text-muted-foreground/60 hover:bg-muted hover:text-foreground"
                        onClick={(e) => removeFile(key, e)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Inline Progress Bar for Uploading items */}
                {isUploading && (
                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-1 animate-pulse rounded-full bg-primary transition-all duration-150"
                      style={{
                        width: `${item.progress}%`,
                      }}
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
