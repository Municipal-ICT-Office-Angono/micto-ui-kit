"use client";

import * as React from "react";
import { FileUploader } from "@/components/ui/file-uploader";
import { Button } from "@/components/ui/button";

export default function FileUploaderDemo() {
  const [formFiles, setFormFiles] = React.useState<File[]>([]);
  const [avatarFiles, setAvatarFiles] = React.useState<File[]>([]);
  const [asyncLog, setAsyncLog] = React.useState<string[]>([]);

  // Simulated Async Uploader mapping progress ticks
  const handleAsyncUpload = async (file: File, onProgress: (pct: number) => void): Promise<string> => {
    setAsyncLog((prev) => [...prev, `Started upload for: "${file.name}"`]);
    
    // Simulate real chunked API stream upload over 2.5 seconds
    let currentPct = 0;
    while (currentPct < 100) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      currentPct += Math.floor(Math.random() * 15) + 10;
      if (currentPct > 100) currentPct = 100;
      onProgress(currentPct);
    }

    setAsyncLog((prev) => [...prev, `Upload success: "${file.name}" -> resolved remote URL`]);
    return `https://storage.angono.gov.ph/uploads/${Date.now()}-${file.name}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Mock Form Submitted!\nFiles gathered in state: ${formFiles.length}\nFiles detailed: ${formFiles.map(f => f.name).join(", ")}`
    );
    console.log("Submitting standard multipart Files:", formFiles);
  };

  return (
    <div className="w-full max-w-xl mx-auto py-4 space-y-12">
      {/* 1. Local State Form Accumulator */}
      <form onSubmit={handleFormSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-semibold tracking-tight text-foreground">
            Form Mode (Local File State)
          </h4>
          <p className="text-xs text-muted-foreground">
            Saves raw file objects inside local states. Max size: 2MB. Only JPG, PNG, and PDF files are allowed.
          </p>
        </div>
        <div className="pt-2">
          <FileUploader
            value={formFiles}
            onChange={setFormFiles}
            maxFiles={3}
            maxSize={2}
            accept={["image/*", "application/pdf"]}
            multiple
            placeholder="Drag and drop images or PDFs, or click to browse..."
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={formFiles.length === 0} className="rounded-lg text-xs h-9 px-4">
            Submit Form ({formFiles.length} files)
          </Button>
        </div>
      </form>

      {/* 2. Circular Profile Picture Avatar View */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex-1 space-y-1.5">
          <h4 className="text-sm font-semibold tracking-tight text-foreground">
            Avatar Selector Variant
          </h4>
          <p className="text-xs text-muted-foreground">
            An elegant profile picture uploader with a circular hover filter. Drag or pick an image to test local image rendering.
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center">
          <FileUploader
            value={avatarFiles}
            onChange={setAvatarFiles}
            maxSize={1}
            accept={["image/*"]}
            variant="avatar"
          />
        </div>
      </div>

      {/* 3. Simulated Async Streaming */}
      <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <h4 className="text-sm font-semibold tracking-tight text-foreground">
            Async API Stream (Immediate Remote Mode)
          </h4>
          <p className="text-xs text-muted-foreground">
            Immediately starts simulated parallel server requests, displaying real-time loading percentages and success ticks.
          </p>
        </div>
        <div className="pt-2">
          <FileUploader
            onUpload={handleAsyncUpload}
            onUploadComplete={(urls) => console.log("Uploads complete! Server paths returned:", urls)}
            maxSize={50}
            multiple
            placeholder="Directly stream files to our storage node..."
          />
        </div>

        {asyncLog.length > 0 && (
          <div className="pt-3 border-t">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Network Console Output
            </p>
            <div className="bg-muted p-3 rounded-lg max-h-[110px] overflow-y-auto font-mono text-[10px] leading-relaxed text-primary space-y-0.5">
              {asyncLog.map((log, index) => (
                <div key={index} className="truncate">
                  {`> ${log}`}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
