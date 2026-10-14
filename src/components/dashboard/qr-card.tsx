"use client";

import { Download, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { qrCodeUrl, type QrOptions } from "@/lib/api-client";
import { contrastRatio } from "@/lib/link-tools";

/** QR code with custom colours, size and margin, plus PNG/SVG download. */
export function QrCard({ shortCode }: { shortCode: string }) {
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [size, setSize] = useState("300");
  const [margin, setMargin] = useState("4");

  const contrast = contrastRatio(fg, bg);
  const options: QrOptions = { fg, bg, size: Number(size), margin: Number(margin) };
  const tooFaint = contrast < 3;

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR code</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrCodeUrl(shortCode, { ...options, format: "png" })}
          alt={`QR code for ${shortCode}`}
          className="size-48 rounded-[var(--radius-sm)] border border-border"
        />

        <div className="grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="qr-fg">Foreground</Label>
            <input
              id="qr-fg"
              type="color"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="h-9 w-full cursor-pointer rounded-[var(--radius-sm)] border border-border bg-transparent"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="qr-bg">Background</Label>
            <input
              id="qr-bg"
              type="color"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="h-9 w-full cursor-pointer rounded-[var(--radius-sm)] border border-border bg-transparent"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Size</Label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger aria-label="QR size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["200", "300", "500", "800"].map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}px
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Margin</Label>
            <Select value={margin} onValueChange={setMargin}>
              <SelectTrigger aria-label="QR margin">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["0", "2", "4", "8"].map((m) => (
                  <SelectItem key={m} value={m}>
                    {m} modules
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {tooFaint && (
          <p role="alert" className="flex items-start gap-2 text-xs text-destructive">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            Low contrast ({contrast.toFixed(1)}:1). Scanners need roughly 3:1 or more, so pick a
            darker foreground or a lighter background.
          </p>
        )}

        <div className="flex w-full gap-2">
          <Button asChild variant="secondary" className="flex-1">
            <a href={qrCodeUrl(shortCode, { ...options, format: "png", download: true })}>
              <Download /> PNG
            </a>
          </Button>
          <Button asChild variant="secondary" className="flex-1">
            <a href={qrCodeUrl(shortCode, { ...options, format: "svg", download: true })}>
              <Download /> SVG
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
