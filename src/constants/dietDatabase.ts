// Diet Database - 12 Most Common Diets
// Clinically adapted for African & Nigerian users

export interface DietMealOption {
  name: string;
  calories: { min: number; max: number };
  protein?: { min: number; max: number };
  carbs?: { min: number; max: number };
  fat?: { min: number; max: number };
}

export interface DietSnackOption {
  name: string;
  calories: { min: number; max: number };
}

export interface DietClinicalInfo {
  safeFor: string[];
  cautionFor?: string[];
  guidelines: string[];
  clinicalNotes: string[];
}

export interface DietPrinciples {
  emphasis: string[];
  moderate?: string[];
  limited?: string[];
  avoids?: string[];
}

export interface DietData {
  id: string;
  name: string;
  fullName: string;
  description: string;
  icon: string;
  difficulty: "Easy" | "Moderate" | "Advanced";
  principles: DietPrinciples;
  clinicalInfo: DietClinicalInfo;
  breakfastOptions: DietMealOption[];
  lunchOptions: DietMealOption[];
  dinnerOptions: DietMealOption[];
  snackOptions: DietSnackOption[];
}

export const DIET_DATABASE: DietData[] = [
  // Reduced set: 12 most common diets (concise entries)
  {
    id: "mediterranean",
    name: "Mediterranean",
    fullName: "Mediterranean Diet",
    description: "Plant-forward diet emphasizing vegetables, fruits, whole grains, legumes, olive oil, and fish.",
    icon: "leaf-outline",
    difficulty: "Easy",
    principles: {
      emphasis: ["Vegetables", "Fruits", "Whole grains", "Legumes", "Olive oil"],
      moderate: ["Fish", "Poultry", "Dairy"],
      limited: ["Red meat", "Added sugars"],
    },
    clinicalInfo: {
      safeFor: ["General adults", "Hypertension", "Type-2 diabetes (non-insulin)"],
      guidelines: ["WHO", "AHA"],
      clinicalNotes: ["Cardio-protective pattern", "Supports metabolic health"],
    },
    breakfastOptions: [
      { name: "Oatmeal + Fruit + Nuts", calories: { min: 300, max: 380 }, protein: { min: 8, max: 12 }, carbs: { min: 40, max: 55 }, fat: { min: 10, max: 16 } },
      { name: "Greek Yogurt + Berries + Honey", calories: { min: 280, max: 350 }, protein: { min: 12, max: 18 }, carbs: { min: 35, max: 45 }, fat: { min: 6, max: 12 } },
      { name: "Whole Grain Toast + Avocado + Tomato", calories: { min: 320, max: 400 }, protein: { min: 8, max: 12 }, carbs: { min: 38, max: 50 }, fat: { min: 14, max: 20 } },
      { name: "Vegetable Omelet + Whole Grain Bread", calories: { min: 310, max: 390 }, protein: { min: 16, max: 22 }, carbs: { min: 30, max: 40 }, fat: { min: 12, max: 18 } },
      { name: "Smoothie Bowl (Fruit + Nuts + Seeds)", calories: { min: 290, max: 360 }, protein: { min: 9, max: 14 }, carbs: { min: 42, max: 55 }, fat: { min: 10, max: 15 } },
      { name: "Cottage Cheese + Fresh Fruit", calories: { min: 270, max: 340 }, protein: { min: 14, max: 20 }, carbs: { min: 32, max: 42 }, fat: { min: 5, max: 10 } },
      { name: "Muesli + Milk + Dried Fruits", calories: { min: 310, max: 380 }, protein: { min: 10, max: 15 }, carbs: { min: 45, max: 58 }, fat: { min: 8, max: 14 } },
    ],
    lunchOptions: [
      { name: "Grilled Fish + Salad + Whole Grain", calories: { min: 420, max: 520 }, protein: { min: 25, max: 35 }, carbs: { min: 35, max: 50 }, fat: { min: 12, max: 20 } },
      { name: "Chicken Souvlaki + Greek Salad + Pita", calories: { min: 440, max: 530 }, protein: { min: 28, max: 38 }, carbs: { min: 38, max: 52 }, fat: { min: 14, max: 22 } },
      { name: "Lentil Soup + Whole Grain Bread + Salad", calories: { min: 400, max: 490 }, protein: { min: 18, max: 26 }, carbs: { min: 52, max: 68 }, fat: { min: 8, max: 14 } },
      { name: "Tuna Salad + Olive Oil + Vegetables", calories: { min: 410, max: 500 }, protein: { min: 26, max: 34 }, carbs: { min: 28, max: 40 }, fat: { min: 16, max: 24 } },
      { name: "Grilled Vegetables + Quinoa + Feta", calories: { min: 390, max: 480 }, protein: { min: 16, max: 24 }, carbs: { min: 42, max: 56 }, fat: { min: 14, max: 20 } },
      { name: "Salmon + Brown Rice + Steamed Broccoli", calories: { min: 430, max: 520 }, protein: { min: 30, max: 40 }, carbs: { min: 40, max: 52 }, fat: { min: 14, max: 22 } },
      { name: "Chickpea Stew + Whole Grain + Yogurt", calories: { min: 400, max: 490 }, protein: { min: 20, max: 28 }, carbs: { min: 50, max: 65 }, fat: { min: 10, max: 16 } },
    ],
    dinnerOptions: [
      { name: "Vegetable Stew + Legumes", calories: { min: 380, max: 480 }, protein: { min: 15, max: 24 }, carbs: { min: 40, max: 60 }, fat: { min: 10, max: 18 } },
      { name: "Baked Fish + Roasted Vegetables", calories: { min: 360, max: 450 }, protein: { min: 28, max: 36 }, carbs: { min: 25, max: 38 }, fat: { min: 12, max: 20 } },
      { name: "Grilled Chicken + Greek Salad", calories: { min: 370, max: 460 }, protein: { min: 30, max: 38 }, carbs: { min: 20, max: 32 }, fat: { min: 14, max: 22 } },
      { name: "Pasta Primavera (Whole Grain + Veggies)", calories: { min: 390, max: 480 }, protein: { min: 14, max: 22 }, carbs: { min: 50, max: 65 }, fat: { min: 12, max: 18 } },
      { name: "Stuffed Bell Peppers + Side Salad", calories: { min: 350, max: 440 }, protein: { min: 18, max: 26 }, carbs: { min: 35, max: 50 }, fat: { min: 10, max: 16 } },
      { name: "Grilled Shrimp + Couscous + Vegetables", calories: { min: 380, max: 470 }, protein: { min: 26, max: 34 }, carbs: { min: 38, max: 52 }, fat: { min: 10, max: 16 } },
      { name: "Turkey Meatballs + Tomato Sauce + Zucchini", calories: { min: 370, max: 460 }, protein: { min: 28, max: 36 }, carbs: { min: 22, max: 36 }, fat: { min: 14, max: 22 } },
    ],
    snackOptions: [ 
      { name: "Fresh fruit", calories: { min: 80, max: 150 } },
      { name: "Handful of nuts", calories: { min: 120, max: 180 } },
      { name: "Greek yogurt", calories: { min: 100, max: 160 } },
      { name: "Hummus + veggie sticks", calories: { min: 110, max: 170 } },
    ],
  },

  {
    id: "low-carb",
    name: "Low-Carb",
    fullName: "Low-Carbohydrate Diet",
    description: "Reduced carbohydrate intake with emphasis on protein, vegetables, and healthy fats.",
    icon: "flash-outline",
    difficulty: "Moderate",
    principles: { emphasis: ["Protein", "Vegetables", "Healthy fats"], limited: ["High-GI carbs", "Added sugar"] },
    clinicalInfo: { safeFor: ["Adults", "Type-2 diabetes (non-insulin)"], guidelines: ["ADA"], clinicalNotes: ["Useful for glycemic control and weight loss"] },
    breakfastOptions: [ 
      { name: "Eggs + Avocado", calories: { min: 300, max: 380 }, protein: { min: 14, max: 22 }, carbs: { min: 6, max: 12 }, fat: { min: 20, max: 30 } },
      { name: "Greek Yogurt + Berries + Almonds", calories: { min: 280, max: 360 }, protein: { min: 16, max: 24 }, carbs: { min: 8, max: 14 }, fat: { min: 18, max: 26 } },
      { name: "Scrambled Eggs + Spinach + Cheese", calories: { min: 310, max: 390 }, protein: { min: 18, max: 26 }, carbs: { min: 5, max: 10 }, fat: { min: 22, max: 32 } },
      { name: "Omelet + Mushrooms + Bell Peppers", calories: { min: 290, max: 370 }, protein: { min: 16, max: 24 }, carbs: { min: 7, max: 13 }, fat: { min: 20, max: 28 } },
      { name: "Smoked Salmon + Cream Cheese + Cucumber", calories: { min: 300, max: 380 }, protein: { min: 20, max: 28 }, carbs: { min: 6, max: 11 }, fat: { min: 20, max: 28 } },
      { name: "Protein Smoothie + Nut Butter", calories: { min: 310, max: 390 }, protein: { min: 22, max: 30 }, carbs: { min: 8, max: 14 }, fat: { min: 18, max: 26 } },
      { name: "Breakfast Bowl (Eggs + Bacon + Avocado)", calories: { min: 320, max: 400 }, protein: { min: 20, max: 28 }, carbs: { min: 6, max: 12 }, fat: { min: 24, max: 34 } },
    ],
    lunchOptions: [ 
      { name: "Grilled Chicken + Veggies", calories: { min: 350, max: 450 }, protein: { min: 28, max: 40 }, carbs: { min: 10, max: 25 }, fat: { min: 12, max: 22 } },
      { name: "Beef Stir-fry + Cauliflower Rice", calories: { min: 370, max: 460 }, protein: { min: 30, max: 42 }, carbs: { min: 12, max: 22 }, fat: { min: 16, max: 26 } },
      { name: "Salmon Salad + Olive Oil Dressing", calories: { min: 360, max: 450 }, protein: { min: 32, max: 44 }, carbs: { min: 8, max: 18 }, fat: { min: 18, max: 28 } },
      { name: "Turkey Burger (No Bun) + Side Salad", calories: { min: 340, max: 430 }, protein: { min: 28, max: 38 }, carbs: { min: 10, max: 20 }, fat: { min: 14, max: 24 } },
      { name: "Grilled Shrimp + Zucchini Noodles", calories: { min: 330, max: 420 }, protein: { min: 30, max: 40 }, carbs: { min: 12, max: 22 }, fat: { min: 12, max: 20 } },
      { name: "Chicken Caesar Salad (No Croutons)", calories: { min: 360, max: 450 }, protein: { min: 32, max: 42 }, carbs: { min: 9, max: 18 }, fat: { min: 16, max: 26 } },
      { name: "Pork Chops + Green Beans + Butter", calories: { min: 380, max: 470 }, protein: { min: 34, max: 44 }, carbs: { min: 10, max: 20 }, fat: { min: 18, max: 28 } },
    ],
    dinnerOptions: [ 
      { name: "Fish + Leafy Greens", calories: { min: 300, max: 420 }, protein: { min: 22, max: 32 }, carbs: { min: 8, max: 18 }, fat: { min: 10, max: 18 } },
      { name: "Steak + Asparagus + Butter", calories: { min: 380, max: 480 }, protein: { min: 36, max: 46 }, carbs: { min: 6, max: 14 }, fat: { min: 20, max: 30 } },
      { name: "Baked Chicken Thighs + Broccoli", calories: { min: 350, max: 440 }, protein: { min: 32, max: 42 }, carbs: { min: 10, max: 18 }, fat: { min: 16, max: 26 } },
      { name: "Grilled Salmon + Brussels Sprouts", calories: { min: 340, max: 430 }, protein: { min: 30, max: 40 }, carbs: { min: 12, max: 20 }, fat: { min: 16, max: 24 } },
      { name: "Lamb Chops + Roasted Vegetables", calories: { min: 390, max: 480 }, protein: { min: 34, max: 44 }, carbs: { min: 10, max: 18 }, fat: { min: 22, max: 32 } },
      { name: "Turkey Meatballs + Marinara + Zucchini", calories: { min: 330, max: 420 }, protein: { min: 30, max: 40 }, carbs: { min: 12, max: 22 }, fat: { min: 14, max: 22 } },
      { name: "Cod + Cauliflower Mash + Green Salad", calories: { min: 320, max: 410 }, protein: { min: 28, max: 38 }, carbs: { min: 14, max: 24 }, fat: { min: 12, max: 20 } },
    ],
    snackOptions: [ 
      { name: "Nuts (small)", calories: { min: 100, max: 180 } },
      { name: "Cheese cubes", calories: { min: 90, max: 150 } },
      { name: "Hard-boiled eggs", calories: { min: 70, max: 140 } },
      { name: "Celery + almond butter", calories: { min: 110, max: 170 } },
    ],
  },

  {
    id: "low-fat",
    name: "Low-Fat",
    fullName: "Low-Fat Diet",
    description: "Focus on reducing total fat intake while prioritizing whole grains, lean protein and vegetables.",
    icon: "leaf",
    difficulty: "Easy",
    principles: { emphasis: ["Whole grains", "Fruits", "Vegetables"], limited: ["Saturated fat"] },
    clinicalInfo: { safeFor: ["General adults"], guidelines: ["WHO"], clinicalNotes: ["Helpful for some lipid-lowering goals"] },
    breakfastOptions: [ { name: "Fruit + Low-fat Yogurt", calories: { min: 220, max: 300 }, protein: { min: 8, max: 12 }, carbs: { min: 35, max: 50 }, fat: { min: 2, max: 6 } } ],
    lunchOptions: [ { name: "Grilled Turkey + Salad", calories: { min: 320, max: 420 }, protein: { min: 25, max: 34 }, carbs: { min: 20, max: 35 }, fat: { min: 6, max: 12 } } ],
    dinnerOptions: [ { name: "Steamed Fish + Veggies", calories: { min: 300, max: 380 }, protein: { min: 22, max: 30 }, carbs: { min: 20, max: 30 }, fat: { min: 6, max: 10 } } ],
    snackOptions: [ { name: "Fresh fruit", calories: { min: 60, max: 120 } } ],
  },

  {
    id: "dash",
    name: "DASH",
    fullName: "Dietary Approaches to Stop Hypertension (DASH)",
    description: "Diet designed to reduce blood pressure with emphasis on fruits, vegetables, whole grains, and low sodium.",
    icon: "heart-outline",
    difficulty: "Easy",
    principles: { emphasis: ["Fruits", "Vegetables", "Low-fat dairy"], limited: ["Sodium", "Processed foods"] },
    clinicalInfo: { safeFor: ["Hypertension", "General adults"], guidelines: ["AHA", "WHO"], clinicalNotes: ["Proven BP lowering effect"] },
    breakfastOptions: [ { name: "Oatmeal + Fruit", calories: { min: 280, max: 340 }, protein: { min: 6, max: 10 }, carbs: { min: 40, max: 55 }, fat: { min: 6, max: 10 } } ],
    lunchOptions: [ { name: "Lentil Soup + Salad", calories: { min: 350, max: 420 }, protein: { min: 18, max: 26 }, carbs: { min: 40, max: 55 }, fat: { min: 6, max: 12 } } ],
    dinnerOptions: [ { name: "Grilled Chicken + Veggies", calories: { min: 360, max: 440 }, protein: { min: 28, max: 36 }, carbs: { min: 20, max: 30 }, fat: { min: 8, max: 14 } } ],
    snackOptions: [ { name: "Raw Veggies", calories: { min: 30, max: 80 } } ],
  },

  {
    id: "keto",
    name: "Ketogenic",
    fullName: "Ketogenic (Keto) Diet",
    description: "Very low-carb, high-fat diet designed to induce ketosis for metabolic effects.",
    icon: "flame",
    difficulty: "Advanced",
    principles: { emphasis: ["Very low carbs", "High fat", "Moderate protein"], avoids: ["Sugar", "Starches"] },
    clinicalInfo: { safeFor: ["Selected adults"], cautionFor: ["Pregnancy", "Type-1 diabetes"], guidelines: [], clinicalNotes: ["Use with clinical supervision for some conditions"] },
    breakfastOptions: [ 
      { name: "Eggs + Buttered Spinach", calories: { min: 350, max: 450 }, protein: { min: 15, max: 25 }, carbs: { min: 3, max: 8 }, fat: { min: 28, max: 38 } },
      { name: "Bacon + Eggs + Avocado", calories: { min: 380, max: 480 }, protein: { min: 18, max: 28 }, carbs: { min: 4, max: 9 }, fat: { min: 30, max: 42 } },
      { name: "Keto Coffee + Scrambled Eggs", calories: { min: 360, max: 460 }, protein: { min: 16, max: 24 }, carbs: { min: 3, max: 7 }, fat: { min: 32, max: 42 } },
      { name: "Cheese Omelet + Sausage", calories: { min: 370, max: 470 }, protein: { min: 20, max: 30 }, carbs: { min: 4, max: 8 }, fat: { min: 28, max: 38 } },
      { name: "Smoked Salmon + Full-fat Cream Cheese", calories: { min: 340, max: 440 }, protein: { min: 22, max: 32 }, carbs: { min: 3, max: 6 }, fat: { min: 26, max: 36 } },
      { name: "Keto Pancakes (Almond Flour) + Butter", calories: { min: 350, max: 450 }, protein: { min: 14, max: 22 }, carbs: { min: 5, max: 10 }, fat: { min: 30, max: 40 } },
      { name: "Greek Yogurt (Full Fat) + Nuts", calories: { min: 360, max: 460 }, protein: { min: 16, max: 24 }, carbs: { min: 6, max: 12 }, fat: { min: 28, max: 38 } },
    ],
    lunchOptions: [ 
      { name: "Salad + Olive Oil + Protein", calories: { min: 400, max: 520 }, protein: { min: 20, max: 35 }, carbs: { min: 6, max: 12 }, fat: { min: 30, max: 40 } },
      { name: "Bunless Burger + Cheese + Avocado", calories: { min: 420, max: 530 }, protein: { min: 28, max: 38 }, carbs: { min: 5, max: 10 }, fat: { min: 32, max: 44 } },
      { name: "Chicken Wings + Ranch Dressing", calories: { min: 410, max: 520 }, protein: { min: 26, max: 36 }, carbs: { min: 4, max: 8 }, fat: { min: 32, max: 42 } },
      { name: "Tuna Salad + Mayonnaise + Celery", calories: { min: 390, max: 490 }, protein: { min: 28, max: 38 }, carbs: { min: 5, max: 9 }, fat: { min: 28, max: 38 } },
      { name: "Steak Salad + Blue Cheese Dressing", calories: { min: 430, max: 540 }, protein: { min: 32, max: 42 }, carbs: { min: 6, max: 11 }, fat: { min: 32, max: 44 } },
      { name: "Pork Belly + Cauliflower Rice", calories: { min: 440, max: 550 }, protein: { min: 24, max: 34 }, carbs: { min: 7, max: 13 }, fat: { min: 36, max: 48 } },
      { name: "Salmon + Butter + Asparagus", calories: { min: 410, max: 510 }, protein: { min: 30, max: 40 }, carbs: { min: 5, max: 10 }, fat: { min: 30, max: 40 } },
    ],
    dinnerOptions: [ 
      { name: "Grilled Fish + Veggies + Butter", calories: { min: 380, max: 520 }, protein: { min: 22, max: 34 }, carbs: { min: 6, max: 12 }, fat: { min: 26, max: 40 } },
      { name: "Ribeye Steak + Garlic Butter + Greens", calories: { min: 450, max: 560 }, protein: { min: 38, max: 48 }, carbs: { min: 4, max: 9 }, fat: { min: 32, max: 44 } },
      { name: "Roasted Chicken Thighs + Brussels Sprouts", calories: { min: 400, max: 500 }, protein: { min: 32, max: 42 }, carbs: { min: 8, max: 14 }, fat: { min: 28, max: 38 } },
      { name: "Baked Salmon + Cream Sauce + Broccoli", calories: { min: 410, max: 510 }, protein: { min: 34, max: 44 }, carbs: { min: 6, max: 11 }, fat: { min: 30, max: 40 } },
      { name: "Lamb Chops + Mint Butter + Spinach", calories: { min: 430, max: 530 }, protein: { min: 36, max: 46 }, carbs: { min: 5, max: 10 }, fat: { min: 32, max: 42 } },
      { name: "Duck Breast + Green Beans + Ghee", calories: { min: 420, max: 520 }, protein: { min: 34, max: 44 }, carbs: { min: 7, max: 12 }, fat: { min: 30, max: 40 } },
      { name: "Beef Short Ribs + Cauliflower Mash", calories: { min: 440, max: 540 }, protein: { min: 36, max: 46 }, carbs: { min: 8, max: 14 }, fat: { min: 32, max: 42 } },
    ],
    snackOptions: [ 
      { name: "Cheese + Nuts", calories: { min: 150, max: 250 } },
      { name: "Pork rinds", calories: { min: 80, max: 160 } },
      { name: "Avocado halves", calories: { min: 120, max: 200 } },
      { name: "Fat bombs", calories: { min: 100, max: 180 } },
    ],
  },

  {
    id: "paleo",
    name: "Paleo",
    fullName: "Paleolithic (Paleo) Diet",
    description: "Whole-foods-based diet focusing on lean meats, fish, fruits, vegetables, nuts and seeds; avoids processed foods and grains.",
    icon: "nutrition",
    difficulty: "Moderate",
    principles: { emphasis: ["Lean protein", "Vegetables", "Nuts"], avoids: ["Grains", "Legumes", "Processed foods"] },
    clinicalInfo: { safeFor: ["General adults"], guidelines: [], clinicalNotes: ["May improve some metabolic markers in short term"] },
    breakfastOptions: [ { name: "Fruit + Nuts + Eggs", calories: { min: 320, max: 420 }, protein: { min: 12, max: 20 }, carbs: { min: 25, max: 40 }, fat: { min: 14, max: 28 } } ],
    lunchOptions: [ { name: "Grilled Meat + Salad", calories: { min: 420, max: 540 }, protein: { min: 30, max: 45 }, carbs: { min: 15, max: 30 }, fat: { min: 18, max: 32 } } ],
    dinnerOptions: [ { name: "Roast + Veggies", calories: { min: 400, max: 520 }, protein: { min: 28, max: 40 }, carbs: { min: 20, max: 34 }, fat: { min: 16, max: 30 } } ],
    snackOptions: [ { name: "Fresh fruit", calories: { min: 60, max: 120 } } ],
  },

  {
    id: "vegetarian",
    name: "Vegetarian",
    fullName: "Lacto-Ovo Vegetarian",
    description: "Excludes meat and fish; includes eggs and dairy depending on preference; plant-forward.",
    icon: "leaf",
    difficulty: "Easy",
    principles: { emphasis: ["Vegetables", "Legumes", "Whole grains"], avoids: ["Meat", "Fish"] },
    clinicalInfo: { safeFor: ["General adults", "Pregnancy (with planning)"], guidelines: ["WHO"], clinicalNotes: ["Requires attention to B12 and iron in some cases"] },
    breakfastOptions: [ { name: "Oatmeal + Milk + Fruit", calories: { min: 300, max: 380 }, protein: { min: 8, max: 14 }, carbs: { min: 40, max: 55 }, fat: { min: 6, max: 12 } } ],
    lunchOptions: [ { name: "Bean Stew + Rice", calories: { min: 420, max: 540 }, protein: { min: 18, max: 28 }, carbs: { min: 50, max: 70 }, fat: { min: 10, max: 18 } } ],
    dinnerOptions: [ { name: "Tofu Stir-Fry + Veggies", calories: { min: 360, max: 480 }, protein: { min: 18, max: 26 }, carbs: { min: 30, max: 50 }, fat: { min: 12, max: 20 } } ],
    snackOptions: [ { name: "Yogurt", calories: { min: 100, max: 160 } } ],
  },

  {
    id: "vegan",
    name: "Vegan",
    fullName: "Vegan Diet",
    description: "Excludes all animal products; plant-based meals with careful nutrient planning.",
    icon: "leaf-circle",
    difficulty: "Moderate",
    principles: { emphasis: ["Vegetables", "Legumes", "Whole grains"], avoids: ["Animal products"] },
    clinicalInfo: { safeFor: ["Adults"], cautionFor: ["Pregnancy (requires planning)"], guidelines: [], clinicalNotes: ["Watch B12 and iron"] },
    breakfastOptions: [ { name: "Smoothie + Plant Protein", calories: { min: 300, max: 380 }, protein: { min: 10, max: 20 }, carbs: { min: 35, max: 55 }, fat: { min: 8, max: 18 } } ],
    lunchOptions: [ { name: "Chickpea Salad + Quinoa", calories: { min: 380, max: 520 }, protein: { min: 14, max: 24 }, carbs: { min: 40, max: 60 }, fat: { min: 10, max: 18 } } ],
    dinnerOptions: [ { name: "Lentil Curry + Rice", calories: { min: 420, max: 560 }, protein: { min: 18, max: 28 }, carbs: { min: 50, max: 70 }, fat: { min: 10, max: 18 } } ],
    snackOptions: [ { name: "Roasted chickpeas", calories: { min: 120, max: 180 } } ],
  },

  {
    id: "intermittent-fasting",
    name: "Intermittent Fasting",
    fullName: "Intermittent Fasting (time-restricted eating)",
    description: "Eating pattern with defined eating windows (e.g., 16:8); focuses on meal timing rather than specific foods.",
    icon: "time",
    difficulty: "Moderate",
    principles: { emphasis: ["Time-restricted eating"], moderate: ["Balanced meals during eating window"] },
    clinicalInfo: { safeFor: ["Adults"], cautionFor: ["Pregnancy", "Diabetes on medications"], guidelines: [], clinicalNotes: ["Focus on nutrient-dense meals in window"] },
    breakfastOptions: [ { name: "(If eating) Protein-rich meal", calories: { min: 350, max: 500 }, protein: { min: 20, max: 35 }, carbs: { min: 20, max: 60 }, fat: { min: 10, max: 30 } } ],
    lunchOptions: [ { name: "Balanced plate", calories: { min: 400, max: 600 }, protein: { min: 25, max: 40 }, carbs: { min: 30, max: 70 }, fat: { min: 12, max: 30 } } ],
    dinnerOptions: [ { name: "Balanced plate", calories: { min: 400, max: 600 }, protein: { min: 25, max: 40 }, carbs: { min: 30, max: 70 }, fat: { min: 12, max: 30 } } ],
    snackOptions: [ { name: "Nuts or Yogurt", calories: { min: 100, max: 200 } } ],
  },

  {
    id: "flexitarian",
    name: "Flexitarian",
    fullName: "Flexitarian (Semi-Vegetarian)",
    description: "Mostly plant-based but allows occasional meat or fish.",
    icon: "transfer",
    difficulty: "Easy",
    principles: { emphasis: ["Plants"], moderate: ["Occasional meat/fish"] },
    clinicalInfo: { safeFor: ["General adults"], guidelines: [], clinicalNotes: ["Flexible and sustainable for many users"] },
    breakfastOptions: [ { name: "Oat + Fruit", calories: { min: 300, max: 380 }, protein: { min: 8, max: 14 }, carbs: { min: 40, max: 55 }, fat: { min: 6, max: 12 } } ],
    lunchOptions: [ { name: "Veg + Small Fish Portion", calories: { min: 360, max: 480 }, protein: { min: 20, max: 34 }, carbs: { min: 30, max: 50 }, fat: { min: 10, max: 18 } } ],
    dinnerOptions: [ { name: "Plant-forward plate", calories: { min: 350, max: 500 }, protein: { min: 18, max: 32 }, carbs: { min: 30, max: 60 }, fat: { min: 10, max: 22 } } ],
    snackOptions: [ { name: "Fruit", calories: { min: 60, max: 120 } } ],
  },

  {
    id: "gluten-free",
    name: "Gluten-Free",
    fullName: "Gluten-Free Diet",
    description: "Excludes gluten-containing grains; intended for celiac disease or sensitivity.",
    icon: "ban",
    difficulty: "Moderate",
    principles: { avoids: ["Wheat", "Barley", "Rye"], emphasis: ["Naturally gluten-free whole foods"] },
    clinicalInfo: { safeFor: ["Celiac disease", "Gluten sensitivity"], guidelines: [], clinicalNotes: ["Necessary for diagnosed celiac disease"] },
    breakfastOptions: [ { name: "Gluten-free porridge", calories: { min: 280, max: 360 }, protein: { min: 6, max: 12 }, carbs: { min: 35, max: 50 }, fat: { min: 6, max: 12 } } ],
    lunchOptions: [ { name: "Grilled Protein + Veg", calories: { min: 360, max: 480 }, protein: { min: 24, max: 36 }, carbs: { min: 20, max: 40 }, fat: { min: 10, max: 20 } } ],
    dinnerOptions: [ { name: "Rice-based plate + Veg", calories: { min: 380, max: 520 }, protein: { min: 20, max: 34 }, carbs: { min: 40, max: 70 }, fat: { min: 10, max: 18 } } ],
    snackOptions: [ { name: "Fruit or Nuts", calories: { min: 80, max: 180 } } ],
  },

  {
    id: "high-protein",
    name: "High-Protein",
    fullName: "High-Protein Diet",
    description: "Increases protein intake to support muscle mass and satiety; combined with appropriate energy balance.",
    icon: "fitness",
    difficulty: "Moderate",
    principles: { emphasis: ["Protein-rich foods"], moderate: ["Lean carbs"], limited: ["Excessive fats/sugars"] },
    clinicalInfo: { safeFor: ["Active adults"], cautionFor: ["Renal disease"], guidelines: [], clinicalNotes: ["Ensure hydration and monitor renal health if necessary"] },
    breakfastOptions: [ 
      { name: "Eggs + Yogurt", calories: { min: 320, max: 420 }, protein: { min: 25, max: 40 }, carbs: { min: 10, max: 30 }, fat: { min: 12, max: 22 } },
      { name: "Protein Pancakes + Berries", calories: { min: 340, max: 430 }, protein: { min: 28, max: 38 }, carbs: { min: 35, max: 48 }, fat: { min: 8, max: 16 } },
      { name: "Greek Yogurt + Protein Powder + Granola", calories: { min: 350, max: 440 }, protein: { min: 32, max: 42 }, carbs: { min: 30, max: 45 }, fat: { min: 8, max: 14 } },
      { name: "Egg White Omelet + Turkey Sausage", calories: { min: 330, max: 420 }, protein: { min: 30, max: 40 }, carbs: { min: 15, max: 28 }, fat: { min: 10, max: 18 } },
      { name: "Cottage Cheese + Almonds + Fruit", calories: { min: 310, max: 400 }, protein: { min: 26, max: 36 }, carbs: { min: 25, max: 38 }, fat: { min: 10, max: 18 } },
      { name: "Protein Smoothie + Oats", calories: { min: 340, max: 430 }, protein: { min: 30, max: 40 }, carbs: { min: 35, max: 50 }, fat: { min: 8, max: 14 } },
      { name: "Scrambled Eggs + Chicken Breast + Toast", calories: { min: 360, max: 450 }, protein: { min: 35, max: 45 }, carbs: { min: 28, max: 40 }, fat: { min: 10, max: 18 } },
    ],
    lunchOptions: [ 
      { name: "Grilled Chicken + Quinoa", calories: { min: 420, max: 560 }, protein: { min: 30, max: 45 }, carbs: { min: 40, max: 60 }, fat: { min: 10, max: 22 } },
      { name: "Tuna Steak + Brown Rice + Vegetables", calories: { min: 440, max: 550 }, protein: { min: 38, max: 50 }, carbs: { min: 45, max: 62 }, fat: { min: 10, max: 18 } },
      { name: "Beef Stir-fry + Rice Noodles", calories: { min: 450, max: 560 }, protein: { min: 36, max: 48 }, carbs: { min: 42, max: 58 }, fat: { min: 12, max: 22 } },
      { name: "Turkey Breast + Sweet Potato + Greens", calories: { min: 410, max: 520 }, protein: { min: 34, max: 46 }, carbs: { min: 38, max: 54 }, fat: { min: 8, max: 16 } },
      { name: "Salmon + Lentils + Roasted Vegetables", calories: { min: 430, max: 540 }, protein: { min: 36, max: 48 }, carbs: { min: 40, max: 56 }, fat: { min: 14, max: 24 } },
      { name: "Chicken Breast + Couscous + Chickpeas", calories: { min: 440, max: 550 }, protein: { min: 38, max: 50 }, carbs: { min: 48, max: 65 }, fat: { min: 10, max: 18 } },
      { name: "Shrimp + Pasta (Whole Grain) + Marinara", calories: { min: 420, max: 530 }, protein: { min: 32, max: 44 }, carbs: { min: 50, max: 68 }, fat: { min: 8, max: 16 } },
    ],
    dinnerOptions: [ 
      { name: "Fish + Veg + Legumes", calories: { min: 400, max: 540 }, protein: { min: 28, max: 44 }, carbs: { min: 30, max: 50 }, fat: { min: 12, max: 24 } },
      { name: "Grilled Steak + Baked Potato + Broccoli", calories: { min: 450, max: 560 }, protein: { min: 40, max: 52 }, carbs: { min: 35, max: 50 }, fat: { min: 14, max: 24 } },
      { name: "Baked Chicken + Quinoa + Asparagus", calories: { min: 420, max: 520 }, protein: { min: 36, max: 48 }, carbs: { min: 32, max: 46 }, fat: { min: 12, max: 20 } },
      { name: "Pork Tenderloin + Wild Rice + Green Beans", calories: { min: 430, max: 530 }, protein: { min: 38, max: 50 }, carbs: { min: 38, max: 52 }, fat: { min: 12, max: 22 } },
      { name: "Turkey Meatballs + Zoodles + Marinara", calories: { min: 390, max: 490 }, protein: { min: 34, max: 46 }, carbs: { min: 25, max: 38 }, fat: { min: 14, max: 24 } },
      { name: "Bison Burger (With Bun) + Side Salad", calories: { min: 440, max: 540 }, protein: { min: 38, max: 50 }, carbs: { min: 32, max: 46 }, fat: { min: 16, max: 26 } },
      { name: "Cod + Barley + Roasted Carrots", calories: { min: 410, max: 510 }, protein: { min: 32, max: 44 }, carbs: { min: 42, max: 58 }, fat: { min: 10, max: 18 } },
    ],
    snackOptions: [ 
      { name: "Cottage Cheese or Nuts", calories: { min: 100, max: 200 } },
      { name: "Protein bar", calories: { min: 150, max: 220 } },
      { name: "Hard-boiled eggs", calories: { min: 70, max: 140 } },
      { name: "Tuna pouch", calories: { min: 80, max: 150 } },
    ],
  },
];

