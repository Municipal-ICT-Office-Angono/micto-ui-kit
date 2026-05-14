"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { ZoomIn, ZoomOut, RotateCw, Download, Printer, Maximize2, Minimize2, FileText, PanelRight, PanelLeft, X } from "lucide-react";

// ─── Types & Context ──────────────────────────────────────────────────────────

export type DocumentType = "pdf" | "image" | "unsupported";

interface DocumentViewerContextValue {
  url: string;
  title?: string;
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  rotation: number;
  setRotation: React.Dispatch<React.SetStateAction<number>>;
  isFullscreen: boolean;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarPosition: "left" | "right";
  fileType: DocumentType;
  isDialog?: boolean;
  onDownload?: () => void;
  onPrint?: () => void;
}

const DocumentViewerContext = React.createContext<DocumentViewerContextValue>({
  url: "",
  title: "",
  scale: 1,
  setScale: () => {},
  rotation: 0,
  setRotation: () => {},
  isFullscreen: false,
  setIsFullscreen: () => {},
  sidebarOpen: true,
  setSidebarOpen: () => {},
  sidebarPosition: "right",
  fileType: "pdf",
});

// ─── Root Provider / Wrapper ──────────────────────────────────────────────────

export interface DocumentViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string;
  title?: string;
  initialScale?: number;
  sidebarPosition?: "left" | "right";
  isDialog?: boolean;
  onDownload?: () => void;
  onPrint?: () => void;
}

export const DocumentViewer = React.forwardRef<HTMLDivElement, DocumentViewerProps>(
  ({ className, url, title, initialScale = 1, sidebarPosition = "right", isDialog = false, onDownload, onPrint, children, ...props }, ref) => {
    const [scale, setScale] = React.useState(initialScale);
    const [rotation, setRotation] = React.useState(0);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [sidebarOpen, setSidebarOpen] = React.useState(!isDialog);

    React.useEffect(() => {
      if (isFullscreen) {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = originalOverflow;
        };
      }
    }, [isFullscreen]);

    const fileType: DocumentType = React.useMemo(() => {
      const lower = url.toLowerCase();
      if (lower.endsWith(".pdf") || lower.includes("pdf")) return "pdf";
      if (lower.match(/\.(jpeg|jpg|png|gif|webp)$/i)) return "image";
      return "image"; // Default fallback for generic scanned previews
    }, [url]);

    return (
      <DocumentViewerContext.Provider
        value={{
          url,
          title,
          scale,
          setScale,
          rotation,
          setRotation,
          isFullscreen,
          setIsFullscreen,
          sidebarOpen,
          setSidebarOpen,
          sidebarPosition,
          fileType,
          isDialog,
          onDownload,
          onPrint,
        }}
      >
        <div
          ref={ref}
          className={cn(
            "relative flex flex-col rounded-xl border bg-background text-foreground shadow-sm overflow-hidden min-h-[500px]",
            isFullscreen && "fixed inset-0 z-50 rounded-none border-0 h-screen w-screen",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </DocumentViewerContext.Provider>
    );
  }
);
DocumentViewer.displayName = "DocumentViewer";

// ─── Toolbar Header ───────────────────────────────────────────────────────────

export interface DocumentViewerToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  showZoom?: boolean;
  showRotate?: boolean;
  showFullscreen?: boolean;
  showSidebarToggle?: boolean;
  actions?: React.ReactNode;
}

