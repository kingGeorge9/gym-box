/**
 * Fitness Plan Generation
 * 
 * Core functions for generating personalized fitness plans using database-driven logic
 */

import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import {
  selectDietForUser,
  selectDailyMeals,
  calculateDailyCalories,
  type UserProfile,
} from "./dietSelectionEngine";
import {
  generateWeeklyWorkoutPlan,
  type WorkoutProfile,
} from "./workoutSelectionEngine";

// Generate complete fitness plan
export const generateFitnessPlan = action({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args): Promise<{ 
    success: boolean; 
    planId?: any; 
    message?: string; 
    reasoning?: any;
    diet?: any;
    workout?: any;
    calories?: number;
  }> => {
    // 1. Get user profile
    const profile = await ctx.runQuery(api.users.getUserProfile, {
      userId: args.userId,
    });

    if (!profile) {
      throw new Error("User profile not found. Please complete your profile first.");
    }

    // 2. Calculate nutrition targets
    const userProfile: UserProfile = {
      age: profile.age,
      gender: profile.gender,
      weight: profile.weight,
      height: profile.height,
      fitnessLevel: profile.fitnessLevel,
      primaryGoal: profile.primaryGoal,
      dietaryStyle: profile.dietaryStyle,
      culturalPreference: profile.culturalPreference,
      healthConditions: profile.healthConditions,
      allergies: profile.allergies,
      targetCalories: profile.targetCalories || 0,
    };

    // Calculate calories if not provided
    if (!userProfile.targetCalories) {
      userProfile.targetCalories = calculateDailyCalories(userProfile);
    }

    // 3. Select diet using intelligent engine
    const dietSelection = selectDietForUser(userProfile);

    // 4. Generate weekly meal plan
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const weeklyMeals = daysOfWeek.map((day, index) => {
      // Get all available meals for this diet
      const breakfastOptions = dietSelection.selectedDiet.breakfastOptions;
      const lunchOptions = dietSelection.selectedDiet.lunchOptions;
      const dinnerOptions = dietSelection.selectedDiet.dinnerOptions;
      
      // Rotate through available options to provide variety
      const breakfastIndex = index % breakfastOptions.length;
      const lunchIndex = index % lunchOptions.length;
      const dinnerIndex = index % dinnerOptions.length;
      
      // If there are multiple options, try to avoid same meals on consecutive days
      const getRotatedIndex = (baseIndex: number, optionsLength: number, dayIndex: number) => {
        if (optionsLength <= 1) return 0;
        return (baseIndex + Math.floor(dayIndex / 2)) % optionsLength;
      };

      const breakfast = breakfastOptions[getRotatedIndex(0, breakfastOptions.length, index)];
      const lunch = lunchOptions[getRotatedIndex(0, lunchOptions.length, index)];
      const dinner = dinnerOptions[getRotatedIndex(0, dinnerOptions.length, index)];
      
      // Select snacks
      const snackOptions = dietSelection.selectedDiet.snackOptions;
      const snacksForDay = snackOptions.slice(
        (index % snackOptions.length),
        Math.min((index % snackOptions.length) + 2, snackOptions.length)
      );

      return {
        dayOfWeek: day,
        dayNumber: index + 1,
        breakfast: breakfast,
        lunch: lunch,
        dinner: dinner,
        snacks: snacksForDay.length > 0 ? snacksForDay : [snackOptions[0]],
      };
    });

    // 5. Generate workout plan
    const workoutProfile: WorkoutProfile = {
      fitnessLevel: profile.fitnessLevel,
      primaryGoal: profile.primaryGoal,
      workoutLocation: profile.workoutLocation,
      availableEquipment: profile.availableEquipment,
      workoutDays: profile.workoutDays,
      timePerSession: profile.preferredTimePerSession,
      injuries: profile.injuries,
      avoidExercises: profile.workoutPreferences?.avoidExercises,
    };

    const workoutPlan = generateWeeklyWorkoutPlan(workoutProfile);

    // 6. Create plan in database
    const planId = await ctx.runMutation(internal.planManagement.createPlan, {
      userId: profile.userId,
      profileId: profile._id,
      selectedDietId: dietSelection.selectedDiet.id,
      targetCalories: userProfile.targetCalories,
      weeklyStructure: workoutPlan.workouts.map(w => w.day),
      dietReasoning: dietSelection.reasoning,
      workoutReasoning: workoutPlan.reasoning,
      calorieReasoning: `Based on your profile, we calculated ${userProfile.targetCalories} calories/day to support your ${profile.primaryGoal} goal.`,
    });

    // 7. Create meal plans
    for (const dayMeals of weeklyMeals) {
      await ctx.runMutation(internal.planManagement.createMealPlan, {
        planId,
        userId: profile.userId,
        dayOfWeek: dayMeals.dayOfWeek,
        breakfast: {
          mealName: dayMeals.breakfast.name,
          calories: dayMeals.breakfast.calories,
          protein: dayMeals.breakfast.protein,
          carbs: dayMeals.breakfast.carbs,
          fat: dayMeals.breakfast.fat,
          source: dietSelection.selectedDiet.name,
        },
        lunch: {
          mealName: dayMeals.lunch.name,
          calories: dayMeals.lunch.calories,
          protein: dayMeals.lunch.protein,
          carbs: dayMeals.lunch.carbs,
          fat: dayMeals.lunch.fat,
          source: dietSelection.selectedDiet.name,
        },
        dinner: {
          mealName: dayMeals.dinner.name,
          calories: dayMeals.dinner.calories,
          protein: dayMeals.dinner.protein,
          carbs: dayMeals.dinner.carbs,
          fat: dayMeals.dinner.fat,
          source: dietSelection.selectedDiet.name,
        },
        snacks: dayMeals.snacks.map(snack => ({
          mealName: snack.name,
          calories: snack.calories,
          source: dietSelection.selectedDiet.name,
        })),
      });
    }

    // 8. Create workout plans
    for (const workout of workoutPlan.workouts) {
      await ctx.runMutation(internal.planManagement.createWorkoutPlan, {
        planId,
        userId: profile.userId,
        dayOfWeek: workout.day,
        dayNumber: workout.dayNumber,
        workoutType: workout.workoutType,
        estimatedDuration: workout.estimatedDuration,
        difficultyLevel: profile.fitnessLevel,
        exercises: workout.exercises.map(ex => ({
          exerciseId: ex.exercise.id,
          exerciseName: ex.exercise.name,
          category: ex.exercise.category,
          sets: ex.sets,
          reps: ex.reps,
          duration: ex.duration,
          restSeconds: ex.restSeconds,
          equipment: ex.exercise.equipment,
          primaryMuscles: [...ex.exercise.primaryMuscles],
        })),
        weekNumber: 1,
      });
    }

    return {
      success: true,
      planId,
      diet: {
        name: dietSelection.selectedDiet.name,
        reasoning: dietSelection.reasoning,
      },
      workout: {
        reasoning: workoutPlan.reasoning,
        daysPerWeek: workoutPlan.workouts.length,
      },
      calories: userProfile.targetCalories,
    };
  },
});

