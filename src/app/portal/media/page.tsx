"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Grid, List } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { MediaCard } from "@/components/media/media-card";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/data-table";
import { mockMedia } from "@/lib/mock-data";

export default function MediaPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const filtered = mockMedia.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Upload and manage images, videos, and posters"
        breadcrumbs={[{ label: "Portal", href: "/portal" }, { label: "Media" }]}
        actions={
          <Button size="sm" asChild>
            <Link href="/portal/media/upload"><Plus className="h-4 w-4 mr-2" />Upload</Link>
          </Button>
        }
      />
      <div className="flex items-center justify-between mb-6">
        <SearchBar placeholder="Search media..." value={search} onChange={setSearch} className="max-w-sm" />
        <div className="flex rounded-lg border border-border p-0.5">
          <Button variant={view === "grid" ? "default" : "ghost"} size="sm" onClick={() => setView("grid")}><Grid className="h-4 w-4" /></Button>
          <Button variant={view === "list" ? "default" : "ghost"} size="sm" onClick={() => setView("list")}><List className="h-4 w-4" /></Button>
        </div>
      </div>
      <div className={view === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4" : "space-y-2"}>
        {filtered.map((media) => (
          <Link key={media.id} href={`/portal/media/${media.id}`}>
            <MediaCard media={media} />
          </Link>
        ))}
      </div>
    </div>
  );
}
