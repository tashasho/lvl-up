import React, { useState } from 'react';
import { Exercise, WorkoutSet } from '../types';
import { Button } from './Button';

// Specific Routines based on user request
const ROUTINES = {
  PULL: [
    { id: 'pull1', name: 'Lat Pulldowns', category: 'Pull', defaultSets: 4, defaultReps: '12,10,8,8' },
    { id: 'pull2', name: 'Upper Trap Shrugs', category: 'Pull', defaultSets: 3, defaultReps: '10,10,10' },
    { id: 'pull3', name: 'Hammer Curl', category: 'Pull', defaultSets: 3, defaultReps: '10,10,10' },
    { id: 'pull4', name: 'T-Bar Pulls', category: 'Pull', defaultSets: 3, defaultReps: '10,10,8' },
    { id: 'pull5', name: 'Barbell Curls', category: 'Pull', defaultSets: 3, defaultReps: '10,10,8' },
    { id: 'pull6', name: 'Lower Back Extensions', category: 'Pull', defaultSets: 4, defaultReps: '12,10,10,8' },
    { id: 'pull7', name: 'Core (Situps/Sweeps/Leg Raises)', category: 'Core', defaultSets: 1, defaultReps: 'Circuit' },
    { id: 'pull8', name: '15m Treadmill Walk', category: 'Cardio', defaultSets: 1, defaultReps: '15 mins' },
  ],
  PUSH: [
    { id: 'push1', name: 'Dumbbell Lateral Raises', category: 'Push', defaultSets: 3, defaultReps: '10,10,10' },
    { id: 'push2', name: 'Inclined Machine Chest Press', category: 'Push', defaultSets: 4, defaultReps: '12,10,10,8' },
    { id: 'push3', name: 'Barbell Overhead Press', category: 'Push', defaultSets: 3, defaultReps: '10,10,8' },
    { id: 'push4', name: 'Cable Pushdown', category: 'Push', defaultSets: 3, defaultReps: '12,12,12' },
    { id: 'push5', name: 'Isolate Chest Press', category: 'Push', defaultSets: 3, defaultReps: '10,10,10' },
    { id: 'push6', name: 'Tricep Pushdown', category: 'Push', defaultSets: 3, defaultReps: '12,10,8' },
    { id: 'push7', name: 'Chest Machine Fly', category: 'Push', defaultSets: 4, defaultReps: '12,10,10,8' },
    { id: 'push8', name: '15m Treadmill Walk', category: 'Cardio', defaultSets: 1, defaultReps: '15 mins' },
  ],
  LEGS: [
    { id: 'legs1', name: 'Barbell Squats', category: 'Legs', defaultSets: 4, defaultReps: '12,10,8,6' },
    { id: 'legs2', name: 'Leg Extension', category: 'Legs', defaultSets: 4, defaultReps: '10,10,10,10' },
    { id: 'legs3', name: 'Leg Curls', category: 'Legs', defaultSets: 4, defaultReps: '10,10,10,10' },
    { id: 'legs4', name: 'Machine Adductors', category: 'Legs', defaultSets: 3, defaultReps: '10,10,10' },
    { id: 'legs5', name: 'Bulgarian Split Squats', category: 'Legs', defaultSets: 3, defaultReps: '10,10,8' },
    { id: 'legs6', name: 'Standing Calf Raises', category: 'Legs', defaultSets: 4, defaultReps: '12,10,10,8' },
    { id: 'legs7', name: 'Core (Situps/Sweeps/Leg Raises)', category: 'Core', defaultSets: 1, defaultReps: 'Circuit' },
  ]
};

