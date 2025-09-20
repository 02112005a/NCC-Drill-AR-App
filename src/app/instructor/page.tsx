import { AiInstructorClient } from "@/components/feature/ai-instructor-client";

export default function InstructorPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Ask the AI Instructor</h1>
      </div>
      <p className="text-muted-foreground max-w-2xl">
        Get personalized feedback. Select a drill, ask a question, and the AI instructor will analyze your recent performance to give you tailored advice.
      </p>
      <div className="mt-6">
        <AiInstructorClient />
      </div>
    </div>
  );
}
