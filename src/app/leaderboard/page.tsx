import { LeaderboardTable } from "@/components/feature/leaderboard-table";

export default function LeaderboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
      </div>
      <p className="text-muted-foreground">
        See how you stack up against other cadets.
      </p>
      <div className="mt-6">
        <LeaderboardTable />
      </div>
    </div>
  );
}