export const WorkoutLogger: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'PUSH' | 'PULL' | 'LEGS' | null>(null);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [sets, setSets] = useState<WorkoutSet[]>([]);

  const startExercise = (ex: Exercise) => {
    setActiveExercise(ex);
    // Parse default reps "12,10,8" into initial sets
    const repSchemes = ex.defaultReps.includes(',') ? ex.defaultReps.split(',').map(Number) : Array(ex.defaultSets).fill(10);
    
    const initialSets: WorkoutSet[] = Array.from({ length: ex.defaultSets }).map((_, i) => ({
      id: Math.random().toString(),
      reps: isNaN(repSchemes[i]) ? 0 : repSchemes[i], // Handle "Circuit" or "15 mins" gracefully
      weightKg: 0,
      completed: false
    }));
    setSets(initialSets);
  };

  const toggleSetComplete = (id: string) => {
    setSets(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const updateSet = (id: string, field: 'reps' | 'weightKg', value: number) => {
    setSets(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  if (activeExercise) {
    return (
      <div className="flex flex-col h-full bg-zinc-950 p-6 animate-slide-up pb-24">
        <button onClick={() => setActiveExercise(null)} className="mb-4 text-zinc-400 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Plan
        </button>
        
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">{activeExercise.name}</h2>
            <div className="flex gap-2 mb-4">
                <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                    {activeExercise.category}
                </span>
                <span className="px-2 py-1 rounded bg-zinc-800 text-lime-400 text-xs font-semibold uppercase tracking-wider">
                    Target: {activeExercise.defaultReps}
                </span>
            </div>
        </div>

        <div className="space-y-3">
            <div className="flex text-zinc-500 text-xs uppercase font-semibold tracking-wider px-2">
                <span className="w-12 text-center">Set</span>
                <span className="flex-1 text-center">kg</span>
                <span className="flex-1 text-center">Reps</span>
                <span className="w-10"></span>
            </div>
            {sets.map((set, idx) => (
                <div key={set.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${set.completed ? 'bg-lime-900/20 border-lime-500/30' : 'bg-zinc-900 border-zinc-800'}`}>
                    <span className="w-12 text-center font-mono text-zinc-500">{idx + 1}</span>
                    <input 
                        type="number" 
                        value={set.weightKg}
                        onChange={(e) => updateSet(set.id, 'weightKg', Number(e.target.value))}
                        className="flex-1 bg-zinc-950 border border-zinc-700 rounded text-center py-2 text-white font-mono"
                    />
                    <input 
                        type="number" 
                        value={set.reps}
                        onChange={(e) => updateSet(set.id, 'reps', Number(e.target.value))}
                        className="flex-1 bg-zinc-950 border border-zinc-700 rounded text-center py-2 text-white font-mono"
                    />
                    <button 
                        onClick={() => toggleSetComplete(set.id)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${set.completed ? 'bg-lime-500 text-black' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'}`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </button>
                </div>
            ))}
        </div>

        <Button className="mt-8" onClick={() => setActiveExercise(null)}>Finish Exercise</Button>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 animate-fade-in">
      {!selectedPlan ? (
        <>
            <h2 className="text-2xl font-bold text-white mb-6">Select Routine</h2>
            <div className="grid gap-4">
                {(['PUSH', 'PULL', 'LEGS'] as const).map(plan => (
                    <button 
                        key={plan}
                        onClick={() => setSelectedPlan(plan)}
                        className="h-32 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-lime-500/50 transition-all flex flex-col items-center justify-center gap-2 group"
                    >
                        <span className="text-3xl font-black text-white tracking-widest group-hover:text-lime-400 transition-colors">{plan}</span>
                        <span className="text-xs text-zinc-500 uppercase tracking-widest">System</span>
                    </button>
                ))}
            </div>
        </>
      ) : (
        <>
            <button onClick={() => setSelectedPlan(null)} className="mb-6 text-zinc-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Change Routine
            </button>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedPlan} Day</h2>
                <span className="text-xs font-mono text-zinc-500">{ROUTINES[selectedPlan].length} Exercises</span>
            </div>
            
            <div className="space-y-3">
                {ROUTINES[selectedPlan].map((ex) => (
                    <button 
                        key={ex.id} 
                        onClick={() => startExercise(ex)}
                        className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-left hover:bg-zinc-800 transition-colors flex justify-between items-center group"
                    >
                        <div>
                            <div className="font-semibold text-zinc-200 group-hover:text-white">{ex.name}</div>
                            <div className="text-xs text-zinc-500 mt-1 flex gap-2">
                                <span>{ex.defaultSets} Sets</span>
                                <span className="text-zinc-700">•</span>
                                <span>Reps: {ex.defaultReps}</span>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 group-hover:border-lime-500 group-hover:text-lime-500">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </div>
                    </button>
                ))}
            </div>
        </>
      )}
    </div>
  );
};