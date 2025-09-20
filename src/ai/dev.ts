import { config } from 'dotenv';
config();

import '@/ai/flows/provide-helpful-feedback.ts';
import '@/ai/flows/analyze-cadet-pose.ts';
import '@/ai/flows/provide-spoken-instructions.ts';