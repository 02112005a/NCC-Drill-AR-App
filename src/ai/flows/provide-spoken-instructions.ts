'use server';

/**
 * @fileOverview This file defines the Genkit flow for providing spoken instructions and real-time feedback to the cadet based on pose analysis.
 *
 * - provideSpokenInstructions - A function that takes pose data as input and returns spoken instructions as audio data.
 * - ProvideSpokenInstructionsInput - The input type for the provideSpokenInstructions function.
 * - ProvideSpokenInstructionsOutput - The return type for the provideSpokenInstructions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const ProvideSpokenInstructionsInputSchema = z.object({
  poseData: z.string().describe('Pose data from the device camera.'),
});
export type ProvideSpokenInstructionsInput = z.infer<typeof ProvideSpokenInstructionsInputSchema>;

const ProvideSpokenInstructionsOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'The spoken instruction/feedback as audio data URI (WAV format), which can be played by the client.'
    ),
});
export type ProvideSpokenInstructionsOutput = z.infer<typeof ProvideSpokenInstructionsOutputSchema>;

export async function provideSpokenInstructions(
  input: ProvideSpokenInstructionsInput
): Promise<ProvideSpokenInstructionsOutput> {
  return provideSpokenInstructionsFlow(input);
}

const provideSpokenInstructionsPrompt = ai.definePrompt({
  name: 'provideSpokenInstructionsPrompt',
  input: {schema: ProvideSpokenInstructionsInputSchema},
  output: {schema: ProvideSpokenInstructionsOutputSchema},
  prompt: `You are an AI drill instructor providing feedback to cadets.

  Analyze the following pose data:
  {{poseData}}

  Provide spoken instructions and real-time feedback to the cadet to correct their posture and movements. Be concise and direct.

  Output the spoken instructions as a string. For multi-speaker scenario, use 'Instructor' as the speaker. For example:

  Instructor: Keep your back straight.

  If the pose is correct, provide encouraging feedback.`,
});

const provideSpokenInstructionsFlow = ai.defineFlow(
  {
    name: 'provideSpokenInstructionsFlow',
    inputSchema: ProvideSpokenInstructionsInputSchema,
    outputSchema: ProvideSpokenInstructionsOutputSchema,
  },
  async input => {
    const {text} = await provideSpokenInstructionsPrompt(input);
    if (!text) {
      throw new Error('No text returned from the prompt.');
    }
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: 'Instructor',
                voiceConfig: {
                  prebuiltVoiceConfig: {voiceName: 'Algenib'},
                },
              },
            ],
          },
        },
      },
      prompt: text,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      audioDataUri: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

