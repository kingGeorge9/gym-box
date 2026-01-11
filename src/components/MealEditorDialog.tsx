"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface MealEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealPlanId: Id<"mealPlan">;
  planId: Id<"plans">;
  mealType: "breakfast" | "lunch" | "dinner";
  currentMealName: string;
}

export default function MealEditorDialog({
  open,
  onOpenChange,
  mealPlanId,
  planId,
  mealType,
  currentMealName,
}: MealEditorDialogProps) {
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const mealAlternatives = useQuery(api.planManagement.getMealAlternatives, {
    planId,
    mealType,
  });

  const updateMeal = useMutation(api.planManagement.updateMeal);

  const handleSelectMeal = async (meal: any) => {
    try {
      await updateMeal({
        mealPlanId,
        mealType,
        newMeal: {
          mealName: meal.name,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          source: "User Selected",
        },
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update meal:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Change <span className="text-primary capitalize">{mealType}</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select a different meal from your diet plan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {mealAlternatives && mealAlternatives.length > 0 ? (
            mealAlternatives.map((meal, index) => {
              const isSelected = meal.name === currentMealName;
              const avgCalories = Math.round(
                (meal.calories.min + meal.calories.max) / 2
              );

              return (
                <div
                  key={index}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                  }`}
                  onClick={() => !isSelected && handleSelectMeal(meal)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {meal.name}
                        </h3>
                        {isSelected && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-primary/20 text-primary text-xs">
                            <CheckIcon className="h-3 w-3" />
                            Current
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="font-mono">
                          {meal.calories.min}-{meal.calories.max} kcal
                        </span>
                        {meal.protein && (
                          <span>
                            Protein: {meal.protein.min}-{meal.protein.max}g
                          </span>
                        )}
                        {meal.carbs && (
                          <span>
                            Carbs: {meal.carbs.min}-{meal.carbs.max}g
                          </span>
                        )}
                        {meal.fat && (
                          <span>
                            Fat: {meal.fat.min}-{meal.fat.max}g
                          </span>
                        )}
                      </div>
                    </div>

                    {!isSelected && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-primary hover:text-primary hover:bg-primary/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectMeal(meal);
                        }}
                      >
                        Select
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No alternative meals available
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
