"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { MediaCard } from "@/components/media/media-card";
import { UploadMediaDialog } from "@/components/media/upload-media-dialog";
import { ClientAccountGate } from "@/components/client/client-account-gate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMedia } from "@/hooks/use-media";
import { useClientAccount } from "@/hooks/use-bookings";
import { useAuthStore } from "@/store/auth-store";

export default function ClientMediaPage() {
  const { client, loading, error } = useClientAccount();
  const user = useAuthStore((s) => s.user);
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <ClientAccountGate loading={loading} error={error}>
      {client && user && (
        <ClientMediaContent
          advertiserId={client.id}
          uploadedBy={user.id}
          uploadOpen={uploadOpen}
          onUploadOpenChange={setUploadOpen}
        />
      )}
    </ClientAccountGate>
  );
}

function ClientMediaContent({
  advertiserId,
  uploadedBy,
  uploadOpen,
  onUploadOpenChange,
}: {
  advertiserId: string;
  uploadedBy: string;
  uploadOpen: boolean;
  onUploadOpenChange: (open: boolean) => void;
}) {
  const { media, loading } = useMedia(advertiserId);

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Media"
        description="Upload and manage your ad creatives"
        breadcrumbs={[{ label: "Client", href: "/client/dashboard" }, { label: "Media" }]}
        actions={
          <Button size="sm" onClick={() => onUploadOpenChange(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        }
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading media...</p>
      ) : media.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="font-medium">No media yet</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Upload images, videos, or posters for your ad campaigns
          </p>
          <Button onClick={() => onUploadOpenChange(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {media.map((m) => (
            <div key={m.id} className="space-y-2">
              <MediaCard media={m} />
              {m.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 px-1">
                  {m.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] capitalize">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <UploadMediaDialog
        open={uploadOpen}
        onOpenChange={onUploadOpenChange}
        advertiserId={advertiserId}
        uploadedBy={uploadedBy}
      />
    </div>
  );
}
