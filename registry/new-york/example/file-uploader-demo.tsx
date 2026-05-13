"use client";

import * as React from "react";
import { FileUploader } from "@/components/ui/file-uploader";
import { Button } from "@/components/ui/button";

export default function FileUploaderDemo() {
  // 1. Text input states for the form
  const [firstName, setFirstName] = React.useState("Nehry");
  const [lastName, setLastName] = React.useState("Guinto");

  // 2. Local multipart file collection states (Mode A: State-driven)
  const [avatarFiles, setAvatarFiles] = React.useState<File[]>([]);
  const [documentFiles, setDocumentFiles] = React.useState<File[]>([]);

  // 3. Edit Mode Preloaded Server URLs (Edit-side state tracking)
  const [avatarInitialUrl, setAvatarInitialUrl] = React.useState<string[]>([
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop"
  ]);
  const [documentInitialUrls, setDocumentInitialUrls] = React.useState<string[]>([
    "https://storage.angono.gov.ph/uploads/verification-id-2025.pdf"
  ]);

  // Console output logging state
  const [consoleLogs, setConsoleLogs] = React.useState<string[]>([]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear and log the payload structure
    const newLogs: string[] = [];
    newLogs.push("========================================");
    newLogs.push("🚀 INITIATING MULTIPART FORM SUBMISSION");
    newLogs.push("========================================");
    newLogs.push(`Text Field [first_name]: "${firstName}"`);
    newLogs.push(`Text Field [last_name]: "${lastName}"`);
    
    // Log Avatar payload
    if (avatarFiles.length > 0) {
      newLogs.push(`📷 Avatar: [NEW RAW FILE] -> "${avatarFiles[0].name}" (${(avatarFiles[0].size / 1024).toFixed(1)} KB)`);
    } else if (avatarInitialUrl.length > 0) {
      newLogs.push(`📷 Avatar: [KEPT SERVER URL] -> "${avatarInitialUrl[0]}"`);
    } else {
      newLogs.push(`📷 Avatar: [DELETED / CLEARED]`);
    }

    // Log Supporting Documents payload
    newLogs.push(`📁 Documents Kept: [${documentInitialUrls.length}]`);
    documentInitialUrls.forEach((url, idx) => {
      newLogs.push(`   -> Server File [${idx}]: "${url}"`);
    });

    newLogs.push(`📁 Documents Uploaded: [${documentFiles.length}]`);
    documentFiles.forEach((file, idx) => {
      newLogs.push(`   -> Raw File [${idx}]: "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`);
    });

    newLogs.push("========================================");
    newLogs.push("🎉 Payload structured! Ready to send to server node...");
    
    setConsoleLogs(newLogs);
    alert("Form values gathered locally in state! Check the Live Submission Console below to see the payload structure.");
  };

  return (
    <div className="w-full max-w-xl mx-auto py-4 space-y-8">
      {/* Unified Profile Settings & Local Saving Form */}
      <form onSubmit={handleFormSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex flex-col gap-1.5 border-b pb-4">
          <h4 className="text-base font-semibold tracking-tight text-foreground">
            Account Profile Settings
          </h4>
          <p className="text-xs text-muted-foreground">
            Demonstrates a single edit form containing text fields, a profile avatar, and attachments. All files are collected **locally** in state and saved in a single unified request.
          </p>
        </div>

        {/* Form Grid */}
        <div className="space-y-6">
          {/* Avatar & Personal Info Row */}
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            {/* Avatar - Fully Local Mode */}
            <div className="shrink-0 flex flex-col items-center gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground">Profile Picture</span>
              <FileUploader
                value={avatarFiles}
                onChange={setAvatarFiles}
                initialUrls={avatarInitialUrl}
                onRemoveInitial={() => {
                  setAvatarInitialUrl([]);
                  setConsoleLogs((prev) => [...prev, "❌ Profile Picture URL cleared from state"]);
                }}
                fallbackInitials="JD"
                accept={["image/*"]}
                variant="avatar"
                className="scale-105"
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

          {/* Verification Supporting Documents */}
          <div className="space-y-2 border-t pt-4">
            <div className="space-y-1 mb-2.5">
              <label className="text-xs font-semibold text-foreground">Verification Attachments</label>
              <p className="text-[10px] text-muted-foreground">Attach proof of identity (e.g. Passport, Drivers License). Maximum 5MB.</p>
            </div>
            
            <FileUploader
              value={documentFiles}
              onChange={setDocumentFiles}
              initialUrls={documentInitialUrls}
              onRemoveInitial={(url) => {
                setDocumentInitialUrls((prev) => prev.filter((u) => u !== url));
                setConsoleLogs((prev) => [...prev, `❌ Server file flagged for deletion: ${url}`]);
              }}
              maxFiles={4}
              maxSize={5}
              accept={["image/*", "application/pdf"]}
              multiple
              placeholder="Upload verification certificates or photos..."
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2 border-t">
          <Button type="submit" className="rounded-lg text-xs h-9 px-5">
            Save Profile Changes
          </Button>
        </div>
      </form>

      {/* Live Submission Console Logs */}
      {consoleLogs.length > 0 && (
        <div className="space-y-2 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-1">
            <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Live Multipart Request Payload Console
            </h5>
            <p className="text-[10px] text-muted-foreground leading-tight">
              Shows how the client state is compiled into a single multipart save request. Notice that no S3 API uploads were fired beforehand!
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg overflow-x-auto font-mono text-[10px] leading-relaxed text-emerald-400 max-h-[220px] overflow-y-auto border border-emerald-950/40">
            {consoleLogs.map((log, index) => (
              <div key={index} className="whitespace-pre truncate">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
