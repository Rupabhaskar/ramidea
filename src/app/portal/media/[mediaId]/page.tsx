import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockMedia } from "@/lib/mock-data";

export default async function MediaDetailPage({ params }: { params: Promise<{ mediaId: string }> }) {
  const { mediaId } = await params;
  const media = mockMedia.find((m) => m.id === mediaId) ?? mockMedia[0];

  return (
    <div>
      <PageHeader title={media.name} breadcrumbs={[{ label: "Media", href: "/portal/media" }, { label: media.name }]} />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="aspect-video rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
          Preview
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div><span className="text-muted-foreground text-sm">Type</span><p className="font-medium capitalize">{media.type}</p></div>
            <div><span className="text-muted-foreground text-sm">Size</span><p className="font-medium">{(media.size / 1024 / 1024).toFixed(1)} MB</p></div>
            {media.duration && <div><span className="text-muted-foreground text-sm">Duration</span><p className="font-medium">{media.duration}s</p></div>}
            <div className="flex flex-wrap gap-1">
              {media.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
