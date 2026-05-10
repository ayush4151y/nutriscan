import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FaqPage() {
  return (
    <div className="py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  Is the analysis from NutriScan AI a substitute for medical
                  advice?
                </AccordionTrigger>
                <AccordionContent>
                  No. The analysis provided by our AI is for informational
                  purposes only and should not be considered a substitute for
                  professional medical advice, diagnosis, or treatment. Always
                  consult with a qualified healthcare provider for any health
                  concerns.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  How accurate is the AI analysis?
                </AccordionTrigger>
                <AccordionContent>
                  Our AI model is trained on a vast amount of data to be as
                  accurate as possible. However, it can still make mistakes or
                  misinterpret ingredients, especially from low-quality
                  images. Always double-check critical information.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is my data private?</AccordionTrigger>
                <AccordionContent>
                  Yes. Your health profile (allergies, etc.) is stored only
                  on your device and is never sent to our servers. The
                  ingredient information you submit for analysis is sent to
                  our AI provider for processing but is not stored by us.
                  Please see our Privacy Policy for more details.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  Why does the barcode scanner not work?
                </AccordionTrigger>
                <AccordionContent>
                  The barcode scanning feature is currently in development and
                  will be released in a future update. We appreciate your
                  patience!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>
                  How do I save my health profile?
                </AccordionTrigger>
                <AccordionContent>
                  You can enter your health information in the side menu. Once
                  you fill out the fields for allergies and health concerns,
                  click the "Save Profile" button. This information is saved in
                  your browser for future use.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