// Helper functions for querying diets
export const getDietById = (id: string) => {
  return DIET_DATABASE.find((diet) => diet.id === id);
};

export const getDietsByDifficulty = (difficulty: "Easy" | "Moderate" | "Advanced") => {
  return DIET_DATABASE.filter((diet) => diet.difficulty === difficulty);
};

export const getSafeForCondition = (condition: string) => {
  return DIET_DATABASE.filter((diet) => diet.clinicalInfo.safeFor.includes(condition));
};

export const getRandomDiet = () => {
  return DIET_DATABASE[Math.floor(Math.random() * DIET_DATABASE.length)];
};

export const getRandomMealOption = (diet: DietData, mealType: "breakfast" | "lunch" | "dinner" | "snack") => {
  const options = diet[`${mealType}Options`];
  return options[Math.floor(Math.random() * options.length)];
};

export const getNigerianMeals = (diet: DietData) => {
  return {
    breakfast: diet.breakfastOptions.filter((meal: any) => meal.isNigerian),
    lunch: diet.lunchOptions.filter((meal: any) => meal.isNigerian),
    dinner: diet.dinnerOptions.filter((meal: any) => meal.isNigerian),
    snacks: diet.snackOptions.filter((snack: any) => snack.isNigerian),
  };
};

export const getRandomMealPlan = (diet: DietData) => {
  const randomItem = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

  return {
    breakfast: randomItem(diet.breakfastOptions),
    lunch: randomItem(diet.lunchOptions),
    dinner: randomItem(diet.dinnerOptions),
    snack: randomItem(diet.snackOptions),
  };
};

export const calculateDailyTotals = (mealPlan: {
  breakfast: DietMealOption;
  lunch: DietMealOption;
  dinner: DietMealOption;
  snack: DietSnackOption;
}) => {
  const avgCalories = (range: { min: number; max: number }) =>
    Math.round((range.min + range.max) / 2);
  const avgMacro = (range?: { min: number; max: number }) =>
    range ? Math.round((range.min + range.max) / 2) : 0;

  return {
    calories:
      avgCalories(mealPlan.breakfast.calories) +
      avgCalories(mealPlan.lunch.calories) +
      avgCalories(mealPlan.dinner.calories) +
      avgCalories(mealPlan.snack.calories),
    protein:
      avgMacro(mealPlan.breakfast.protein) +
      avgMacro(mealPlan.lunch.protein) +
      avgMacro(mealPlan.dinner.protein),
    carbs:
      avgMacro(mealPlan.breakfast.carbs) +
      avgMacro(mealPlan.lunch.carbs) +
      avgMacro(mealPlan.dinner.carbs),
    fat:
      avgMacro(mealPlan.breakfast.fat) +
      avgMacro(mealPlan.lunch.fat) +
      avgMacro(mealPlan.dinner.fat),
  };
};

export default DIET_DATABASE;
