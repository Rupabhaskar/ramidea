"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileImage, FileVideo } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Media } from "@/types";

export function MediaCard({ media }: { media: Media }) {
  const Icon = media.type === "video" ? FileVideo : FileImage;
  return (
    <Card className="group overflow-hidden hover:border-primary/30 transition-colors">
      <div className="aspect-video bg-muted flex items-center justify-center">
        <Icon className="h-12 w-12 text-muted-foreground/50" />
      </div>
      <CardContent className="p-4">
        <p className="font-medium text-sm truncate">{media.name}</p>
        <p className="text-xs text-muted-foreground capitalize mt-0.5">{media.type}</p>
        {media.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {media.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{tag}</span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function FileUploader({ onUpload }: { onUpload?: (files: File[]) => void }) {
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setUploading(false);
        onUpload?.(Array.from(files));
      }
    }, 200);
  }, [onUpload]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      className={cn(
        "relative rounded-2xl border-2 border-dashed p-12 text-center transition-colors",
        dragging ? "border-primary bg-primary/5" : "border-border"
      )}
    >
      <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
      <p className="font-medium">Drag & drop files here</p>
      <p className="text-sm text-muted-foreground mt-1">Images, videos, posters, GIFs</p>
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {uploading && (
        <div className="mt-4 max-w-xs mx-auto">
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground mt-1">Uploading... {progress}%</p>
        </div>
      )}
    </div>
  );
}

export function MediaUploader(props: { onUpload?: (files: File[]) => void }) {
  return <FileUploader {...props} />;
}
