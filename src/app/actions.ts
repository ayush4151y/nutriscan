
'use server';

import { analyzeHealthImpact } from '@/ai/flows/analyze-health-impact';
import { getIngredientsFromBarcode } from '@/ai/flows/get-ingredients-from-barcode';
import { suggestHealthierAlternatives } from '@/ai/flows/suggest-healthier-alternatives';
import { analyzeIngredientsText } from '@/ai/flows/analyze-ingredients-text';
import { z } from 'zod';
import type { AnalyzeHealthImpactOutput } from '@/ai/flows/analyze-health-impact';
import type { SuggestHealthierAlternativesOutput } from '@/ai/flows/suggest-healthier-alternatives';

export type AnalysisResult = AnalyzeHealthImpactOutput & {
  healthierAlternatives: SuggestHealthierAlternativesOutput;
  productName?: string;
};

export type State = {
  status: 'initial' | 'loading' | 'success' | 'error';
  message: string;
  data: AnalysisResult | null;
};

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, 'Please upload an image.')
  .refine(
    (file) => file.size < 5 * 1024 * 1024,
    'Image size must be less than 5MB.'
  )
  .refine(
    (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
    'Only .jpg, .png, and .webp formats are supported.'
  );

const baseSchema = z.object({
    allergies: z.string().optional(),
    healthConcerns: z.string().optional(),
    productType: z.string().optional(),
});
  
const schema = z.discriminatedUnion("source", [
    baseSchema.extend({
        source: z.literal("file"),
        image: imageFileSchema,
    }),
    baseSchema.extend({
        source: z.literal("camera"),
        image: imageFileSchema,
    }),
    baseSchema.extend({
        source: z.literal("barcode"),
        barcode: z.string().min(1, "Please provide a barcode."),
    }),
    baseSchema.extend({
        source: z.literal("manual"),
        ingredientsText: z.string().min(1, "Please enter ingredients.")
    })
]);


async function getAnalysisForImage(dataUri: string, productType?: string, allergies?: string[], healthConcerns?: string[]) {
    return await analyzeHealthImpact({
      photoDataUri: dataUri,
      productType: productType,
      allergies: allergies,
      healthConcerns: healthConcerns,
    });
}

async function getAnalysisForBarcode(barcode: string, productType?: string, allergies?: string[], healthConcerns?: string[]) {
    const barcodeData = await getIngredientsFromBarcode({ barcode });
    if (!barcodeData || !barcodeData.ingredients || barcodeData.ingredients.length === 0) {
      throw new Error(`Could not find ingredients for barcode ${barcode}.`);
    }

    const ingredientsText = `Ingredients: ${barcodeData.ingredients.join(', ')}`;
    
    const analysis = await analyzeIngredientsText({
        ingredientsText: ingredientsText,
        productType: barcodeData.productName || productType,
        allergies: allergies,
        healthConcerns: healthConcerns,
    });

    return { ...analysis, productName: barcodeData.productName };
}

async function getAnalysisForText(ingredientsText: string, productType?: string, allergies?: string[], healthConcerns?: string[]) {
    const analysis = await analyzeIngredientsText({
        ingredientsText,
        productType: productType,
        allergies,
        healthConcerns,
    });
    return analysis;
}


export async function analyzeProduct(
  prevState: State,
  formData: FormData
): Promise<State> {
  
  const rawData: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    rawData[key] = value;
  });

  const validatedFields = schema.safeParse(rawData);
  
  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors)[0]?.[0];
    return {
      status: 'error',
      message: firstError || 'Invalid input.',
      data: null,
    };
  }

  const { allergies, healthConcerns, productType } = validatedFields.data;
  
  const allergyList = allergies ? allergies.split(',').map((s) => s.trim()) : undefined;
  const healthConcernList = healthConcerns ? healthConcerns.split(',').map((s) => s.trim()) : undefined;

  try {
    let analysisResult: AnalyzeHealthImpactOutput & { productName?: string } | null = null;
    
    if (validatedFields.data.source === 'file' || validatedFields.data.source === 'camera') {
        const { image } = validatedFields.data;
        if (!image) throw new Error('Image is required for this submission type.');
        const buffer = Buffer.from(await image.arrayBuffer());
        const dataUri = `data:${image.type};base64,${buffer.toString('base64')}`;
        analysisResult = await getAnalysisForImage(dataUri, productType, allergyList, healthConcernList);
    } else if (validatedFields.data.source === 'barcode') {
        const { barcode } = validatedFields.data;
        if (!barcode) throw new Error('Barcode is required for this submission type.');
        analysisResult = await getAnalysisForBarcode(barcode, productType || undefined, allergyList, healthConcernList);
    } else if (validatedFields.data.source === 'manual') {
        const { ingredientsText } = validatedFields.data;
        analysisResult = await getAnalysisForText(ingredientsText, productType, allergyList, healthConcernList);
    } else {
      throw new Error('Invalid submission source.');
    }

    if (!analysisResult) {
      throw new Error('Failed to get analysis from AI.');
    }

    const alternativesResult = await suggestHealthierAlternatives({
      ingredients: analysisResult.ingredientsAnalysis.map(({ name, quantity }) => ({
        name,
        quantity,
      })),
      warnings: analysisResult.warnings,
    });
    
    return {
      status: 'success',
      message: 'Analysis complete!',
      data: { ...analysisResult, healthierAlternatives: alternativesResult || [] },
    };
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      status: 'error',
      message: `Analysis failed: ${errorMessage}`,
      data: null,
    };
  }
}

const feedbackSchema = z.object({
  name: z.string().min(1, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Your message must be at least 10 characters long.'),
});

export type FeedbackState = {
  status: 'initial' | 'success' | 'error';
  message: string;
};

export async function sendFeedback(
  prevState: FeedbackState,
  formData: FormData
): Promise<FeedbackState> {
  const validatedFields = feedbackSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors)[0]?.[0];
    return {
      status: 'error',
      message: firstError || 'Invalid input.',
    };
  }

  const { name, email, message } = validatedFields.data;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('Telegram bot token or chat ID is not configured in .env file.');
    return {
      status: 'error',
      message: 'The contact form is not configured correctly. Please contact support directly.',
    };
  }

  const telegramMessage = `*New Feedback from NutriScan AI:*\n\n*Name:*\n${name}\n\n*Email:*\n${email}\n\n*Message:*\n${message}`;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to send message to Telegram:', errorData);
      throw new Error(`Telegram API error: ${errorData.description || 'Unknown error'}`);
    }

    return {
      status: 'success',
      message: 'Thank you for your feedback! We will get back to you shortly.',
    };
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      status: 'error',
      message: `Failed to send feedback: ${errorMessage}`,
    };
  }
}
