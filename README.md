# 🎬 Cinepedia - Your AI-Powered Movie Companion

Cinepedia is a modern, responsive web application for movie enthusiasts. Discover popular movies, read and write community reviews, vote in movie face-offs, and get AI-powered suggestions for what to watch next based on your mood. This project was built with **Next.js**, **Firebase**, and **Genkit** to showcase a feature-rich, AI-integrated application.

![Cinepedia Screenshot](https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=2574&auto=format&fit=crop)

## ✨ Key Features

- **Browse & Search**: Explore a vast library of movies from The Movie Database (TMDB).
- **Firebase Authentication**: Secure user sign-up and login with email/password and Google social sign-in.
- **Community Reviews**: Read authentic reviews from other users and write your own. Features a spoiler-hiding system and the ability to "like" helpful reviews.
- **Movie Polls**: Participate in fun "face-off" polls between two random movies and see community results.
- **AI Movie Suggester**: A floating action button opens a dialog where Google's Gemini model helps you find the perfect movie based on your current mood and preferences.
- **AI Review Enhancer**: Get AI-powered suggestions from Genkit to improve the quality and depth of your own movie reviews.
- **Personalized Dashboard**: A dedicated dashboard for logged-in users to view their review history, stats, and achievements.
- **Responsive Design**: A beautiful and functional UI that works seamlessly across desktops, tablets, and mobile devices, built with ShadCN UI and Tailwind CSS.
- **Secure by Design**: Utilizes Firestore Security Rules to protect user data and prevent unauthorized access.

---

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **State Management & UI**: React, Framer Motion for animations
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) with Google's Gemini models
- **Schema Validation**: Zod
- **Deployment**: Firebase App Hosting

---

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Firebase Project](https://console.firebase.google.com/)
- An API Key from [The Movie Database (TMDB)](https://www.themoviedb.org/signup)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cinepedia.git
cd cinepedia
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a file named `.env` in the root of your project and add the following variables. You will need to replace the placeholder values with your actual keys and configuration details.

```env
# Your Firebase Project Configuration
# Find this in your Firebase project settings > General tab > Your apps > Web app
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-firebase-project-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-firebase-app-id"
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-web-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-firebase-auth-domain"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-firebase-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-firebase-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-firebase-measurement-id"

# Your TMDB API Key
# Get this from your TMDB account settings
NEXT_PUBLIC_TMDB_API_KEY="your-tmdb-api-key"

# Your Google AI (Gemini) API Key for Genkit
# Get this from Google AI Studio
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Firebase Setup

1.  **Firebase Console**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Enable Authentication**: In your new project, go to the **Authentication** section, click **Get Started**, and enable the **Email/Password** and **Google** sign-in providers.
3.  **Enable Firestore**: Go to the **Firestore Database** section, click **Create database**, and start in **Production mode**. Choose a location closest to you.
4.  **Security Rules**: Copy the contents of the `firestore.rules` file from this repository and paste them into the **Rules** tab in your Firestore console. Click **Publish**.

### 5. Run the Development Server

Start the Next.js development server.

```bash
npm run dev
```

The application should now be running at [http://localhost:9002](http://localhost:9002).

### 6. Run the Genkit AI Flows

For the AI features to work, you need to run the Genkit development server in a separate terminal.

```bash
npm run genkit:dev
```

This will start the Genkit flows and make them available to your Next.js application.

---

This project was built in **Firebase Studio**, an AI-assisted development environment for building full-stack web apps with Firebase.
