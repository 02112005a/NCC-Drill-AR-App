'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Star, TrendingUp, Trophy } from "lucide-react";
import useProgressData from "@/hooks/use-progress-data";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Skeleton } from "../ui/skeleton";

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export function ProgressOverview() {
  const { progress, isLoaded } = useProgressData();

  if (!isLoaded) {
    return <ProgressOverviewSkeleton />;
  }

  const averageScore = progress.length > 0 ? progress.reduce((acc, p) => acc + p.score, 0) / progress.length : 0;
  const highScore = progress.length > 0 ? Math.max(...progress.map(p => p.score)) : 0;
  const drillsCompleted = progress.length;

  const chartData = progress.slice(-10).map((p, i) => ({
    session: `Session ${i + 1}`,
    score: p.score,
  }));

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Across all drills
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highScore}</div>
            <p className="text-xs text-muted-foreground">
              Your personal best
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drills Completed</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drillsCompleted}</div>
            <p className="text-xs text-muted-foreground">
              Keep up the practice!
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#3</div>
            <p className="text-xs text-muted-foreground">
              On the leaderboard
            </p>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {progress.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="session"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis domain={[0, 100]} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="score" fill="var(--color-score)" radius={4} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[250px] w-full items-center justify-center text-muted-foreground">
              <p>Complete some drills to see your progress here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function ProgressOverviewSkeleton() {
  return (
     <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Performance</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="flex h-[250px] w-full items-center justify-center">
             <Skeleton className="h-full w-full" />
           </div>
        </CardContent>
      </Card>
    </>
  )
}
