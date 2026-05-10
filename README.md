# NutriScan AI

[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge)](https://nutriscan-tan.vercel.app)

## 🌐 Live Demo

[Open NutriScan AI](https://nutriscan-tan.vercel.app)

NutriScan AI is a web application built with Next.js that allows users to analyze the health impact of food products. Users can scan ingredient lists from images, scan product barcodes, or enter ingredients manually to get an instant analysis, a health rating, personalized warnings, and suggestions for healthier alternatives.

## ✨ Key Features

*   **Multi-Modal Input**: Analyze ingredients by:
    *   Uploading a photo of the ingredient list.
    *   Using the device camera to take a picture.
    *   Scanning a product barcode.
    *   Typing or pasting the ingredients manually.
*   **AI-Powered Analysis**: Leverages Google's Gemini AI to provide:
    *   A breakdown of each ingredient with its health impact (Healthy, Moderate, Harmful).
    *   An overall health rating (1-5 stars).
    *   Personalized warnings based on user-provided allergies and health concerns.
    *   Suggestions for healthier alternative products.
*   **Interactive Results**: Click on any ingredient in the analysis to get a detailed explanation of its properties and health effects.
*   **Personalization**: Users can save their health profile (allergies, concerns) in the browser's local storage for tailored analysis.
*   **Modern UI/UX**: Built with ShadCN UI components and Tailwind CSS for a clean, responsive, and aesthetically pleasing interface.
*   **PWA Ready**: Install the app on your desktop or mobile device for a native, offline-first experience.

## 🚀 Technology Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Generative AI**: [Google's Gemini](https://ai.google.dev/) via [Genkit](https://firebase.google.com/docs/genkit)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **PWA**: [next-pwa](https://www.npmjs.com/package/next-pwa)
*   **Barcode Scanning**: [ZXing Library](https://github.com/zxing-js/library)
*   **Language**: TypeScript

## 📁 Project Structure

Here is a breakdown of the most important files and directories in the project:

```
.
├── src
│   ├── app
│   │   ├── actions.ts       # Server Actions handling form submissions and AI flow calls.
│   │   ├── globals.css      # Global styles and Tailwind CSS theme configuration.
│   │   ├── layout.tsx       # Root layout for the entire application.
│   │   └── page.tsx         # The main home page of the application.
│   │
│   ├── ai
│   │   ├── flows            # Directory containing all Genkit AI flows.
│   │   │   ├── analyze-health-impact.ts
│   │   │   ├── get-ingredients-from-barcode.ts
│   │   │   └── ... (other flows)
│   │   └── genkit.ts        # Genkit initialization and Gemini model configuration.
│   │
│   ├── components
│   │   ├── ui/              # Reusable UI components from ShadCN.
│   │   ├── ingredient-analyzer.tsx # The main component for all user input options.
│   │   ├── analysis-result.tsx     # Component to display the results of the AI analysis.
│   │   └── layout/          # Layout components like the Header.
│   │
│   └── lib
│       └── utils.ts         # Utility functions, including `cn` for Tailwind classes.
│
├── public
│   └── manifest.json      # PWA manifest file for app metadata.
│
├── .env                     # For environment variables (used for API keys).
├── next.config.ts           # Next.js configuration file.
└── tailwind.config.ts       # Tailwind CSS configuration file.
```

## 🛠️ Getting Started

Follow these steps to set up and run the project locally.

### 1. Prerequisites

*   [Node.js](https://nodejs.org/en/) (version 18 or later)
*   npm or yarn

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/ayush4151y/nutriscan.git
cd <project-directory>
npm install
```

### 3. Set up Environment Variables

The application uses the Gemini API, which requires an API key.

1.  **Get a Gemini API Key**: Go to [Google AI Studio](https://aistudio.google.com/app/apikey) to create a free API key.

2.  **Create an Environment File**: In the root of the project, create a file named `.env`.

3.  **Add the API Key**: Add your API key to the `.env` file like this:

    ```
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```

    Replace `"YOUR_API_KEY_HERE"` with the key you obtained from Google AI Studio.

### 4. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

## 📱 Installing as a PWA

NutriScan AI is a Progressive Web App (PWA), which means you can install it on your device for a faster, more integrated experience, including offline access.

### How it Works
The PWA is enabled by a **service worker**, a script that your browser runs in the background. It allows the app to cache resources, enabling it to load quickly and work even without an internet connection. The `manifest.json` file provides the metadata (like the app's name, icon, and theme color) needed for the installation prompt.

### How to Install

**On Desktop (Chrome, Edge):**
1.  Navigate to the application in your browser.
2.  Look for an **Install icon** in the address bar (it might look like a computer with a down arrow).
3.  Click the icon and then click **"Install"** in the prompt.
4.  The app will now be in your applications folder and on your desktop or start menu.

**On Mobile (iOS/Safari & Android/Chrome):**
1.  Open the application's URL in your mobile browser.
2.  **On iOS**: Tap the **Share** button, scroll down, and select **"Add to Home Screen."**
3.  **On Android**: You will likely see a pop-up banner at the bottom of the screen prompting you to **"Add to Home Screen."** If not, tap the three-dot menu icon and select **"Install app"** or **"Add to Home Screen."**

Once installed, you can launch NutriScan AI just like any other app on your device!


## 🤖 How the AI Works

The core logic is handled by Genkit, an open-source AI framework.

-   **Flows (`src/ai/flows/`)**: These are server-side TypeScript functions that define specific AI tasks. They take an input (e.g., an image or text), construct a prompt, and send it to the Gemini model. They use Zod schemas to ensure the input and output are correctly typed and structured.

-   **Server Actions (`src/app/actions.ts`)**: These functions act as a bridge between the client-side components and the server-side AI flows. When a user submits a form, the `analyzeProduct` server action is called. It validates the input and then calls the appropriate Genkit flow. This is a secure way to execute server-side logic without needing to build a traditional REST API.
