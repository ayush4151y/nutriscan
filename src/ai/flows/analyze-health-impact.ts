
'use server';

/**
 * @fileOverview Analyzes the health impact of food product ingredients from an image.
 *
 * - analyzeHealthImpact - A function that analyzes the ingredients from an image and provides a health rating, warnings, and alternative suggestions.
 * - AnalyzeHealthImpactInput - The input type for the analyzeHealthImpact function.
 * - AnalyzeHealthImpactOutput - The return type for the analyzeHealthImpact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeHealthImpactInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a food product ingredient list, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  productType: z.string().optional().describe('The type of product being analyzed (e.g., "Chocolate Bar", "Energy Drink").'),
  allergies: z.array(z.string()).optional().describe('A list of allergies the user has.'),
  healthConcerns: z.array(z.string()).optional().describe('A list of health concerns the user has.'),
});
export type AnalyzeHealthImpactInput = z.infer<typeof AnalyzeHealthImpactInputSchema>;

const AnalyzeHealthImpactOutputSchema = z.object({
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
export type AnalyzeHealthImpactOutput = z.infer<typeof AnalyzeHealthImpactOutputSchema>;

export async function analyzeHealthImpact(input: AnalyzeHealthImpactInput): Promise<AnalyzeHealthImpactOutput> {
  return analyzeHealthImpactFlow(input);
}

const analyzeHealthImpactPrompt = ai.definePrompt({
  name: 'analyzeHealthImpactPrompt',
  input: {schema: AnalyzeHealthImpactInputSchema},
  output: {schema: AnalyzeHealthImpactOutputSchema},
  prompt: `You are a health and nutrition expert. Analyze the ingredient list from the photo and provide a health rating, warnings, and alternative suggestions. 
It's important to consider the type of product when assessing ingredients. For example, sugar in a dessert like a 'Chocolate Bar' is expected, but in a savory item it might be a bigger concern.

The user has specified the product type is: '{{productType}}'. Use this context to provide a more nuanced analysis. If no product type is provided, perform a general analysis.

Take into account any allergies and health concerns provided by the user.

Extract the ingredient names and quantities from the following text obtained from the image:

{{media url=photoDataUri}}

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

const analyzeHealthImpactFlow = ai.defineFlow(
  {
    name: 'analyzeHealthImpactFlow',
    inputSchema: AnalyzeHealthImpactInputSchema,
    outputSchema: AnalyzeHealthImpactOutputSchema,
  },
  async input => {
    const {output} = await analyzeHealthImpactPrompt(input);
    return output!;
  }
);
