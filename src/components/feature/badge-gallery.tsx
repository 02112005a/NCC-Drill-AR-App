'use client';

import useProgressData from "@/hooks/use-progress-data";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { Skeleton } from "../ui/skeleton";

export function BadgeGallery() {
  const { badges, isLoaded } = useProgressData();

  if (!isLoaded) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {badges.map(badge => (
          <Tooltip key={badge.id}>
            <TooltipTrigger asChild>
              <Card className={cn("overflow-hidden transition-all", !badge.earned && "grayscale opacity-30")}>
                <CardContent className="p-0">
                  <Image
                    src={badge.icon}
                    alt={badge.name}
                    data-ai-hint="award medal"
                    width={150}
                    height={150}
                    className="aspect-square object-cover w-full"
                  />
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-bold">{badge.name}</p>
              <p>{badge.description}</p>
              {!badge.earned && <p className="text-xs text-muted-foreground">(Not earned yet)</p>}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
