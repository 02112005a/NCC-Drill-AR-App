import { DrillUploaderClient } from "@/components/feature/drill-uploader-client";

export default function CustomDrillsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Custom Drills</h1>
      </div>
      <p className="text-muted-foreground max-w-2xl">
        Upload a `.txt` file with a list of drill names to create your own custom training scenarios. Each drill name should be on a new line.
      </p>
      <div className="mt-6">
        <DrillUploaderClient />
      </div>
    </div>
  );
}
