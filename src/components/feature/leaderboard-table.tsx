'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import useProgressData from "@/hooks/use-progress-data";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function LeaderboardTable() {
  const { leaderboard, isLoaded } = useProgressData();

  if (!isLoaded) {
    return <LeaderboardSkeleton />;
  }

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Cadet</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((entry) => (
              <TableRow key={entry.rank} className={cn(entry.isCurrentUser && "bg-primary/10")}>
                <TableCell className="font-medium text-lg">{entry.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback>{entry.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{entry.name}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-bold text-lg">{entry.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function LeaderboardSkeleton() {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Cadet</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-6 w-6" /></TableCell>
                <TableCell>
                   <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </TableCell>
                <TableCell className="text-right"><Skeleton className="h-6 w-10 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
