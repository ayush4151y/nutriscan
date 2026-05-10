'use server';

/**
 * @fileOverview Analyzes the health impact of food product ingredients from an image.
 *
 * - analyzeIngredientHealthImpact - A function that analyzes the ingredients from an image and provides a health rating, warnings, and alternative suggestions.
 * - AnalyzeIngredientHealthImpactInput - The input type for the analyzeIngredientHealthImpact function.
 * - AnalyzeIngredientHealthImpactOutput - The return type for the analyzeIngredientHealthImpact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeIngredientHealthImpactInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a food product ingredient list, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type AnalyzeIngredientHealthImpactInput = z.infer<typeof AnalyzeIngredientHealthImpactInputSchema>;

const AnalyzeIngredientHealthImpactOutputSchema = z.object({
  ingredientsAnalysis: z.array(
    z.object({
      name: z.string().describe('The name of the ingredient.'),
      quantity: z.string().describe('The quantity of the ingredient.'),
      healthImpact: z.string().describe('The health impact of the ingredient (Healthy, Moderate, Harmful).'),
    })
  ).describe('The analysis of each ingredient.'),
  overallRating: z.number().describe('The overall health rating of the product (1-5 stars).'),
  warnings: z.array(z.string()).describe('Warnings about the product (e.g., high sugar, preservatives detected).'),
  suggestions: z.array(z.string()).describe('Suggestions for healthier alternatives.'),
});
export type AnalyzeIngredientHealthImpactOutput = z.infer<typeof AnalyzeIngredientHealthImpactOutputSchema>;

export async function analyzeIngredientHealthImpact(input: AnalyzeIngredientHealthImpactInput): Promise<AnalyzeIngredientHealthImpactOutput> {
  return analyzeIngredientHealthImpactFlow(input);
}

const analyzeIngredientHealthImpactPrompt = ai.definePrompt({
  name: 'analyzeIngredientHealthImpactPrompt',
  input: {schema: AnalyzeIngredientHealthImpactInputSchema},
  output: {schema: AnalyzeIngredientHealthImpactOutputSchema},
  prompt: `You are a health and nutrition expert. Analyze the ingredient list from the photo and provide a health rating, warnings, and alternative suggestions.

Extract the ingredient names and quantities from the following text obtained from the image:

{{media url=photoDataUri}}

Provide the results in the following JSON format:

{
  "ingredientsAnalysis": [
    {
      "name": "Ingredient Name",
      "quantity": "Quantity",
      "healthImpact": "Healthy/Moderate/Harmful"
    }
  ],
  "overallRating": "Overall health rating of the product (1-5 stars)",
  "warnings": ["List of warnings about the product"],
  "suggestions": ["Suggestions for healthier alternatives"]
}
`,
});

const analyzeIngredientHealthImpactFlow = ai.defineFlow(
  {
    name: 'analyzeIngredientHealthImpactFlow',
    inputSchema: AnalyzeIngredientHealthImpactInputSchema,
    outputSchema: AnalyzeIngredientHealthImpactOutputSchema,
  },
  async input => {
    const {output} = await analyzeIngredientHealthImpactPrompt(input);
    return output!;
  }
);