export const DocumentViewerToolbar = React.forwardRef<HTMLDivElement, DocumentViewerToolbarProps>(
  ({ className, showZoom = true, showRotate = true, showFullscreen, showSidebarToggle = true, actions, ...props }, ref) => {
    const {
      title,
      scale,
      setScale,
      setRotation,
      isFullscreen,
      setIsFullscreen,
      setSidebarOpen,
      sidebarPosition,
      fileType,
      isDialog,
      onDownload,
      onPrint,
    } = React.useContext(DocumentViewerContext);

    const handleZoomIn = () => setScale((s) => Math.min(3, s + 0.25));
    const handleZoomOut = () => setScale((s) => Math.max(0.5, s - 0.25));
    const handleResetZoom = () => setScale(1);
    const handleRotateCw = () => setRotation((r) => (r + 90) % 360);

    const effectiveShowFullscreen = showFullscreen ?? !isDialog;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-muted/30 px-4 py-2.5 select-none",
          className
        )}
        {...props}
      >
        {/* Left: Title & Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {showSidebarToggle && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 px-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setSidebarOpen((open) => !open)}
                  >
                    {sidebarPosition === "left" ? <PanelLeft className="size-4" /> : <PanelRight className="size-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Toggle Info Panel</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <div className="flex items-center gap-2">
            <FileText className="size-4.5 text-primary shrink-0" />
            <span className="text-xs font-bold truncate max-w-[200px] sm:max-w-xs">{title}</span>
            <Badge variant="secondary" className="text-[10px] font-mono font-medium px-1.5 py-0.2">
              {fileType.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Center/Right: Viewing Controls */}
        <div className="flex items-center gap-1.5">
          {actions && <div className="flex items-center gap-1.5 mr-2">{actions}</div>}

          {showZoom && fileType === "image" && (
            <div className="flex items-center bg-background rounded-md border border-border/60 p-0.5 shadow-xs">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 px-0" onClick={handleZoomOut}>
                      <ZoomOut className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Zoom Out</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 px-2 font-mono text-[11px]" onClick={handleResetZoom}>
                      {Math.round(scale * 100)}%
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Reset Zoom</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 px-0" onClick={handleZoomIn}>
                      <ZoomIn className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Zoom In</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {showRotate && fileType === "image" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 px-0" onClick={handleRotateCw}>
                    <RotateCw className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Rotate 90°</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {onDownload && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 px-0" onClick={onDownload}>
                    <Download className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Download File</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {onPrint && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 px-0" onClick={onPrint}>
                    <Printer className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Print Document</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {effectiveShowFullscreen && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 px-0"
                    onClick={() => setIsFullscreen((f) => !f)}
                  >
                    {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {isDialog && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogClose asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 px-0 text-muted-foreground hover:text-foreground ml-1">
                      <X className="size-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </DialogClose>
                </TooltipTrigger>
                <TooltipContent side="bottom">Close Viewer</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    );
  }
);
DocumentViewerToolbar.displayName = "DocumentViewerToolbar";

// ─── Canvas / Viewport Area ───────────────────────────────────────────────────

export const DocumentViewerCanvas = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { url, scale, rotation, fileType } = React.useContext(DocumentViewerContext);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-1 items-center justify-center bg-muted/10 overflow-auto p-6 min-h-[400px]",
          className
        )}
        {...props}
      >
        {fileType === "pdf" ? (
          <object
            data={url}
            type="application/pdf"
            className="w-full h-full min-h-[500px] rounded-lg shadow-sm border border-border/40"
          >
            <div className="flex flex-col items-center justify-center p-6 text-center h-[500px] bg-muted/20 rounded-lg border border-dashed border-border/60">
              <FileText className="size-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground font-medium mb-1">PDF Preview Fallback</p>
              <a href={url} target="_blank" rel="noreferrer" className="text-xs text-primary underline hover:text-primary/80">
                Open Document Directly
              </a>
            </div>
          </object>
        ) : (
          <div className="relative transition-transform duration-300 ease-out flex items-center justify-center" style={{ transform: `scale(${scale})` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Document Preview"
              style={{ transform: `rotate(${rotation}deg)` }}
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md border border-border/40 transition-transform duration-300 ease-out bg-background"
            />
          </div>
        )}
      </div>
    );
  }
);
DocumentViewerCanvas.displayName = "DocumentViewerCanvas";

// ─── Sidebar Metadata Pane ────────────────────────────────────────────────────

export interface DocumentViewerSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
}

export const DocumentViewerSidebar = React.forwardRef<HTMLDivElement, DocumentViewerSidebarProps>(
  ({ className, width = "w-80", children, ...props }, ref) => {
    const { sidebarOpen, sidebarPosition } = React.useContext(DocumentViewerContext);

    if (!sidebarOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col border-border/60 bg-background/95 backdrop-blur-xs p-6 overflow-y-auto shrink-0 transition-all duration-300 ease-in-out shadow-xs md:h-full md:max-h-full min-h-0",
          sidebarPosition === "left" ? "border-r order-first" : "border-l order-last",
          width,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DocumentViewerSidebar.displayName = "DocumentViewerSidebar";

// ─── Modal / Dialog Lightbox Wrapper ──────────────────────────────────────────

export interface DocumentViewerDialogProps {
  trigger: React.ReactNode;
  url: string;
  title?: string;
  children: React.ReactNode;
}

export function DocumentViewerDialog({ trigger, url, title, children }: DocumentViewerDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent showCloseButton={false} className="max-w-[92vw] sm:max-w-[92vw] !w-[1400px] h-[92vh] p-0 overflow-hidden flex flex-col rounded-xl border-border/60 shadow-xl bg-background">
        <DialogTitle className="sr-only">{title ?? "Document Viewer Modal"}</DialogTitle>
        <DocumentViewer url={url} title={title} isDialog className="border-0 shadow-none h-full rounded-none">
          {children}
        </DocumentViewer>
      </DialogContent>
    </Dialog>
  );
}
