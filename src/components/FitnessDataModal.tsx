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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export interface UserFitnessData {
  // User Profile
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bodyFat?: number;
  fitnessLevel: string;

  // Goals
  primaryGoal: string;
  additionalGoals: string[];

  // Workout Preferences
  workoutLocation: string;
  availableEquipment: string[];
  workoutDays: number;
  timePerSession: number;
  injuries: string;

  // Diet Preferences
  dietaryStyle: string;
  allergies: string;
  dietaryRestrictions: string;
  culturalPreference: string;
  mealsPerDay: number;
  calorieTarget?: number;
}

interface FitnessDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UserFitnessData) => Promise<void>;
  userName?: string;
}

export default function FitnessDataModal({
  open,
  onOpenChange,
  onSubmit,
  userName,
}: FitnessDataModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<UserFitnessData>({
    name: userName || "",
    age: 0,
    gender: "",
    height: 0,
    weight: 0,
    bodyFat: undefined,
    fitnessLevel: "",
    primaryGoal: "",
    additionalGoals: [],
    workoutLocation: "",
    availableEquipment: [],
    workoutDays: 3,
    timePerSession: 60,
    injuries: "",
    dietaryStyle: "",
    allergies: "",
    dietaryRestrictions: "",
    culturalPreference: "",
    mealsPerDay: 3,
    calorieTarget: undefined,
  });

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name || formData.name.trim().length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }
      if (!formData.age || formData.age < 13 || formData.age > 100) {
        newErrors.age = "Age must be between 13 and 100";
      }
      if (!formData.gender) {
        newErrors.gender = "Gender is required";
      }
      if (!formData.height || formData.height < 100 || formData.height > 250) {
        newErrors.height = "Height must be between 100 and 250 cm";
      }
      if (!formData.weight || formData.weight < 30 || formData.weight > 300) {
        newErrors.weight = "Weight must be between 30 and 300 kg";
      }
      if (!formData.fitnessLevel) {
        newErrors.fitnessLevel = "Fitness level is required";
      }
    }

    if (currentStep === 2) {
      if (!formData.primaryGoal) {
        newErrors.primaryGoal = "Primary goal is required";
      }
    }

    if (currentStep === 3) {
      if (!formData.workoutLocation) {
        newErrors.workoutLocation = "Workout location is required";
      }
      if (formData.workoutDays < 1 || formData.workoutDays > 7) {
        newErrors.workoutDays = "Workout days must be between 1 and 7";
      }
      if (formData.timePerSession < 15 || formData.timePerSession > 180) {
        newErrors.timePerSession =
          "Time per session must be between 15 and 180 minutes";
      }
    }

    if (currentStep === 4) {
      if (!formData.dietaryStyle) {
        newErrors.dietaryStyle = "Dietary style is required";
      }
      if (!formData.culturalPreference) {
        newErrors.culturalPreference = "Cultural preference is required";
      }
      if (formData.mealsPerDay < 1 || formData.mealsPerDay > 8) {
        newErrors.mealsPerDay = "Meals per day must be between 1 and 8";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
      // Reset form
      setStep(1);
      setFormData({
        age: 0,
        gender: "",
        height: 0,
        weight: 0,
        bodyFat: undefined,
        fitnessLevel: "",
        primaryGoal: "",
        additionalGoals: [],
        workoutLocation: "",
        availableEquipment: [],
        workoutDays: 3,
        timePerSession: 60,
        injuries: "",
        dietaryStyle: "",
        allergies: "",
        culturalPreference: "",
        mealsPerDay: 3,
        calorieTarget: undefined,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof UserFitnessData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleArrayItem = (field: keyof UserFitnessData, value: string) => {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(value)) {
      updateFormData(
        field,
        currentArray.filter((item) => item !== value)
      );
    } else {
      updateFormData(field, [...currentArray, value]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Build Your{" "}
            <span className="text-primary">Personalized Program</span>
          </DialogTitle>
          <DialogDescription>
            Step {step} of 4: {step === 1 && "Personal Information"}
            {step === 2 && "Fitness Goals"}
            {step === 3 && "Workout Preferences"}
            {step === 4 && "Diet Preferences"}
          </DialogDescription>
          {/* Progress Bar */}
          <div className="w-full bg-border rounded-full h-2 mt-4">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* STEP 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={formData.age || ""}
                    onChange={(e) =>
                      updateFormData("age", parseInt(e.target.value) || 0)
                    }
                    className={errors.age ? "border-red-500" : ""}
                  />
                  {errors.age && (
                    <p className="text-xs text-red-500">{errors.age}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => updateFormData("gender", value)}
                  >
                    <SelectTrigger
                      className={errors.gender ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-xs text-red-500">{errors.gender}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm) *</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={formData.height || ""}
                    onChange={(e) =>
                      updateFormData("height", parseInt(e.target.value) || 0)
                    }
                    className={errors.height ? "border-red-500" : ""}
                  />
                  {errors.height && (
                    <p className="text-xs text-red-500">{errors.height}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={formData.weight || ""}
                    onChange={(e) =>
                      updateFormData("weight", parseInt(e.target.value) || 0)
                    }
                    className={errors.weight ? "border-red-500" : ""}
                  />
                  {errors.weight && (
                    <p className="text-xs text-red-500">{errors.weight}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyFat">Body Fat % (Optional)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  placeholder="20"
                  value={formData.bodyFat || ""}
                  onChange={(e) =>
                    updateFormData(
                      "bodyFat",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fitnessLevel">Fitness Level *</Label>
                <Select
                  value={formData.fitnessLevel}
                  onValueChange={(value) =>
                    updateFormData("fitnessLevel", value)
                  }
                >
                  <SelectTrigger
                    className={errors.fitnessLevel ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select fitness level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                {errors.fitnessLevel && (
                  <p className="text-xs text-red-500">{errors.fitnessLevel}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Fitness Goals */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primaryGoal">Primary Goal *</Label>
                <Select
                  value={formData.primaryGoal}
                  onValueChange={(value) =>
                    updateFormData("primaryGoal", value)
                  }
                >
                  <SelectTrigger
                    className={errors.primaryGoal ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="fat_loss">Fat Loss</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                    <SelectItem value="general_fitness">
                      General Fitness
                    </SelectItem>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
                    <SelectItem value="athletic_performance">
                      Athletic Performance
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.primaryGoal && (
                  <p className="text-xs text-red-500">{errors.primaryGoal}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Additional Goals (Optional)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Build Muscle",
                    "Lose Weight",
                    "Increase Flexibility",
                    "Improve Cardio",
                    "Gain Strength",
                    "Better Posture",
                  ].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() =>
                        toggleArrayItem(
                          "additionalGoals",
                          goal.toLowerCase().replace(" ", "_")
                        )
                      }
                      className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                        formData.additionalGoals.includes(
                          goal.toLowerCase().replace(" ", "_")
                        )
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:border-primary"
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Workout Preferences */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workoutLocation">Workout Location *</Label>
                <Select
                  value={formData.workoutLocation}
                  onValueChange={(value) =>
                    updateFormData("workoutLocation", value)
                  }
                >
                  <SelectTrigger
                    className={errors.workoutLocation ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="gym">Gym</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
                {errors.workoutLocation && (
                  <p className="text-xs text-red-500">
                    {errors.workoutLocation}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Available Equipment</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Dumbbells",
                    "Barbell",
                    "Resistance Bands",
                    "Pull-up Bar",
                    "Treadmill",
                    "Bike",
                    "Kettlebell",
                    "None",
                  ].map((equipment) => (
                    <button
                      key={equipment}
                      type="button"
                      onClick={() =>
                        toggleArrayItem(
                          "availableEquipment",
                          equipment.toLowerCase().replace(" ", "_")
                        )
                      }
                      className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                        formData.availableEquipment.includes(
                          equipment.toLowerCase().replace(" ", "_")
                        )
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:border-primary"
                      }`}
                    >
                      {equipment}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workoutDays">Workout Days per Week *</Label>
                  <Input
                    id="workoutDays"
                    type="number"
                    min="1"
                    max="7"
                    value={formData.workoutDays}
                    onChange={(e) =>
                      updateFormData(
                        "workoutDays",
                        parseInt(e.target.value) || 3
                      )
                    }
                    className={errors.workoutDays ? "border-red-500" : ""}
                  />
                  {errors.workoutDays && (
                    <p className="text-xs text-red-500">{errors.workoutDays}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timePerSession">
                    Time per Session (min) *
                  </Label>
                  <Input
                    id="timePerSession"
                    type="number"
                    min="15"
                    max="180"
                    value={formData.timePerSession}
                    onChange={(e) =>
                      updateFormData(
                        "timePerSession",
                        parseInt(e.target.value) || 60
                      )
                    }
                    className={errors.timePerSession ? "border-red-500" : ""}
                  />
                  {errors.timePerSession && (
                    <p className="text-xs text-red-500">
                      {errors.timePerSession}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="injuries">Injuries or Limitations</Label>
                <Textarea
                  id="injuries"
                  placeholder="e.g., Lower back pain, knee injury..."
                  value={formData.injuries}
                  onChange={(e) => updateFormData("injuries", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* STEP 4: Diet Preferences */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dietaryStyle">Dietary Style *</Label>
                <Select
                  value={formData.dietaryStyle}
                  onValueChange={(value) =>
                    updateFormData("dietaryStyle", value)
                  }
                >
                  <SelectTrigger
                    className={errors.dietaryStyle ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select dietary style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="omnivore">Omnivore</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="pescatarian">Pescatarian</SelectItem>
                    <SelectItem value="keto">Keto</SelectItem>
                    <SelectItem value="paleo">Paleo</SelectItem>
                    <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  </SelectContent>
                </Select>
                {errors.dietaryStyle && (
                  <p className="text-xs text-red-500">{errors.dietaryStyle}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  placeholder="e.g., Nuts, shellfish, pollen..."
                  value={formData.allergies}
                  onChange={(e) => updateFormData("allergies", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietaryRestrictions">
                  Dietary Restrictions
                </Label>
                <Textarea
                  id="dietaryRestrictions"
                  placeholder="e.g., No dairy, gluten-free, halal..."
                  value={formData.dietaryRestrictions}
                  onChange={(e) =>
                    updateFormData("dietaryRestrictions", e.target.value)
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="culturalPreference">
                  Cultural Food Preference *
                </Label>
                <Select
                  value={formData.culturalPreference}
                  onValueChange={(value) =>
                    updateFormData("culturalPreference", value)
                  }
                >
                  <SelectTrigger
                    className={
                      errors.culturalPreference ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="african">African</SelectItem>
                    <SelectItem value="western">Western</SelectItem>
                    <SelectItem value="asian">Asian</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                    <SelectItem value="no_preference">No Preference</SelectItem>
                  </SelectContent>
                </Select>
                {errors.culturalPreference && (
                  <p className="text-xs text-red-500">
                    {errors.culturalPreference}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mealsPerDay">Meals per Day *</Label>
                  <Input
                    id="mealsPerDay"
                    type="number"
                    min="1"
                    max="8"
                    value={formData.mealsPerDay}
                    onChange={(e) =>
                      updateFormData(
                        "mealsPerDay",
                        parseInt(e.target.value) || 3
                      )
                    }
                    className={errors.mealsPerDay ? "border-red-500" : ""}
                  />
                  {errors.mealsPerDay && (
                    <p className="text-xs text-red-500">{errors.mealsPerDay}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calorieTarget">
                    Calorie Target (Optional)
                  </Label>
                  <Input
                    id="calorieTarget"
                    type="number"
                    placeholder="Auto-calculated"
                    value={formData.calorieTarget || ""}
                    onChange={(e) =>
                      updateFormData(
                        "calorieTarget",
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1 || isSubmitting}
          >
            Previous
          </Button>

          {step < 4 ? (
            <Button type="button" onClick={handleNext} disabled={isSubmitting}>
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Program"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
