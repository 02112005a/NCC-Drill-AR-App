import { LiveDrillClient } from '@/components/feature/live-drill-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';

export default function LiveDrillPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Live Drill</h1>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Camera className="size-8 text-primary" />
          <div>
            <CardTitle>Real-Time Pose Analysis</CardTitle>
            <CardDescription>
              Your camera feed is analyzed in real-time to provide feedback on your drill posture.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <LiveDrillClient />
        </CardContent>
      </Card>
    </div>
  );
}
