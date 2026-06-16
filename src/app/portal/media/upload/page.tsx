"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { MediaUploader } from "@/components/media/media-card";

export default function MediaUploadPage() {
  const router = useRouter();

  return (
    <div>
      <PageHeader
        title="Upload Media"
        breadcrumbs={[{ label: "Media", href: "/portal/media" }, { label: "Upload" }]}
      />
      <MediaUploader
        onUpload={() => {
          toast.success("Media uploaded successfully");
          router.push("/portal/media");
        }}
      />
    </div>
  );
}
