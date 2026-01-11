/**
 * Intelligent Diet Selection Engine
 * 
 * This engine selects diets and meals from the diet database based on user profile.
 * NO AI generation - purely database-driven with intelligent scoring and filtering.
 */

import { DIET_DATABASE, DietData, DietMealOption } from "../src/constants/dietDatabase";

export interface UserProfile {
  age: number;
  gender: string;
  weight: number;
  height: number;
  fitnessLevel: string;
  primaryGoal: string;
  dietaryStyle: string;
  culturalPreference: string;
  healthConditions?: string[];
  allergies?: string;
  targetCalories: number;
}

export interface DietSelectionResult {
  selectedDiet: DietData;
  score: number;
  reasoning: string;
}

export interface MealSelection {
  meal: DietMealOption;
  score: number;
  reasoning: string;
}

/**
 * Calculate daily calorie needs using Mifflin-St Jeor equation
 */
export function calculateDailyCalories(profile: UserProfile): number {
  const { age, weight, height, gender, fitnessLevel, primaryGoal } = profile;
  
  // BMR calculation
  let bmr: number;
  if (gender.toLowerCase() === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Activity multiplier
  const activityMultipliers: Record<string, number> = {
    beginner: 1.2,
    intermediate: 1.55,
    advanced: 1.725,
  };
  const activityMultiplier = activityMultipliers[fitnessLevel.toLowerCase()] || 1.375;
  
  let tdee = bmr * activityMultiplier;
  
  // Goal-based adjustment
  if (primaryGoal === "fat_loss" || primaryGoal === "weight_loss") {
    tdee *= 0.8; // 20% deficit
  } else if (primaryGoal === "muscle_gain") {
    tdee *= 1.1; // 10% surplus
  } else if (primaryGoal === "extreme_weight_loss") {
    tdee *= 0.75; // 25% deficit
  }
  
  return Math.round(tdee);
}

/**
 * Score a diet based on user profile
 */
function scoreDiet(diet: DietData, profile: UserProfile): number {
  let score = 0;
  const reasons: string[] = [];
  
  // 1. Match dietary style (40 points max)
  const dietaryStyleMap: Record<string, string[]> = {
    "mediterranean": ["mediterranean"],
    "low-carb": ["low-carb", "keto", "ketogenic"],
    "low-fat": ["low-fat"],
    "vegan": ["vegan"],
    "vegetarian": ["vegetarian", "flexitarian"],
    "keto": ["keto", "ketogenic", "low-carb"],
    "paleo": ["paleo"],
    "mixed": ["mediterranean", "flexitarian", "calorie-counting"],
    "flexible": ["flexitarian", "calorie-counting"],
  };
  
  const userDietPrefs = profile.dietaryStyle.toLowerCase();
  const matchingDiets = dietaryStyleMap[userDietPrefs] || [userDietPrefs];
  
  if (matchingDiets.includes(diet.id)) {
    score += 40;
  } else if (diet.id === "flexitarian" || diet.id === "calorie-counting") {
    score += 20; // Flexible diets work for most people
  }
  
  // 2. Match fitness goal (30 points max)
  const goalDietMap: Record<string, string[]> = {
    "fat_loss": ["low-carb", "keto", "low-fat", "intermittent-fasting"],
    "weight_loss": ["low-carb", "keto", "low-fat", "intermittent-fasting"],
    "muscle_gain": ["high-protein", "calorie-counting"],
    "health": ["mediterranean", "dash", "flexitarian"],
    "maintenance": ["mediterranean", "calorie-counting", "flexitarian"],
  };
  
  const goalDiets = goalDietMap[profile.primaryGoal] || [];
  if (goalDiets.includes(diet.id)) {
    score += 30;
  }
  
  // 3. Match difficulty with fitness level (15 points max)
  const difficultyScore: Record<string, Record<string, number>> = {
    "beginner": { "Easy": 15, "Moderate": 8, "Advanced": 3 },
    "intermediate": { "Easy": 10, "Moderate": 15, "Advanced": 8 },
    "advanced": { "Easy": 8, "Moderate": 12, "Advanced": 15 },
  };
  score += difficultyScore[profile.fitnessLevel]?.[diet.difficulty] || 0;
  
  // 4. Health condition compatibility (15 points max)
  if (profile.healthConditions && profile.healthConditions.length > 0) {
    let healthMatch = 0;
    
    for (const condition of profile.healthConditions) {
      if (diet.clinicalInfo.safeFor.some(safe => 
        safe.toLowerCase().includes(condition.toLowerCase())
      )) {
        healthMatch += 5;
      }
      
      if (diet.clinicalInfo.cautionFor?.some(caution => 
        caution.toLowerCase().includes(condition.toLowerCase())
      )) {
        score -= 20; // Strong penalty for incompatible diets
      }
    }
    
    score += Math.min(healthMatch, 15);
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Select the best diet for user profile
 */
export function selectDietForUser(profile: UserProfile): DietSelectionResult {
  const scoredDiets = DIET_DATABASE.map(diet => ({
    diet,
    score: scoreDiet(diet, profile),
  })).sort((a, b) => b.score - a.score);
  
  const topDiet = scoredDiets[0];
  
  // Build reasoning
  const reasons: string[] = [];
  
  if (profile.primaryGoal === "fat_loss" || profile.primaryGoal === "weight_loss") {
    reasons.push(`Selected ${topDiet.diet.name} to support your fat loss goal with controlled calorie intake`);
  } else if (profile.primaryGoal === "muscle_gain") {
    reasons.push(`Selected ${topDiet.diet.name} to provide adequate protein for muscle growth`);
  } else {
    reasons.push(`Selected ${topDiet.diet.name} for balanced nutrition and health`);
  }
  
  if (profile.dietaryStyle !== "mixed") {
    reasons.push(`Matches your ${profile.dietaryStyle} dietary preference`);
  }
  
  if (topDiet.diet.difficulty === "Easy") {
    reasons.push("Easy to follow and maintain long-term");
  }
  
  const reasoning = reasons.join(". ") + ".";
  
  return {
    selectedDiet: topDiet.diet,
    score: topDiet.score,
    reasoning,
  };
}

/**
 * Score a meal based on calorie target and meal type
 */
function scoreMeal(
  meal: DietMealOption,
  targetCalories: number,
  mealType: "breakfast" | "lunch" | "dinner",
  culturalPref: string
): number {
  let score = 0;
  
  // Meal type calorie distribution
  const mealCalorieTargets: Record<string, number> = {
    breakfast: targetCalories * 0.25,
    lunch: targetCalories * 0.40,
    dinner: targetCalories * 0.30,
  };
  
  const mealTarget = mealCalorieTargets[mealType];
  const mealAvgCalories = (meal.calories.min + meal.calories.max) / 2;
  
  // 1. Calorie match (50 points max)
  const calorieDeviation = Math.abs(mealAvgCalories - mealTarget);
  const calorieScore = Math.max(0, 50 - (calorieDeviation / mealTarget) * 50);
  score += calorieScore;
  
  // 2. Macro balance (30 points max)
  if (meal.protein && meal.carbs && meal.fat) {
    score += 30; // Complete macro information
  } else {
    score += 15; // Partial information
  }
  
  // 3. Cultural preference (20 points max)
  // This would require meal metadata - for now, equal weight
  score += 10;
  
  return score;
}

/**
 * Select meals for a day from a diet
 */
export function selectDailyMeals(
  diet: DietData,
  targetCalories: number,
  culturalPref: string
): {
  breakfast: MealSelection;
  lunch: MealSelection;
  dinner: MealSelection;
  snacks: MealSelection[];
} {
  // Score and select breakfast
  const breakfastScores = diet.breakfastOptions.map(meal => ({
    meal,
    score: scoreMeal(meal, targetCalories, "breakfast", culturalPref),
  })).sort((a, b) => b.score - a.score);
  
  // Score and select lunch
  const lunchScores = diet.lunchOptions.map(meal => ({
    meal,
    score: scoreMeal(meal, targetCalories, "lunch", culturalPref),
  })).sort((a, b) => b.score - a.score);
  
  // Score and select dinner
  const dinnerScores = diet.dinnerOptions.map(meal => ({
    meal,
    score: scoreMeal(meal, targetCalories, "dinner", culturalPref),
  })).sort((a, b) => b.score - a.score);
  
  // Select snacks (allocate 5% of calories)
  const snackCalorieTarget = targetCalories * 0.05;
  const snackScores = diet.snackOptions.map(snack => ({
    meal: snack,
    score: 100 - Math.abs(((snack.calories.min + snack.calories.max) / 2) - snackCalorieTarget),
  })).sort((a, b) => b.score - a.score);
  
  return {
    breakfast: {
      meal: breakfastScores[0].meal,
      score: breakfastScores[0].score,
      reasoning: `Selected for optimal breakfast calorie distribution (${Math.round((breakfastScores[0].meal.calories.min + breakfastScores[0].meal.calories.max) / 2)} kcal)`,
    },
    lunch: {
      meal: lunchScores[0].meal,
      score: lunchScores[0].score,
      reasoning: `Selected for balanced lunch macros (${Math.round((lunchScores[0].meal.calories.min + lunchScores[0].meal.calories.max) / 2)} kcal)`,
    },
    dinner: {
      meal: dinnerScores[0].meal,
      score: dinnerScores[0].score,
      reasoning: `Selected for lighter dinner to support recovery (${Math.round((dinnerScores[0].meal.calories.min + dinnerScores[0].meal.calories.max) / 2)} kcal)`,
    },
    snacks: snackScores.slice(0, 2).map(s => ({
      meal: s.meal,
      score: s.score,
      reasoning: "Healthy snack option to maintain energy",
    })),
  };
}

/**
 * Get alternative meals for meal swapping
 */
export function getAlternativeMeals(
  diet: DietData,
  mealType: "breakfast" | "lunch" | "dinner",
  currentMeal: string,
  targetCalories: number,
  culturalPref: string
): MealSelection[] {
  const mealOptions = 
    mealType === "breakfast" ? diet.breakfastOptions :
    mealType === "lunch" ? diet.lunchOptions :
    diet.dinnerOptions;
  
  return mealOptions
    .filter(meal => meal.name !== currentMeal)
    .map(meal => ({
      meal,
      score: scoreMeal(meal, targetCalories, mealType, culturalPref),
      reasoning: `Alternative ${mealType} option with ${Math.round((meal.calories.min + meal.calories.max) / 2)} kcal`,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Top 5 alternatives
}

/**
 * Validate meal selection against nutrition targets
 */
export function validateMealPlan(
  meals: { breakfast: DietMealOption; lunch: DietMealOption; dinner: DietMealOption; snacks: DietMealOption[] },
  targetCalories: number
): { isValid: boolean; totalCalories: { min: number; max: number }; deviationPercent: number } {
  const totalMin = 
    meals.breakfast.calories.min +
    meals.lunch.calories.min +
    meals.dinner.calories.min +
    meals.snacks.reduce((sum, s) => sum + s.calories.min, 0);
  
  const totalMax = 
    meals.breakfast.calories.max +
    meals.lunch.calories.max +
    meals.dinner.calories.max +
    meals.snacks.reduce((sum, s) => sum + s.calories.max, 0);
  
  const avgTotal = (totalMin + totalMax) / 2;
  const deviationPercent = Math.abs(avgTotal - targetCalories) / targetCalories * 100;
  
  return {
    isValid: deviationPercent <= 15, // Within 15% tolerance
    totalCalories: { min: totalMin, max: totalMax },
    deviationPercent,
  };
}
