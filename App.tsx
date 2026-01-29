import React, { useState, useEffect } from 'react';
import { UserProfile, FoodLogEntry, FoodItem, WeightLog } from './types';
import { Onboarding } from './components/Onboarding';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { FoodLogger } from './components/FoodLogger';
import { WorkoutLogger } from './components/WorkoutLogger';
import { ProgressGallery } from './components/ProgressGallery';
import { NotificationManager } from './components/NotificationManager';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [foodLogs, setFoodLogs] = useState<FoodLogEntry[]>([]);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);

  // Simulation: Burnt calories increase randomly to mimic Google Fit data
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      setUser(prev => {
        if (!prev) return null;
        // Increment burn by 1-3 calories per minute to simulate movement
        const newBurn = prev.currentBurn + (Math.random() * 2);
        
        // Calculate HP: 100 max. Weighted by how close we are to goals.
        // Simplified: +HP if targets met, -HP if over consumed or sedentary.
        const proteinRatio = (foodLogs.reduce((acc, log) => acc + log.items.reduce((s, i) => s + i.proteinG, 0), 0) / prev.targetProtein);
        const burnRatio = (newBurn / prev.targetBurn);
        const hp = Math.min(100, Math.round((proteinRatio * 30) + (burnRatio * 40) + 30));

        return {
          ...prev,
          currentBurn: newBurn,
          hp
        };
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [user, foodLogs]);

  useEffect(() => {
    const savedUser = localStorage.getItem('lvlup_user');
    const savedWeight = localStorage.getItem('lvlup_weight');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedWeight) {
        setWeightLogs(JSON.parse(savedWeight));
    } else {
        const dummyData = [
            { id: '1', date: '2023-10-20', weightKg: 72.5 },
            { id: '2', date: '2023-10-21', weightKg: 72.3 },
            { id: '3', date: '2023-10-22', weightKg: 72.0 },
            { id: '4', date: '2023-10-23', weightKg: 71.8 },
            { id: '5', date: '2023-10-24', weightKg: 71.9 },
        ];
        setWeightLogs(dummyData);
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    const profileWithGoals = { 
        ...profile, 
        streakDays: 1, 
        targetBurn: 400, // Default burn target
        currentBurn: 50, // Initial burn
        hp: 80 // Initial HP
    };
    setUser(profileWithGoals);
    localStorage.setItem('lvlup_user', JSON.stringify(profileWithGoals));
    
    const initialLog: WeightLog = {
        id: 'init',
        date: new Date().toISOString().split('T')[0],
        weightKg: profile.weightKg
    };
    setWeightLogs([initialLog]);
    localStorage.setItem('lvlup_weight', JSON.stringify([initialLog]));
  };

  const handleFoodLog = (items: FoodItem[], mealType: string) => {
    const newLog: FoodLogEntry = {
      id: Math.random().toString(),
      timestamp: Date.now(),
      mealType: mealType as any,
      items
    };
    setFoodLogs(prev => [...prev, newLog]);
    setActiveTab('dashboard');
  };

  const handleWeightLog = (weight: number) => {
    const newLog: WeightLog = {
        id: Math.random().toString(),
        date: new Date().toISOString().split('T')[0],
        weightKg: weight
    };
    const updatedLogs = [...weightLogs, newLog].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (updatedLogs.length > 30) updatedLogs.shift();
    setWeightLogs(updatedLogs);
    localStorage.setItem('lvlup_weight', JSON.stringify(updatedLogs));
  };

  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans mx-auto max-w-md shadow-2xl overflow-hidden relative">
      <NotificationManager />
      
      <main className="h-full overflow-y-auto">
        {activeTab === 'dashboard' && (
            <Dashboard 
                user={user} 
                foodLogs={foodLogs} 
                weightLogs={weightLogs} 
                onLogWeight={handleWeightLog}
            />
        )}
        {activeTab === 'food' && <FoodLogger onLog={handleFoodLog} onCancel={() => setActiveTab('dashboard')} />}
        {activeTab === 'workout' && <WorkoutLogger />}
        {activeTab === 'progress' && <ProgressGallery />}
      </main>
      
      {activeTab !== 'food' && (
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
};

export default App;