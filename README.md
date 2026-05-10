# NutriScan AI

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini-AI-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PWA-Ready-green?style=for-the-badge" />
</p>

<p align="center">
  <a href="https://nutriscan-tan.vercel.app">
    <img src="https://img.shields.io/badge/Live-Demo-success?style=for-the-badge" />
  </a>
</p>

## 🌐 Live Demo

👉 https://nutriscan-tan.vercel.app

---

## 📖 About NutriScan

NutriScan AI is an AI-powered packaged food analyzer built with Next.js and Google's Gemini AI.

Users can:
- Scan food ingredient lists from images
- Scan product barcodes
- Paste ingredients manually
- Get AI-powered health analysis instantly

The app provides:
- Ingredient breakdowns
- Health ratings
- Personalized warnings
- Healthier alternatives
- Interactive ingredient explanations

NutriScan is designed with a modern mobile-friendly UI and works as a Progressive Web App (PWA).

---

## ✨ Features

### 🔍 Multi-Modal Input
Analyze food products by:
- Uploading ingredient images
- Using the camera directly
- Scanning product barcodes
- Typing ingredients manually

### 🤖 AI-Powered Analysis
Powered by Gemini AI to provide:
- Ingredient health classification
- Personalized warnings
- Overall product health rating
- Suggested healthier alternatives

### 📱 PWA Support
- Installable on desktop and mobile
- Fast loading experience
- Offline-ready architecture

### 🎨 Modern UI
Built using:
- ShadCN UI
- Tailwind CSS
- Responsive design system

---

## 🚀 Tech Stack

| Technology | Usage |
|---|---|
| Next.js | Frontend Framework |
| TypeScript | Type Safety |
| Gemini AI | AI Analysis |
| Genkit | AI Workflow Engine |
| Tailwind CSS | Styling |
| ShadCN UI | UI Components |
| ZXing | Barcode Scanning |
| next-pwa | Progressive Web App |

---

## 📁 Project Structure

```bash
.
├── src
│   ├── app
│   ├── ai
│   ├── components
│   └── lib
├── public
├── docs
├── .env
├── next.config.ts
└── tailwind.config.ts
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/ayush4151y/nutriscan.git
cd nutriscan
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

Get your API key from:
https://aistudio.google.com/app/apikey

### 4. Run Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:9002
```

---

## 📱 Install as App (PWA)

### Android
- Open website in Chrome
- Tap `Install App` or `Add to Home Screen`

### Desktop
- Open website in Chrome/Edge
- Click install icon in address bar

---

## 🤖 How AI Works

NutriScan uses Genkit AI flows with Gemini models.

Main workflow:
1. User uploads/scans ingredients
2. AI extracts and analyzes ingredient data
3. Gemini generates health insights
4. Results are displayed interactively

---

## 🔮 Future Improvements

- Multi-language support
- Indian regional food database
- Better barcode database
- Nutrition history tracking
- AI meal recommendations
- User accounts & sync

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

Developed by Ayush.
