'use server';

/**
 * @fileOverview Fetches ingredients for a given barcode.
 *
 * - getIngredientsFromBarcode - A function that fetches ingredients for a given barcode.
 * - GetIngredientsFromBarcodeInput - The input type for the getIngredientsFromBarcode function.
 * - GetIngredientsFromBarcodeOutput - The return type for the getIngredientsFromBarcode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetIngredientsFromBarcodeInputSchema = z.object({
  barcode: z.string().describe('The product barcode.'),
});
export type GetIngredientsFromBarcodeInput = z.infer<typeof GetIngredientsFromBarcodeInputSchema>;

const GetIngredientsFromBarcodeOutputSchema = z.object({
  productName: z.string().optional().describe('The name of the product.'),
  ingredients: z.array(z.string()).describe('A list of ingredients.'),
});
export type GetIngredientsFromBarcodeOutput = z.infer<typeof GetIngredientsFromBarcodeOutputSchema>;

export async function getIngredientsFromBarcode(input: GetIngredientsFromBarcodeInput): Promise<GetIngredientsFromBarcodeOutput> {
  return getIngredientsFromBarcodeFlow(input);
}

const getIngredientsFromBarcodePrompt = ai.definePrompt({
  name: 'getIngredientsFromBarcodePrompt',
  input: {schema: GetIngredientsFromBarcodeInputSchema},
  output: {schema: GetIngredientsFromBarcodeOutputSchema},
  prompt: `You are a product information expert. Given a product barcode, find the product name and its list of ingredients.
Use your knowledge to find the ingredients for the product with barcode: {{{barcode}}}.
If you cannot find the product, return an empty list of ingredients.
`,
});

const getIngredientsFromBarcodeFlow = ai.defineFlow(
  {
    name: 'getIngredientsFromBarcodeFlow',
    inputSchema: GetIngredientsFromBarcodeInputSchema,
    outputSchema: GetIngredientsFromBarcodeOutputSchema,
  },
  async input => {
    const {output} = await getIngredientsFromBarcodePrompt(input);
    return output!;
  }
);
