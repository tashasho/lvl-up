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

  // Simulate persistence for demo
  useEffect(() => {
    const savedUser = localStorage.getItem('lvlup_user');
    const savedWeight = localStorage.getItem('lvlup_weight');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedWeight) {
        setWeightLogs(JSON.parse(savedWeight));
    } else {
        // Initial dummy data for the chart to look good immediately
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
    // Initialize streak to 0 or 1 for new users
    const profileWithStreak = { ...profile, streakDays: 1 };
    setUser(profileWithStreak);
    localStorage.setItem('lvlup_user', JSON.stringify(profileWithStreak));
    
    // Set initial weight log
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
    
    // Keep only last 30 days for chart clarity in this MVP
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
      
      {/* Hide nav on camera screen to maximize view */}
      {activeTab !== 'food' && (
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
};

export default App;