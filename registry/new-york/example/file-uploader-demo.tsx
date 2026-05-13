"use client";

import * as React from "react";
import { FileUploader } from "@/components/ui/file-uploader";
import { Button } from "@/components/ui/button";

export default function FileUploaderDemo() {
  // ==========================================
  // MODE A: Local Multipart Form State
  // ==========================================
  const [firstName, setFirstName] = React.useState("Nehry");
  const [lastName, setLastName] = React.useState("Guinto");
  const [avatarFiles, setAvatarFiles] = React.useState<File[]>([]);
  const [documentFiles, setDocumentFiles] = React.useState<File[]>([]);
  
  // Preloaded edit-mode server URLs
  const [avatarInitialUrl, setAvatarInitialUrl] = React.useState<string[]>([
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop"
  ]);
  const [documentInitialUrls, setDocumentInitialUrls] = React.useState<string[]>([
    "https://storage.angono.gov.ph/uploads/verification-id-2025.pdf"
  ]);

  const [formLogs, setFormLogs] = React.useState<string[]>([]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const logs: string[] = [];
    logs.push("========================================");
    logs.push("🚀 INITIATING MULTIPART FORM SUBMISSION");
    logs.push("========================================");
    logs.push(`Text Field [first_name]: "${firstName}"`);
    logs.push(`Text Field [last_name]: "${lastName}"`);
    
    if (avatarFiles.length > 0) {
      logs.push(`📷 Avatar: [NEW RAW FILE] -> "${avatarFiles[0].name}" (${(avatarFiles[0].size / 1024).toFixed(1)} KB)`);
    } else if (avatarInitialUrl.length > 0) {
      logs.push(`📷 Avatar: [KEPT SERVER URL] -> "${avatarInitialUrl[0]}"`);
    } else {
      logs.push(`📷 Avatar: [DELETED / CLEARED]`);
    }

    logs.push(`📁 Documents Kept: [${documentInitialUrls.length}]`);
    documentInitialUrls.forEach((url, idx) => {
      logs.push(`   -> Server File [${idx}]: "${url}"`);
    });

    logs.push(`📁 Documents Uploaded: [${documentFiles.length}]`);
    documentFiles.forEach((file, idx) => {
      logs.push(`   -> Raw File [${idx}]: "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`);
    });

    logs.push("========================================");
    logs.push("🎉 Payload compiled! Sent unified multipart request.");
    
    setFormLogs(logs);
    alert("Form gathered in state! Check the Live Submission Console below to see the payload.");
  };

  // ==========================================
  // MODE B: Direct Async Remote Upload State
  // ==========================================
  const [asyncLogs, setAsyncLogs] = React.useState<string[]>([]);

  // Simulated direct API upload chunk progress ticks
  const handleAsyncUpload = async (file: File, onProgress: (pct: number) => void): Promise<string> => {
    setAsyncLogs((prev) => [...prev, `Started async S3 stream upload for: "${file.name}"`]);
    
    let currentPct = 0;
    while (currentPct < 100) {
      await new Promise((resolve) => setTimeout(resolve, 220));
      currentPct += Math.floor(Math.random() * 20) + 10;
      if (currentPct > 100) currentPct = 100;
      onProgress(currentPct);
    }

    const mockS3Url = `https://s3.ap-southeast-1.amazonaws.com/angono-assets/${Date.now()}-${file.name}`;
    setAsyncLogs((prev) => [...prev, `✅ S3 Upload success! Saved to remote node: "${mockS3Url}"`]);
    return mockS3Url;
  };

  return (
    <div className="w-full max-w-xl mx-auto py-4 space-y-12">
      
      {/* ----------------- DEMO 1: LOCAL MULTIPART MODE ----------------- */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Use Case A</span>
          <h3 className="text-lg font-bold tracking-tight text-foreground">Local Multipart Save (Edit Mode)</h3>
          <p className="text-xs text-muted-foreground">
            No active API requests fire during selection. Raw files and kept/deleted server assets are held inside component state and submitted together in a single save transaction.
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="space-y-6">
            {/* Avatar & Personal Info */}
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="shrink-0 flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Avatar</span>
                <FileUploader
                  value={avatarFiles}
                  onChange={setAvatarFiles}
                  initialUrls={avatarInitialUrl}
                  onRemoveInitial={() => {
                    setAvatarInitialUrl([]);
                    setFormLogs((prev) => [...prev, "❌ Profile avatar URL cleared locally."]);
                  }}
                  fallbackInitials="JD"
                  accept={["image/*"]}
                  variant="avatar"
                />
              </div>

              {/* Inputs */}
              <div className="flex-1 w-full space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-9 rounded-lg border bg-background px-3 text-xs focus:outline-hidden focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-9 rounded-lg border bg-background px-3 text-xs focus:outline-hidden focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Verification Documents */}
            <div className="space-y-2 border-t pt-4">
              <div className="space-y-1 mb-2.5">
                <label className="text-xs font-semibold text-foreground">Verification Attachments</label>
                <p className="text-[10px] text-muted-foreground">Append new files or view pre-existing verification cards.</p>
              </div>
              
              <FileUploader
                value={documentFiles}
                onChange={setDocumentFiles}
                initialUrls={documentInitialUrls}
                onRemoveInitial={(url) => {
                  setDocumentInitialUrls((prev) => prev.filter((u) => u !== url));
                  setFormLogs((prev) => [...prev, `❌ Flagged server asset for deletion: ${url}`]);
                }}
                maxFiles={4}
                maxSize={5}
                accept={["image/*", "application/pdf"]}
                multiple
                placeholder="Upload verification certificates..."
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t">
            <Button type="submit" className="rounded-lg text-xs h-9 px-5">
              Save Profile Changes
            </Button>
          </div>
        </form>

        {/* Local Console Logs */}
        {formLogs.length > 0 && (
          <div className="space-y-2 rounded-xl border bg-card p-5 shadow-xs">
            <div className="flex flex-col gap-0.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Local Submission Payload Console
              </h5>
            </div>
            <div className="bg-slate-950 p-4 rounded-lg overflow-x-auto font-mono text-[10px] leading-relaxed text-emerald-400 max-h-[180px] overflow-y-auto border border-emerald-950/40">
              {formLogs.map((log, index) => (
                <div key={index} className="whitespace-pre truncate">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ----------------- DEMO 2: ASYNC REMOTE STORAGE MODE ----------------- */}
      <div className="space-y-4 border-t pt-10">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Use Case B</span>
          <h3 className="text-lg font-bold tracking-tight text-foreground">Direct Remote Streaming (AWS S3 / Storage Nodes)</h3>
          <p className="text-xs text-muted-foreground">
            Instantly streams selected files directly to AWS S3 buckets or remote cloud storage slots, reporting live percentage loaders and success checks before form completion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Circular SVG Avatar Streaming Demo */}
          <div className="md:col-span-1 rounded-xl border bg-card p-5 shadow-sm flex flex-col justify-between items-center text-center gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">S3 Avatar Loader</h4>
              <p className="text-[10px] text-muted-foreground">Triggers live SVG border animation on drop.</p>
            </div>
            
            <FileUploader
              onUpload={handleAsyncUpload}
              fallbackInitials="S3"
              accept={["image/*"]}
              variant="avatar"
            />
          </div>

          {/* Standard Grid Async Multi-Uploader */}
          <div className="md:col-span-2 rounded-xl border bg-card p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Direct S3 File Streamer</h4>
              <p className="text-[10px] text-muted-foreground">Streams multiple document files in parallel uploading tracks.</p>
            </div>

            <FileUploader
              onUpload={handleAsyncUpload}
              onUploadComplete={(urls) => {
                setAsyncLogs((prev) => [...prev, `🎉 Group upload completed! Returned URLs: ${JSON.stringify(urls)}`]);
              }}
              maxSize={10}
              multiple
              placeholder="Stream files directly to S3 Bucket..."
            />
          </div>
        </div>

        {/* Remote Console Logs */}
        {asyncLogs.length > 0 && (
          <div className="space-y-2 rounded-xl border bg-card p-5 shadow-xs">
            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Remote API Upload Connection Stream
            </h5>
            <div className="bg-slate-950 p-4 rounded-lg overflow-x-auto font-mono text-[10px] leading-relaxed text-blue-400 max-h-[180px] overflow-y-auto border border-blue-950/40">
              {asyncLogs.map((log, index) => (
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
