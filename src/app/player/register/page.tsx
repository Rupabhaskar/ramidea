"use client";

import { useEffect, useState } from "react";
import { Monitor, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { registerPlayerDevice } from "@/services";
import Link from "next/link";

export default function PlayerRegisterPage() {
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    registerPlayerDevice().then((screen) => {
      setPairingCode(screen.pairingCode);
      setLoading(false);
    });
  }, []);

  const copyCode = () => {
    if (pairingCode) {
      navigator.clipboard.writeText(pairingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-6">
            <Monitor className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">AdFlow Player</h1>
          <p className="text-muted-foreground mt-2">Enter this code in the admin portal to pair this device</p>

          {loading ? (
            <div className="mt-8 h-16 animate-pulse rounded-xl bg-muted" />
          ) : (
            <div className="mt-8">
              <p className="text-4xl font-mono font-bold tracking-[0.3em] text-primary">{pairingCode}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={copyCode}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied!" : "Copy Code"}
              </Button>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-8">
            Portal → Screens → Pair Screen → Enter code above
          </p>

          <Button className="w-full mt-6" asChild>
            <Link href="/player/play">Continue to Player</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
