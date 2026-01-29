
import React, { useState } from 'react';
import { UserProfile, Gender, Goal } from '../types';
import { calculateTDEE, calculateTargets } from '../services/calcService';
import { Button } from './Button';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: 25,
    gender: Gender.MALE,
    height: 175,
    weight: 70,
    goal: Goal.MAINTAIN
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    const tdee = calculateTDEE(Number(formData.weight), Number(formData.height), Number(formData.age), formData.gender);
    const { kcal, protein } = calculateTargets(tdee, formData.goal);

    // Fixed: Added missing properties required by UserProfile interface (targetBurn, currentBurn, hp)
    const profile: UserProfile = {
      age: Number(formData.age),
      gender: formData.gender,
      heightCm: Number(formData.height),
      weightKg: Number(formData.weight),
      goal: formData.goal,
      tdee,
      targetKcal: kcal,
      targetProtein: protein,
      targetBurn: 400, // Initial default target
      currentBurn: 0,
      hp: 100,
      onboarded: true,
      streakDays: 0 // Will be set to 1 in App.tsx handleOnboardingComplete
    };
    onComplete(profile);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-zinc-950 text-white max-w-md mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-lime-400">lvlup</h1>
        <p className="text-zinc-400">Systematize your biology.</p>
      </div>

      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl">
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold">Basics</h2>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Gender</label>
              <div className="flex gap-2">
                {[Gender.MALE, Gender.FEMALE].map((g) => (
                  <button
                    key={g}
                    onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                    className={`flex-1 py-3 rounded-lg border ${formData.gender === g ? 'border-lime-400 bg-lime-400/10 text-lime-400' : 'border-zinc-700 bg-zinc-800 text-zinc-400'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-lime-400" />
            </div>
            <Button onClick={handleNext} fullWidth>Next</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold">Body Metrics</h2>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Height (cm)</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-lime-400" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Weight (kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-lime-400" />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleBack} variant="secondary" className="flex-1">Back</Button>
              <Button onClick={handleNext} className="flex-1">Next</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold">Mission</h2>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Current Goal</label>
              <div className="space-y-2">
                {Object.values(Goal).map((g) => (
                  <button
                    key={g}
                    onClick={() => setFormData(prev => ({ ...prev, goal: g }))}
                    className={`w-full text-left p-3 rounded-lg border ${formData.goal === g ? 'border-lime-400 bg-lime-400/10 text-lime-400' : 'border-zinc-700 bg-zinc-800 text-zinc-400'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
             <div className="flex gap-2 pt-4">
              <Button onClick={handleBack} variant="secondary" className="flex-1">Back</Button>
              <Button onClick={handleSubmit} className="flex-1">Calculate Plan</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
