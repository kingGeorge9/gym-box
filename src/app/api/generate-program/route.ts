import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Initialize Convex client
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured");
    }

    const client = new ConvexHttpClient(convexUrl);

    // First, create or update user profile
    await client.mutation(api.users.upsertUserProfile, {
      userId: body.user_id,
      name: body.name,
      age: body.age,
      gender: body.gender,
      height: body.height,
      weight: body.weight,
      bodyFat: body.body_fat,
      fitnessLevel: body.fitness_level,
      primaryGoal: body.fitness_goal,
      additionalGoals: body.additional_goals || [],
      activityLevel: body.fitness_level,
      workoutLocation: body.workout_location,
      availableEquipment: body.available_equipment || [],
      workoutDays: body.workout_days,
      preferredTimePerSession: body.time_per_session,
      injuries: body.injuries,
      dietaryStyle: body.dietary_style,
      culturalPreference: body.cultural_preference,
      allergies: body.allergies,
      foodDislikes: body.dietary_restrictions ? [body.dietary_restrictions] : [],
      mealsPerDay: body.meals_per_day,
      targetCalories: body.calorie_target,
    });

    // Generate fitness plan using database-driven logic
    const result = await client.action(api.planGeneration.generateFitnessPlan, {
      userId: body.user_id,
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in generate-program API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
