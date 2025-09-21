'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { drillTypes } from "@/lib/data";
import useProgressData from "@/hooks/use-progress-data";
import { useToast } from "@/hooks/use-toast";
import { Bot, Sparkles } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { getFeedback } from "@/lib/actions";

const FormSchema = z.object({
  drillPosture: z.string({
    required_error: "Please select a drill to get feedback on.",
  }),
  cadetQuery: z.string().min(10, {
    message: "Your question must be at least 10 characters.",
  }),
});

export function AiInstructorClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { progress } = useProgressData();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      cadetQuery: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setFeedback(null);

    const latestSession = progress.length > 0 ? progress[progress.length-1] : null;
    const poseAnalysis = latestSession 
        ? `The cadet's last performance on '${latestSession.drill}' resulted in a score of ${latestSession.score}.`
        : "The cadet has no performance history yet.";

    try {
        const result = await getFeedback(data, poseAnalysis);
        setFeedback(result.feedback);
    } catch (error) {
        console.error("Failed to get feedback", error);
        toast({ title: "Error", description: "Failed to get feedback from the AI instructor.", variant: "destructive" });
    }

    setIsLoading(false);
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Query</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="drillPosture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drill Posture</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a drill posture" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {drillTypes.map((drill) => (
                          <SelectItem key={drill} value={drill}>{drill}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cadetQuery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Question</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., How can I improve my salute? My arm feels shaky."
                        className="resize-none"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Getting Feedback..." : "Ask Instructor"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot />
            Instructor's Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          {feedback && <p>{feedback}</p>}
          {!isLoading && !feedback && (
            <div className="text-center text-muted-foreground h-40 flex flex-col justify-center items-center">
                <Sparkles className="size-8 mb-2"/>
                <p>Your personalized feedback will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
