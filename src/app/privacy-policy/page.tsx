import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Welcome to NutriScan AI. This Privacy Policy explains how we
              collect, use, and disclose information about you when you use
              our application.
            </p>
            <h3 className="font-bold text-foreground">
              Information We Collect
            </h3>
            <p>
              We collect information you provide directly to us, such as when
              you enter your health profile information (allergies, health
              concerns, etc.). This information is stored locally in your
              browser's local storage and is not sent to our servers.
            </p>
            <p>
              When you analyze a product, we process the data you provide
              (image, barcode, or text) to our AI provider (Google Gemini) to
              generate the analysis. We do not store this data after the
              analysis is complete.
            </p>
            <p>
              When you use the contact form, the name, email, and message you
              provide are sent to our support team via a Telegram bot to help
              us respond to your inquiry.
            </p>
            <h3 className="font-bold text-foreground">How We Use Information</h3>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide, maintain, and improve our services.</li>
              <li>Personalize the analysis based on your health profile.</li>
              <li>Respond to your comments, questions, and feedback.</li>
            </ul>
            <h3 className="font-bold text-foreground">Information Sharing</h3>
            <p>
              We do not share your personal information with third parties
              other than as necessary to provide the service (e.g., sending
              data to the AI model for processing or sending your feedback to
              our support channel).
            </p>
            <h3 className="font-bold text-foreground">Data Storage</h3>
            <p>
              Your health profile is stored only on your device in local
              storage. You can clear this data at any time by clearing your
              browser's cache or by clearing the fields in the app's menu.
            </p>
            <h3 className="font-bold text-foreground">
              Changes to This Policy
            </h3>
            <p>
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new policy on this
              page.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
