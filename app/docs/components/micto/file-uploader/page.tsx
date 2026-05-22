import { CodeBlock } from "@/components/code-block";
import { InstallCommandTabs } from "@/components/install-command-tabs";
import { Badge } from "@/components/ui/badge";
import { PropsTable } from "@/components/props-table";
import { ComponentPreview } from "@/components/component-preview";
import { getCode, highlightCode } from "@/lib/get-code";
import { DocsHeader } from "@/components/docs-header";
import { DocsSectionHeading } from "@/components/docs-section-heading";
import FileUploaderDemo from "@/registry/new-york/example/file-uploader-demo";

const installCommands = [
  {
    label: "pnpm",
    value:
      "pnpm dlx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/file-uploader.json",
  },
  {
    label: "npm",
    value:
      "npx shadcn@latest add https://micto-ui-kit.misangono.net/r/micto/file-uploader.json",
  },
];

const basicUsageCode = `import { useState } from "react"
import { FileUploader } from "@/components/micto/file-uploader"

export default function DocumentForm() {
  const [files, setFiles] = useState<File[]>([])
  
  // Track pre-existing server files on edit
  const [existingUrls, setExistingUrls] = useState<string[]>([
    "https://storage.gov.ph/uploads/existing-document.pdf"
  ])

  return (
    <FileUploader 
      value={files} 
      onChange={setFiles} 
      initialUrls={existingUrls}
      onRemoveInitial={(removedUrl) => {
        setExistingUrls(prev => prev.filter(url => url !== removedUrl))
        console.log("Flagged database ID for deletion:", removedUrl)
      }}
      accept={["image/*", "application/pdf"]}
      maxSize={5} 
      multiple 
      placeholder="Upload supporting docs..."
    />
  )
}`;

const avatarUsageCode = `import { useState } from "react"
import { FileUploader } from "@/components/micto/file-uploader"

export default function ProfileSettings() {
  const [profileFiles, setProfileFiles] = useState<File[]>([])
  
  // Pre-load existing avatar URL or fallback to NH
  const [avatarUrl, setAvatarUrl] = useState<string[]>([
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
  ])

  return (
    <FileUploader 
      value={profileFiles} 
      onChange={setProfileFiles} 
      initialUrls={avatarUrl}
      onRemoveInitial={() => setAvatarUrl([])}
      fallbackInitials="NH"
      accept={["image/*"]}
      variant="avatar" 
    />
  )
}`;

const propsData = [
  {
    name: "value",
    type: "File[]",
    default: "[]",
    description: "The list of raw Files held in the local state (Mode A: Form Mode).",
  },
  {
    name: "onChange",
    type: "(files: File[]) => void",
    default: "undefined",
    description: "State setter callback triggered when files are chosen or dismissed (Mode A).",
  },
  {
    name: "onUpload",
    type: "(file: File, onProgress: (progress: number) => void) => Promise<string>",
    default: "undefined",
    description:
      "Remote uploader handler. If supplied, files are uploaded immediately, tracking progress (Mode B: Remote Mode).",
  },
  {
    name: "onUploadComplete",
    type: "(urls: string[]) => void",
    default: "undefined",
    description: "Callback triggered with successfully uploaded string URLs when direct uploads finish (Mode B).",
  },
  {
    name: "initialUrls",
    type: "string[]",
    default: "[]",
    description: "Pre-existing server URLs to display in the uploader queue during Edit scenarios.",
  },
  {
    name: "onRemoveInitial",
    type: "(url: string) => void",
    default: "undefined",
    description: "Callback triggered when a user deletes a pre-existing server URL, notifying the parent form to delete or unlink it.",
  },
  {
    name: "multiple",
    type: "boolean",
    default: "false",
    description: "Allows dropping and choosing multiple files concurrently (auto-forces false in avatar mode).",
  },
  {
    name: "maxFiles",
    type: "number",
    default: "10",
    description: "Maximum file quantity limit cap.",
  },
  {
    name: "maxSize",
    type: "number",
    default: "5",
    description: "Maximum allowable size limit for a single file in megabytes (MB).",
  },
  {
    name: "accept",
    type: "string[]",
    default: "[]",
    description: "Supported MIME formats or extension filters, e.g. ['image/*', 'application/pdf'].",
  },
  {
    name: "variant",
    type: "'default' | 'avatar'",
    default: "'default'",
    description: "Layout theme. Renders standard dropzone grid or circular bubble profile settings.",
  },
  {
    name: "fallbackInitials",
    type: "string",
    default: "undefined",
    description: "Circular placeholder typography characters shown when no avatar image or raw local file is present.",
  },
];

export default async function FileUploaderPage() {
  const previewRawCode = getCode(
    "registry/new-york/example/file-uploader-demo.tsx",
  );
  const previewHtml = await highlightCode(previewRawCode);
  const basicUsageHtml = await highlightCode(basicUsageCode);
  const avatarUsageHtml = await highlightCode(avatarUsageCode);

  const headerBadges = (
    <>
      <Badge
        variant="secondary"
        className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider"
      >
        React
      </Badge>
      <Badge
        variant="outline"
        className="rounded-md px-2 py-0.5 text-[11px] uppercase tracking-wider border-primary/20 bg-primary/5 text-primary font-medium"
      >
        Native Drag & Drop
      </Badge>
    </>
  );

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-20 mt-8">
      <DocsHeader
        title="File Uploader"
        description="A beautiful drag-and-drop file uploader supporting local accumulation, direct async uploads, image blob thumbnails, and avatar profiles."
        badges={headerBadges}
      />

      {/* Main Content */}
      <div className="space-y-16">
        {/* Preview Section */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Interactive Demo"
            description="Toggle through standard forms, avatar profile picture updates, and live-streaming upload progress bars."
          />
          <ComponentPreview code={previewRawCode} html={previewHtml}>
            <FileUploaderDemo />
          </ComponentPreview>
        </section>

        {/* Installation Section */}
        <section className="space-y-6">
          <DocsSectionHeading title="Installation" />
          <div className="rounded-xl border bg-muted/40 p-1">
            <InstallCommandTabs
              commands={installCommands}
              defaultValue="pnpm"
            />
          </div>
        </section>

        {/* Usage A Section */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Form File Collection"
            description="Allows standard local image or document gathering. Files are saved in state arrays to submit together on form actions."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={basicUsageCode} html={basicUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Usage B Section */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="Avatar Mode Setup"
            description="Saves a single file inside an elegant circular profile settings overlay, perfect for user settings edit screens."
          />
          <div className="overflow-hidden rounded-xl border">
            <CodeBlock code={avatarUsageCode} html={avatarUsageHtml} language="tsx" />
          </div>
        </section>

        {/* Props Section */}
        <section className="space-y-6">
          <DocsSectionHeading
            title="API Reference"
            description="Configure the component using the following properties."
          />
          <PropsTable data={propsData} />
        </section>
      </div>
    </div>
  );
}


