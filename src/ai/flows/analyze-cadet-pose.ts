// This is an AI-powered function that analyzes a cadet's pose and provides feedback.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing a cadet's pose using AI.
 *
 * - analyzeCadetPose - The main function that takes a pose data URI and returns analysis results.
 * - AnalyzeCadetPoseInput - The input type for the analyzeCadetPose function, including the pose data URI.
 * - AnalyzeCadetPoseOutput - The output type for the analyzeCadetPose function, providing feedback on the pose.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCadetPoseInputSchema = z.object({
  poseDataUri: z
    .string()
    .describe(
      'A pose of a cadet, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type AnalyzeCadetPoseInput = z.infer<typeof AnalyzeCadetPoseInputSchema>;

const AnalyzeCadetPoseOutputSchema = z.object({
  postureCorrectness: z.number().describe('A score indicating how correct the posture is, from 0 to 1.'),
  feedback: z.string().describe('Specific feedback on how to improve the pose.'),
});
export type AnalyzeCadetPoseOutput = z.infer<typeof AnalyzeCadetPoseOutputSchema>;

export async function analyzeCadetPose(input: AnalyzeCadetPoseInput): Promise<AnalyzeCadetPoseOutput> {
  return analyzeCadetPoseFlow(input);
}

const analyzeCadetPosePrompt = ai.definePrompt({
  name: 'analyzeCadetPosePrompt',
  input: {schema: AnalyzeCadetPoseInputSchema},
  output: {schema: AnalyzeCadetPoseOutputSchema},
  prompt: `You are an expert NCC drill instructor. Analyze the cadet's pose and provide feedback. 

Analyze the cadet's pose in the image and provide a postureCorrectness score from 0 to 1, as well as specific feedback on how to improve the pose.

Image: {{media url=poseDataUri}}`,
});

const analyzeCadetPoseFlow = ai.defineFlow(
  {
    name: 'analyzeCadetPoseFlow',
    inputSchema: AnalyzeCadetPoseInputSchema,
    outputSchema: AnalyzeCadetPoseOutputSchema,
  },
  async input => {
    const {output} = await analyzeCadetPosePrompt(input);
    return output!;
  }
);
