"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadMedia } from "@/services/media-management-service";
import type { MediaType } from "@/types";

const MEDIA_TYPES: MediaType[] = ["image", "video", "gif", "poster"];

interface UploadMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advertiserId: string;
  uploadedBy: string;
}

export function UploadMediaDialog({
  open,
  onOpenChange,
  advertiserId,
  uploadedBy,
}: UploadMediaDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  const [type, setType] = useState<MediaType>("image");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setName("");
    setTags("");
    setType("image");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function parseTags(value: string): string[] {
    return value
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Media name is required");
      return;
    }
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setLoading(true);
    try {
      await uploadMedia({
        name,
        type,
        tags: parseTags(tags),
        uploadedBy,
        advertiserId,
        file,
      });
      toast.success(`"${name}" uploaded successfully`);
      resetForm();
      onOpenChange(false);
    } catch {
      toast.error("Failed to upload media");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetForm();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pr-8">
          <DialogTitle>Upload Media</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Add a creative with name, type, and tags for your campaigns
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 min-w-0">
          <div className="min-w-0">
            <Label htmlFor="media-name">Name</Label>
            <Input
              id="media-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sankranti Sale Banner"
              className="mt-1.5 w-full"
            />
          </div>

          <div className="min-w-0">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as MediaType)}>
              <SelectTrigger className="mt-1.5 w-full capitalize">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {MEDIA_TYPES.map((t) => (
                  <SelectItem key={t} value={t} className="capitalize">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-0">
            <Label htmlFor="media-tags">Tags</Label>
            <Input
              id="media-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="festival, retail, telugu"
              className="mt-1.5 w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">Separate tags with commas</p>
          </div>

          <div className="min-w-0">
            <Label>File</Label>
            <button
              type="button"
              className="mt-1.5 flex w-full min-w-0 flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center hover:bg-muted/30 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-2 shrink-0" />
              {file ? (
                <div className="w-full min-w-0 space-y-1 px-2">
                  <p className="text-sm font-medium break-all">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1_000_000).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium">Click to choose file</p>
                  <p className="text-xs text-muted-foreground mt-1">Image, video, GIF, or poster</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </button>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 min-w-0"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 min-w-0" disabled={loading}>
              {loading ? "Uploading..." : "Upload Media"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