// Get active plan for user
export const getActivePlan = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Get user profile
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!profile) return null;

    // Get active plan
    const plan = await ctx.db
      .query("plans")
      .withIndex("by_active", (q) => q.eq("isActive", true).eq("userId", profile.userId))
      .first();

    if (!plan) return null;

    // Get meal plans
    const mealPlans = await ctx.db
      .query("mealPlan")
      .withIndex("by_plan_id", (q) => q.eq("planId", plan._id))
      .collect();

    // Get workout plans
    const workoutPlans = await ctx.db
      .query("workoutPlan")
      .withIndex("by_plan_id", (q) => q.eq("planId", plan._id))
      .collect();

    return {
      plan,
      meals: mealPlans,
      workouts: workoutPlans,
    };
  },
});

// Get plan summary
export const getPlanSummary = query({
  args: { planId: v.id("plans") },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.planId);
    if (!plan) return null;

    const mealPlans = await ctx.db
      .query("mealPlan")
      .withIndex("by_plan_id", (q) => q.eq("planId", args.planId))
      .collect();

    const workoutPlans = await ctx.db
      .query("workoutPlan")
      .withIndex("by_plan_id", (q) => q.eq("planId", args.planId))
      .collect();

    // Calculate weekly totals
    const weeklyCalories = mealPlans.reduce((sum, day) => {
      const avg = (day.totalCalories.min + day.totalCalories.max) / 2;
      return sum + avg;
    }, 0);

    const totalWorkoutMinutes = workoutPlans.reduce((sum, workout) => {
      return sum + workout.estimatedDuration;
    }, 0);

    return {
      plan,
      summary: {
        avgDailyCalories: Math.round(weeklyCalories / 7),
        weeklyWorkoutTime: totalWorkoutMinutes,
        workoutDaysPerWeek: workoutPlans.length,
        diet: plan.selectedDietId,
      },
      reasoning: plan.selectionReasoning,
    };
  },
});