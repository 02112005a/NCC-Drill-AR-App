'use server';

import { analyzeCadetPose, AnalyzeCadetPoseOutput } from '@/ai/flows/analyze-cadet-pose';
import { provideSpokenInstructions } from '@/ai/flows/provide-spoken-instructions';

export type AnalysisResult = AnalyzeCadetPoseOutput & { audioDataUri?: string };

export async function getAnalysis(imageData: string): Promise<AnalysisResult | null> {
  try {
    const analysisResult = await analyzeCadetPose({ poseDataUri: imageData });
    if (analysisResult.feedback) {
      const spokenInstructionsResult = await provideSpokenInstructions({ poseData: analysisResult.feedback });
      return { ...analysisResult, audioDataUri: spokenInstructionsResult.audioDataUri };
    }
    return analysisResult;
  } catch (e) {
    console.error(e);
    return null;
  }
}
