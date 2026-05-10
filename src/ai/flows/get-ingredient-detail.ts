
'use server';

/**
 * @fileOverview Provides a detailed explanation for a given food ingredient.
 *
 * - getIngredientDetail - A function that returns a detailed explanation of an ingredient's health impact.
 * - GetIngredientDetailInput - The input type for the getIngredientDetail function.
 * - GetIngredientDetailOutput - The return type for the getIngredientDetail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetIngredientDetailInputSchema = z.object({
  ingredientName: z
    .string()
    .describe('The name of the food ingredient to explain.'),
});
export type GetIngredientDetailInput = z.infer<typeof GetIngredientDetailInputSchema>;

const GetIngredientDetailOutputSchema = z.object({
  fullName: z.string().describe("The ingredient's full, scientific, or formal name. If the input name is already the full name, repeat it here."),
  healthImpact: z.string().describe('A concise summary of the health impact (e.g., "Beneficial", "Neutral", "Use with Caution", "Potentially Harmful").'),
  impactCategory: z.enum(['Healthy', 'Moderate', 'Harmful']).describe('A category representing the health impact.'),
  details: z.array(z.string()).describe("A point-wise list of key details covering the ingredient's common uses, benefits, and potential risks. Each point should be a separate string in the array."),
});
export type GetIngredientDetailOutput = z.infer<typeof GetIngredientDetailOutputSchema>;

export async function getIngredientDetail(input: GetIngredientDetailInput): Promise<GetIngredientDetailOutput> {
  return getIngredientDetailFlow(input);
}

const getIngredientDetailPrompt = ai.definePrompt({
  name: 'getIngredientDetailPrompt',
  input: {schema: GetIngredientDetailInputSchema},
  output: {schema: GetIngredientDetailOutputSchema},
  prompt: `You are a nutrition expert. For the food ingredient "{{{ingredientName}}}", provide a detailed analysis in the following structured JSON format.

Your response must be structured as follows:
{
  "fullName": "The full, scientific, or formal name of the ingredient. If the input name is already complete, just repeat it.",
  "healthImpact": "A concise summary of the health impact, like 'Beneficial' or 'Use with Caution'.",
  "impactCategory": "Classify the ingredient into ONE of the following categories: 'Healthy', 'Moderate', or 'Harmful'. This should reflect the overall consensus.",
  "details": [
    "A bullet point about its common uses in food.",
    "A bullet point explaining its primary health benefits, if any.",
    "A bullet point detailing potential risks or concerns associated with its consumption.",
    "Another relevant bullet point if necessary."
  ]
}

Keep the tone neutral and informative. Ensure the details are provided as a list of strings.`,
});

const getIngredientDetailFlow = ai.defineFlow(
  {
    name: 'getIngredientDetailFlow',
    inputSchema: GetIngredientDetailInputSchema,
    outputSchema: GetIngredientDetailOutputSchema,
  },
  async input => {
    const {output} = await getIngredientDetailPrompt(input);
    return output!;
  }
);
