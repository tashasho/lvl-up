import React, { useState, useRef } from 'react';
import { FoodItem, FoodLogEntry } from '../types';
import { analyzeFoodImage } from '../services/geminiService';
import { Button } from './Button';

interface FoodLoggerProps {
  onLog: (items: FoodItem[], mealType: string) => void;
  onCancel: () => void;
}

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Misc'];

export const FoodLogger: React.FC<FoodLoggerProps> = ({ onLog, onCancel }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedItems, setDetectedItems] = useState<FoodItem[]>([]);
  const [mealType, setMealType] = useState('Breakfast');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix for API
        const base64Data = base64String.split(',')[1];
        setImage(base64String);
        analyzeImage(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64Data: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeFoodImage(base64Data);
      const itemsWithIds = result.items.map((item: any) => ({
        ...item,
        id: Math.random().toString(36).substr(2, 9)
      }));
      setDetectedItems(itemsWithIds);
    } catch (error) {
      alert("Failed to analyze food. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateItemWeight = (id: string, newWeight: number) => {
    setDetectedItems(prev => prev.map(item => {
      if (item.id === id) {
        // Simple linear scaling of macros based on weight change
        const ratio = newWeight / item.weightG;
        return {
          ...item,
          weightG: newWeight,
          calories: Math.round(item.calories * ratio),
          proteinG: Math.round(item.proteinG * ratio)
        };
      }
      return item;
    }));
  };

  const handleSave = () => {
    onLog(detectedItems, mealType);
  };

  if (!image) {
    return (
      <div className="flex flex-col h-full p-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-6">Log Meal</h2>
        
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-2xl bg-zinc-900/50 p-8 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Snap & Analyze</h3>
            <p className="text-sm text-zinc-400 mt-1">AI identifies food, estimates macros.</p>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button onClick={() => fileInputRef.current?.click()}>
            Take Photo
          </Button>
          <button onClick={onCancel} className="text-zinc-500 text-sm hover:text-white">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 animate-fade-in pb-20">
      <div className="relative h-64 bg-black">
        <img src={image} alt="Food" className="w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
        <button 
            onClick={() => setImage(null)}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="px-6 -mt-8 relative z-10">
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl">
          {isAnalyzing ? (
            <div className="flex flex-col items-center py-8">
              <div className="w-12 h-12 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lime-400 animate-pulse">Analyzing molecular structure...</p>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Review</h3>
                    <select 
                        value={mealType} 
                        onChange={(e) => setMealType(e.target.value)}
                        className="bg-zinc-800 text-zinc-200 text-sm rounded-lg px-2 py-1 border border-zinc-700 outline-none"
                    >
                        {MEAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
               </div>

              {detectedItems.length === 0 ? (
                <div className="text-center text-zinc-500 py-4">No food detected. Try manually logging.</div>
              ) : (
                <div className="space-y-4">
                  {detectedItems.map((item) => (
                    <div key={item.id} className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <div className="text-xs text-zinc-400 flex gap-3 mt-1">
                             <span className="text-lime-400">{item.calories} kcal</span>
                             <span className="text-blue-400">{item.proteinG}g pro</span>
                          </div>
                        </div>
                        <span className="text-sm font-mono text-zinc-300">{item.weightG}g</span>
                      </div>
                      
                      <input 
                        type="range" 
                        min="10" 
                        max="1000" 
                        step="10"
                        value={item.weightG}
                        onChange={(e) => updateItemWeight(item.id, Number(e.target.value))}
                        className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-lime-400"
                      />
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
                    <div>
                        <p className="text-zinc-400 text-sm">Total</p>
                        <p className="text-xl font-bold text-white">
                            {detectedItems.reduce((acc, i) => acc + i.calories, 0)} <span className="text-sm font-normal text-zinc-500">kcal</span>
                        </p>
                    </div>
                     <div>
                        <p className="text-zinc-400 text-sm text-right">Protein</p>
                        <p className="text-xl font-bold text-white text-right">
                            {detectedItems.reduce((acc, i) => acc + i.proteinG, 0)} <span className="text-sm font-normal text-zinc-500">g</span>
                        </p>
                    </div>
                  </div>

                  <Button onClick={handleSave} fullWidth>Log to Diary</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};