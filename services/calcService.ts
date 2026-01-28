import { Gender, Goal, UserProfile } from '../types';

export const calculateTDEE = (
  weight: number,
  height: number,
  age: number,
  gender: Gender
): number => {
  // Mifflin-St Jeor Equation
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (gender === Gender.MALE) {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  // Activity Multiplier (Assuming Moderate Activity for fitness app users)
  const activityMultiplier = 1.375; 
  return Math.round(bmr * activityMultiplier);
};

export const calculateTargets = (tdee: number, goal: Goal): { kcal: number; protein: number } => {
  let targetKcal = tdee;
  let proteinMultiplier = 1.8; // g per kg of bodyweight (approximated)

  switch (goal) {
    case Goal.AGGRESSIVE_CUT:
      targetKcal = tdee - 500;
      proteinMultiplier = 2.2; // Higher protein to spare muscle in steep deficit
      break;
    case Goal.HEALTHY_CUT:
      targetKcal = tdee - 300; // Sustainable deficit
      proteinMultiplier = 2.0;
      break;
    case Goal.BULK:
      targetKcal = tdee + 300;
      proteinMultiplier = 2.0;
      break;
    case Goal.MAINTAIN:
    default:
      targetKcal = tdee;
      proteinMultiplier = 1.8;
      break;
  }

  // Calculate protein grams based on the multiplier logic roughly converted to kcal percentage for this simplified model
  // In a pro app, we'd use weight * proteinMultiplier directly. 
  // Here we ensure protein is significant portion of the diet (approx 30% of kcal for simplicity in this demo structure)
  const targetProtein = Math.round((targetKcal * 0.3) / 4); 

  return {
    kcal: Math.round(targetKcal),
    protein: targetProtein
  };
};