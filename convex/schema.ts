import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    userId: v.optional(v.string()),
    // Legacy field for migration
    clerkId: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),

  // User profile with comprehensive fitness data
  userProfiles: defineTable({
    userId: v.string(),
    name: v.optional(v.string()),
    
    // Biometric data
    age: v.number(),
    gender: v.string(),
    height: v.number(), // cm
    weight: v.number(), // kg
    bodyFat: v.optional(v.number()),
    
    // Fitness profile
    fitnessLevel: v.string(), // beginner, intermediate, advanced
    primaryGoal: v.string(), // fat_loss, muscle_gain, maintenance, health, strength
    additionalGoals: v.array(v.string()),
    activityLevel: v.string(),
    
    // Workout preferences
    workoutLocation: v.string(), // home, gym, both
    availableEquipment: v.array(v.string()),
    workoutDays: v.number(),
    preferredTimePerSession: v.number(), // minutes
    injuries: v.optional(v.string()),
    workoutPreferences: v.optional(v.object({
      avoidExercises: v.array(v.string()),
      favoriteExercises: v.array(v.string()),
      intensityPreference: v.string(), // low, moderate, high
    })),
    
    // Diet preferences
    dietaryStyle: v.string(), // mediterranean, low-carb, vegan, etc.
    culturalPreference: v.string(), // african, western, mixed
    allergies: v.optional(v.string()),
    foodDislikes: v.optional(v.array(v.string())),
    mealsPerDay: v.number(),
    targetCalories: v.optional(v.number()),
    
    // Health conditions
    healthConditions: v.optional(v.array(v.string())),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"]),

  // Fitness plans
  plans: defineTable({
    userId: v.string(),
    profileId: v.optional(v.string()),
    name: v.string(),
    planType: v.string(), // workout, diet, combined
    
    // Plan configuration
    selectedDietId: v.optional(v.string()),
    targetCalories: v.number(),
    proteinTarget: v.optional(v.number()),
    carbsTarget: v.optional(v.number()),
    fatTarget: v.optional(v.number()),
    
    // Weekly structure
    weeklyStructure: v.array(v.string()), // ["monday", "tuesday", "rest", ...]
    
    // Status
    isActive: v.boolean(),
    startDate: v.number(),
    generatedAt: v.number(),
    
    // Reasoning for transparency
    selectionReasoning: v.object({
      dietReason: v.optional(v.string()),
      workoutReason: v.optional(v.string()),
      calorieReason: v.optional(v.string()),
    }),
  })
    .index("by_user_id", ["userId"])
    .index("by_profile_id", ["profileId"])
    .index("by_active", ["isActive", "userId"]),

  // Diet plan meals - daily meal assignments
  mealPlan: defineTable({
    planId: v.string(),
    userId: v.string(),
    dayOfWeek: v.string(), // monday, tuesday, etc.
    date: v.optional(v.string()), // YYYY-MM-DD for specific dates
    
    // Meal selections from diet database
    breakfast: v.object({
      mealName: v.string(),
      calories: v.object({ min: v.number(), max: v.number() }),
      protein: v.optional(v.object({ min: v.number(), max: v.number() })),
      carbs: v.optional(v.object({ min: v.number(), max: v.number() })),
      fat: v.optional(v.object({ min: v.number(), max: v.number() })),
      source: v.string(), // Which diet it came from
    }),
    
    lunch: v.object({
      mealName: v.string(),
      calories: v.object({ min: v.number(), max: v.number() }),
      protein: v.optional(v.object({ min: v.number(), max: v.number() })),
      carbs: v.optional(v.object({ min: v.number(), max: v.number() })),
      fat: v.optional(v.object({ min: v.number(), max: v.number() })),
      source: v.string(),
    }),
    
    dinner: v.object({
      mealName: v.string(),
      calories: v.object({ min: v.number(), max: v.number() }),
      protein: v.optional(v.object({ min: v.number(), max: v.number() })),
      carbs: v.optional(v.object({ min: v.number(), max: v.number() })),
      fat: v.optional(v.object({ min: v.number(), max: v.number() })),
      source: v.string(),
    }),
    
    snacks: v.array(v.object({
      mealName: v.string(),
      calories: v.object({ min: v.number(), max: v.number() }),
      source: v.string(),
    })),
    
    totalCalories: v.object({ min: v.number(), max: v.number() }),
    isCustomized: v.boolean(), // User modified meals
  })
    .index("by_plan_id", ["planId"])
    .index("by_user_and_day", ["userId", "dayOfWeek"]),

  // Workout plan exercises - daily workout assignments
  workoutPlan: defineTable({
    planId: v.string(),
    userId: v.string(),
    dayOfWeek: v.string(),
    dayNumber: v.number(), // 1-7
    
    // Workout metadata
    workoutType: v.string(), // full_body, upper, lower, cardio, rest
    estimatedDuration: v.number(), // minutes
    difficultyLevel: v.string(),
    
    // Exercises from workout database
    exercises: v.array(v.object({
      exerciseId: v.string(),
      exerciseName: v.string(),
      category: v.string(),
      sets: v.number(),
      reps: v.optional(v.number()),
      duration: v.optional(v.number()), // seconds for cardio/plank
      restSeconds: v.number(),
      equipment: v.string(),
      notes: v.optional(v.string()),
      primaryMuscles: v.array(v.string()),
    })),
    
    // Progressive overload tracking
    weekNumber: v.number(),
    progressionNotes: v.optional(v.string()),
    
    isCustomized: v.boolean(),
  })
    .index("by_plan_id", ["planId"])
    .index("by_user_and_day", ["userId", "dayOfWeek"]),

  // Progress tracking
  progressTracking: defineTable({
    userId: v.string(),
    planId: v.string(),
    date: v.string(), // YYYY-MM-DD
    
    // Workout completion
    workoutCompleted: v.boolean(),
    exercisesCompleted: v.array(v.string()), // exercise IDs
    workoutDuration: v.optional(v.number()),
    workoutNotes: v.optional(v.string()),
    
    // Meal adherence
    mealsLogged: v.array(v.string()), // breakfast, lunch, dinner
    caloriesConsumed: v.optional(v.number()),
    
    // Body measurements
    weight: v.optional(v.number()),
    bodyFat: v.optional(v.number()),
    
    timestamp: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_plan_id", ["planId"])
    .index("by_date", ["userId", "date"]),
});