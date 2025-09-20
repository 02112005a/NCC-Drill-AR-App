'use server';

/**
 * @fileOverview Provides helpful feedback to the cadet based on pose analysis.
 *
 * - provideHelpfulFeedback - A function that provides helpful feedback based on pose analysis.
 * - ProvideHelpfulFeedbackInput - The input type for the provideHelpfulFeedback function.
 * - ProvideHelpfulFeedbackOutput - The return type for the provideHelpfulFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideHelpfulFeedbackInputSchema = z.object({
  poseAnalysis: z
    .string()
    .describe(
      'The analysis of the cadet\'s pose, detailing correctness and areas for improvement.'
    ),
  drillPosture: z
    .string()
    .describe('The name of the drill posture being performed.'),
  cadetQuery: z
    .string()
    .describe('The cadet\'s specific question or request for help.'),
});
export type ProvideHelpfulFeedbackInput = z.infer<
  typeof ProvideHelpfulFeedbackInputSchema
>;

const ProvideHelpfulFeedbackOutputSchema = z.object({
  feedback: z
    .string()
    .describe(
      'The AI instructor\'s reasoned and helpful feedback, tailored to the pose analysis and cadet\'s query.'
    ),
});
export type ProvideHelpfulFeedbackOutput = z.infer<
  typeof ProvideHelpfulFeedbackOutputSchema
>;

export async function provideHelpfulFeedback(
  input: ProvideHelpfulFeedbackInput
): Promise<ProvideHelpfulFeedbackOutput> {
  return provideHelpfulFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideHelpfulFeedbackPrompt',
  input: {schema: ProvideHelpfulFeedbackInputSchema},
  output: {schema: ProvideHelpfulFeedbackOutputSchema},
  prompt: `You are an AI drill instructor providing feedback to a cadet.

  You have access to the pose analysis of the cadet, the name of the drill posture, and the cadet\'s specific question.
  Use this information to provide helpful and specific feedback. Focus on the areas where the cadet needs the most improvement, but also acknowledge what they are doing well.
  Reason about the helpfulness of your advice. If the pose analysis indicates the cadet is already proficient in the area they are asking about, acknowledge their proficiency and offer more advanced tips, or suggest focusing on a different area.

  Pose Analysis: {{{poseAnalysis}}}
  Drill Posture: {{{drillPosture}}}
  Cadet Query: {{{cadetQuery}}}

  Provide your feedback in a clear, encouraging, and actionable manner.
  Feedback: `,
});

const provideHelpfulFeedbackFlow = ai.defineFlow(
  {
    name: 'provideHelpfulFeedbackFlow',
    inputSchema: ProvideHelpfulFeedbackInputSchema,
    outputSchema: ProvideHelpfulFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
