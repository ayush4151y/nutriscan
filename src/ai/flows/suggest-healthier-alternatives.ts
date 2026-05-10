'use server';

/**
 * @fileOverview Suggests healthier alternative products based on the AI analysis of comparable products.
 *
 * - suggestHealthierAlternatives - A function that suggests healthier alternative products.
 * - SuggestHealthierAlternativesInput - The input type for the suggestHealthierAlternatives function.
 * - SuggestHealthierAlternativesOutput - The return type for the suggestHealthierAlternatives function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHealthierAlternativesInputSchema = z.object({
  ingredients: z.array(
    z.object({
      name: z.string().describe('The name of the ingredient.'),
      quantity: z.string().describe('The quantity of the ingredient.'),
    })
  ).describe('The list of ingredients in the analyzed product.'),
  warnings: z.array(z.string()).describe('Warnings about the analyzed product.'),
});
export type SuggestHealthierAlternativesInput = z.infer<typeof SuggestHealthierAlternativesInputSchema>;

const SuggestHealthierAlternativesOutputSchema = z.array(
  z.object({
    name: z.string().describe('The name of the alternative product.'),
    description: z.string().describe('A description of the alternative product.'),
    ingredients: z.array(
      z.object({
        name: z.string().describe('The name of the ingredient.'),
        quantity: z.string().describe('The quantity of the ingredient.'),
      })
    ).describe('The list of ingredients in the alternative product.'),
    rating: z.number().describe('The health rating of the alternative product (1-5 stars).'),
  })
).describe('A list of healthier alternative products.');
export type SuggestHealthierAlternativesOutput = z.infer<typeof SuggestHealthierAlternativesOutputSchema>;

export async function suggestHealthierAlternatives(input: SuggestHealthierAlternativesInput): Promise<SuggestHealthierAlternativesOutput> {
  return suggestHealthierAlternativesFlow(input);
}

const suggestHealthierAlternativesPrompt = ai.definePrompt({
  name: 'suggestHealthierAlternativesPrompt',
  input: {schema: SuggestHealthierAlternativesInputSchema},
  output: {schema: SuggestHealthierAlternativesOutputSchema},
  prompt: `You are a health and nutrition expert. Based on the ingredient list and warnings of a food product, suggest healthier alternative products.

Ingredients:
{{#each ingredients}}
- {{name}} ({{quantity}})
{{/each}}

Warnings:
{{#each warnings}}
- {{this}}
{{/each}}

Suggest alternative products that address these warnings and have a better health profile. Include the product name, a brief description, a list of ingredients, and a health rating (1-5 stars).

Format the output as a JSON array of products:

[
  {
    "name": "Product Name",
    "description": "Product Description",
    "ingredients": [
      {
        "name": "Ingredient Name",
        "quantity": "Quantity"
      }
    ],
    "rating": "Health Rating (1-5 stars)"
  }
]
`,
});

const suggestHealthierAlternativesFlow = ai.defineFlow(
  {
    name: 'suggestHealthierAlternativesFlow',
    inputSchema: SuggestHealthierAlternativesInputSchema,
    outputSchema: SuggestHealthierAlternativesOutputSchema,
  },
  async input => {
    const {output} = await suggestHealthierAlternativesPrompt(input);
    return output!;
  }
);
