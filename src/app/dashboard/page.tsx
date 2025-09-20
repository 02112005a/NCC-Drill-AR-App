import { ProgressOverview } from "@/components/feature/progress-overview";
import { BadgeGallery } from "@/components/feature/badge-gallery";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <p className="text-muted-foreground">
        Track your performance and see your improvement over time.
      </p>
      <Separator />
      <ProgressOverview />
      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Badges</h2>
        <BadgeGallery />
      </div>
    </div>
  );
}
