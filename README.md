# The Gym-Box - AI-Powered Fitness & Diet Planning Platform

A production-ready web application that generates personalized workout and diet plans using AI technology. Built with Next.js, Convex, and Google's Gemini AI.

## 🎯 Features

- **Modal-Based Onboarding**: Intuitive 4-step form to collect user fitness data
- **Personalized Workout Plans**: AI-generated workout routines tailored to:
  - Fitness level (Beginner, Intermediate, Advanced)
  - Available equipment
  - Time constraints
  - Injury limitations
  - Specific fitness goals
- **Personalized Diet Plans**: Custom meal plans based on:
  - Dietary preferences (Omnivore, Vegetarian, Vegan, Keto, etc.)
  - Cultural food preferences (African, Western, Asian, Mixed)
  - Allergies and restrictions
  - Calorie targets (auto-calculated or custom)
- **User Authentication**: Secure authentication with Clerk
- **Program Management**: View and manage multiple fitness programs
- **Responsive Design**: Works seamlessly across all device sizes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Convex account
- A Clerk account
- Google Gemini API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd the-gym-box
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

4. Start the Convex development server:

```bash
npx convex dev
```

5. Start the Next.js development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
the-gym-box/
├── src/
│   ├── app/                      # Next.js app router pages
│   │   ├── api/                  # API routes
│   │   ├── (auth)/              # Authentication pages
│   │   ├── generate-program/    # Program generation page
│   │   ├── profile/             # User profile & programs
│   │   └── page.tsx             # Home page
│   ├── components/              # React components
│   │   ├── ui/                  # Shadcn UI components
│   │   ├── FitnessDataModal.tsx # Main data collection modal
│   │   └── ...
│   ├── lib/                     # Utility functions
│   └── constants/               # App constants
├── convex/                      # Convex backend
│   ├── http.ts                  # HTTP endpoints
│   ├── schema.ts                # Database schema
│   ├── plans.ts                 # Plan mutations/queries
│   └── users.ts                 # User mutations/queries
└── public/                      # Static assets
```

## 🔧 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Convex (serverless backend)
- **Authentication**: Clerk
- **AI**: Google Gemini 2.0 Flash
- **State Management**: React hooks + Convex queries

## 🎨 Key Components

### FitnessDataModal

Multi-step modal for collecting user fitness data with validation:

- Step 1: Personal information (age, gender, height, weight, fitness level)
- Step 2: Fitness goals
- Step 3: Workout preferences
- Step 4: Diet preferences

### Program Generation

Uses Google Gemini AI to generate:

- Structured workout plans with exercises, sets, and reps
- Balanced diet plans with meals and calorie targets
- Personalized recommendations based on user data

### Profile Dashboard

- View all generated programs
- Switch between different programs
- Tabbed interface for workout and diet plans
- Detailed exercise and meal breakdowns

## 🔐 Authentication

The app uses Clerk for authentication with webhook integration for user synchronization with Convex database.

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Convex Setup

1. Run `npx convex deploy` for production
2. Update `NEXT_PUBLIC_CONVEX_URL` with production URL

## 📝 API Endpoints

### POST /api/generate-program

Generates a personalized fitness and diet plan.

**Request Body:**

```json
{
  "user_id": "string",
  "age": number,
  "gender": "string",
  "height": number,
  "weight": number,
  "fitness_level": "string",
  "fitness_goal": "string",
  "workout_days": number,
  "dietary_style": "string",
  ...
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "planId": "string",
    "workoutPlan": {...},
    "dietPlan": {...}
  }
}
```

## 🐛 Known Issues & Solutions

All major bugs have been resolved in this version:

- ✅ Removed Vapi voice integration
- ✅ Implemented modal-based data collection
- ✅ Fixed form validation
- ✅ Improved error handling
- ✅ Enhanced UI consistency
- ✅ Optimized program generation logic

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Built by a Senior Full-Stack Engineer with expertise in health, fitness, and SaaS applications.

---

**Note**: This application is production-ready and has been thoroughly tested for stability, user experience, and performance.
