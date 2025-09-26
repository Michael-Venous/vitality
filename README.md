Vitality AI - Your Virtual Personal Trainer

Build Your Vitality with AI Precision. Vitality AI is a mobile fitness application built with React Native that transforms your smartphone into an intelligent workout companion. It uses on-device machine learning to track your exercises, count your reps, and help you stay accountable to your fitness goals, all from the comfort of your home.
The Problem

At-home fitness routines often fail due to a lack of guidance, leading to improper form, potential injuries, and fading motivation. Without a personal trainer, users are left guessing if they're performing exercises correctly and find it tedious to track their progress manually.
The Solution

Vitality AI bridges this gap by providing an accessible, AI-powered solution that acts as a virtual personal trainer. By leveraging your phone's camera, it analyzes your movements in real-time, automates rep counting, and provides a centralized dashboard to track your goals, streaks, and personal bests.
✨ Key Features

    🤖 AI-Powered Exercise Tracking: Uses a TensorFlow Lite model (MoveNet) to perform real-time pose estimation, accurately counting reps for exercises like squats, pushups, and situps.

    ✍️ Real-Time Skeleton Overlay: Visualizes the 17 keypoints of your body directly on the camera feed, providing a clear visual representation of the AI's tracking.

    📊 Personalized Dashboard: A central home screen that displays your workout streak, personal bests for each exercise, and custom-set goals.

    🎯 Goal Setting & Tracking: Users can create, manage, and complete personal goals for workout streaks, endurance, calories, and personal bests.

    📈 Automated Progress Logging: Every completed workout is automatically saved, calculating a performance score and updating your weekly summary and workout history.

    🌙 Sleek Dark Mode UI: A consistent and modern dark theme applied across all screens for a great user experience.

    🚀 Built with Expo Router: A fully featured, file-based navigation system for a clean and scalable app structure.

🛠️ Technology Stack

    Framework: React Native with Expo

    Navigation: Expo Router

    Machine Learning: TensorFlow Lite via react-native-fast-tflite for on-device inference.

    Camera: react-native-vision-camera for high-performance, frame-by-frame video processing.

    Local Storage: AsyncStorage for persisting user goals, workout history, and streaks.

    Styling: Themed stylesheets with a custom Theme Context for easy management of colors and styles.

🚀 Getting Started

To get a local copy up and running, follow these simple steps.
Prerequisites

    Node.js (LTS version recommended)

    Expo Go app on your iOS or Android device

Installation

    Clone the repo

    git clone [https://github.com/your-username/vitality-ai.git](https://github.com/your-username/vitality-ai.git)

    Install NPM packages

    npm install

    Run the app

    npx expo start

