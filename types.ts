export enum Goal {
  AGGRESSIVE_CUT = 'Aggressive Cut',
  HEALTHY_CUT = 'Healthy Cut',
  MAINTAIN = 'Muscle Maintenance',
  BULK = 'Lean Bulk'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female'
}

export interface UserProfile {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  goal: Goal;
  tdee: number;
  targetKcal: number;
  targetProtein: number;
  targetBurn: number; // Daily burnt calorie target
  currentBurn: number; // Simulated Google Fit burn
  hp: number; // Health Points (0-100)
  onboarded: boolean;
  streakDays: number;
}

export interface WeightLog {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
}

export interface FoodItem {
  id: string;
  name: string;
  weightG: number;
  calories: number;
  proteinG: number;
}

export interface FoodLogEntry {
  id: string;
  timestamp: number;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Misc';
  items: FoodItem[];
  imageUri?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  defaultSets: number;
  defaultReps: string;
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weightKg: number;
  completed: boolean;
}

export interface WorkoutLog {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
  date: string;
}

export interface ProgressPhoto {
  id: string;
  date: string;
  uri: string;
}

export interface PlaceRecommendation {
  name: string;
  uri: string;
  description: string;
}