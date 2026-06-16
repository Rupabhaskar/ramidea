"use client";

import { use } from "react";
import Link from "next/link";
import { Play, Pause, Square, RotateCcw, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockScreens } from "@/lib/mock-data";
import { formatRelative } from "@/lib/utils";
import { sendPlayerCommand } from "@/services";
import { toast } from "sonner";

export default function ScreenDetailPage({ params }: { params: Promise<{ screenId: string }> }) {
  const { screenId } = use(params);
  const screen = mockScreens.find((s) => s.id === screenId) ?? mockScreens[0];

  const sendCommand = async (action: "play" | "pause" | "stop" | "restart" | "refresh" | "mute") => {
    await sendPlayerCommand(screen.id, action);
    toast.success(`Command sent: ${action}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={screen.name}
        description={screen.location}
        breadcrumbs={[
          { label: "Screens", href: "/portal/screens" },
          { label: screen.name },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={screen.status} />
            <Button variant="outline" size="sm" asChild>
              <Link href={`/portal/screens/${screen.id}/edit`}>Edit</Link>
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {[
          { action: "play" as const, icon: Play, label: "Play" },
          { action: "pause" as const, icon: Pause, label: "Pause" },
          { action: "stop" as const, icon: Square, label: "Stop" },
          { action: "restart" as const, icon: RotateCcw, label: "Restart" },
          { action: "refresh" as const, icon: RefreshCw, label: "Refresh" },
          { action: "mute" as const, icon: VolumeX, label: "Mute" },
        ].map(({ action, icon: Icon, label }) => (
          <Button key={action} variant="outline" size="sm" onClick={() => sendCommand(action)}>
            <Icon className="h-4 w-4 mr-1" />{label}
          </Button>
        ))}
        <Button variant="outline" size="sm"><Volume2 className="h-4 w-4 mr-1" />Volume</Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Screenshot Preview</CardTitle></CardHeader>
              <CardContent>
                <div className="aspect-video rounded-xl bg-muted flex flex-col items-center justify-center text-muted-foreground">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full mb-2">Admin Only</span>
                  Live screen capture
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Device Health</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {screen.health && (
                  <>
                    {(["cpu", "ram", "storage"] as const).map((metric) => (
                      <div key={metric}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize text-muted-foreground">{metric}</span>
                          <span>{screen.health![metric]}%</span>
                        </div>
                        <Progress value={screen.health![metric]} />
                      </div>
                    ))}
                  </>
                )}
                <p className="text-sm text-muted-foreground">Last seen: {formatRelative(screen.lastSeen)}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="campaigns"><p className="text-muted-foreground">Assigned campaigns will appear here.</p></TabsContent>
        <TabsContent value="playlists"><p className="text-muted-foreground">Current playlist: {screen.currentPlaylistId ?? "None"}</p></TabsContent>
        <TabsContent value="logs"><p className="text-muted-foreground">Playback logs for this screen.</p></TabsContent>
        <TabsContent value="settings"><p className="text-muted-foreground">Screen configuration settings.</p></TabsContent>
      </Tabs>
    </div>
  );
}
