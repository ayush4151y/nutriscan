import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-ingredient-health-impact.ts';
import '@/ai/flows/suggest-healthier-alternatives.ts';
import '@/ai/flows/analyze-health-impact.ts';
import '@/ai/flows/get-ingredients-from-barcode.ts';
import '@/ai/flows/analyze-ingredients-text.ts';
import '@/ai/flows/get-ingredient-detail.ts';
