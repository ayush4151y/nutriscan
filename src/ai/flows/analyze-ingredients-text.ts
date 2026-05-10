
'use server';

/**
 * @fileOverview Analyzes the health impact of food product ingredients from a text string.
 *
 * - analyzeIngredientsText - A function that analyzes ingredients from text and provides a health rating, warnings, and alternative suggestions.
 * - AnalyzeIngredientsTextInput - The input type for the analyzeIngredientsText function.
 * - AnalyzeIngredientsTextOutput - The return type for the analyzeIngredientsText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeIngredientsTextInputSchema = z.object({
  ingredientsText: z
    .string()
    .describe(
      'A string containing the list of ingredients for a food product.'
    ),
  productType: z.string().optional().describe('The type of product being analyzed (e.g., "Chocolate Bar", "Energy Drink").'),
  allergies: z.array(z.string()).optional().describe('A list of allergies the user has.'),
  healthConcerns: z.array(z.string()).optional().describe('A list of health concerns the user has.'),
});
export type AnalyzeIngredientsTextInput = z.infer<typeof AnalyzeIngredientsTextInputSchema>;

const AnalyzeIngredientsTextOutputSchema = z.object({
  ingredientsAnalysis: z.array(
    z.object({
      name: z.string().describe('The name of the ingredient.'),
      quantity: z.string().describe('The quantity of the ingredient.'),
      healthImpact: z.string().describe('The health impact of the ingredient (Healthy, Moderate, Harmful).'),
    })
  ).describe('The analysis of each ingredient.'),
  overallRating: z.number().describe('The overall health rating of the product (1-5 stars).'),
  warnings: z.array(z.string()).describe('Warnings about the product (e.g., high sugar, preservatives detected), personalized to the user.'),
  suggestions: z.array(z.string()).describe('Suggestions for healthier alternatives.'),
});
export type AnalyzeIngredientsTextOutput = z.infer<typeof AnalyzeIngredientsTextOutputSchema>;

export async function analyzeIngredientsText(input: AnalyzeIngredientsTextInput): Promise<AnalyzeIngredientsTextOutput> {
  return analyzeIngredientsTextFlow(input);
}

const analyzeIngredientsTextPrompt = ai.definePrompt({
  name: 'analyzeIngredientsTextPrompt',
  input: {schema: AnalyzeIngredientsTextInputSchema},
  output: {schema: AnalyzeIngredientsTextOutputSchema},
  prompt: `You are a health and nutrition expert. Analyze the ingredient list from the text provided and provide a health rating, warnings, and alternative suggestions.
It's important to consider the type of product when assessing ingredients. For example, sugar in a dessert like a 'Chocolate Bar' is expected, but in a savory item it might be a bigger concern.

The user has specified the product type is: '{{productType}}'. Use this context to provide a more nuanced analysis. If no product type is provided, perform a general analysis.

Take into account any allergies and health concerns provided by the user.

Extract the ingredient names and quantities from the following text:

{{{ingredientsText}}}

{% if allergies %}User Allergies: {{allergies}}{% endif %}
{% if healthConcerns %}User Health Concerns: {{healthConcerns}}{% endif %}

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
  "warnings": ["List of warnings about the product, personalized to the user's allergies and health concerns, and considering the product type"],
  "suggestions": ["Suggestions for healthier alternatives"]
}
`,
});

const analyzeIngredientsTextFlow = ai.defineFlow(
  {
    name: 'analyzeIngredientsTextFlow',
    inputSchema: AnalyzeIngredientsTextInputSchema,
    outputSchema: AnalyzeIngredientsTextOutputSchema,
  },
  async input => {
    const {output} = await analyzeIngredientsTextPrompt(input);
    return output!;
  }
);
