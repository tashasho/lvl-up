import React, { useState } from 'react';
import { UserProfile, FoodLogEntry, WeightLog } from '../types';
import { MacroRing } from './MacroRing';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from './Button';

interface DashboardProps {
  user: UserProfile;
  foodLogs: FoodLogEntry[];
  weightLogs: WeightLog[];
  onLogWeight: (weight: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, foodLogs, weightLogs, onLogWeight }) => {
  const [newWeight, setNewWeight] = useState('');
  const [isLoggingWeight, setIsLoggingWeight] = useState(false);

  const totalKcal = foodLogs.reduce((acc, log) => acc + log.items.reduce((s, i) => s + i.calories, 0), 0);
  const totalProtein = foodLogs.reduce((acc, log) => acc + log.items.reduce((s, i) => s + i.proteinG, 0), 0);

  // Check if targets are hit for streak visualization (simple check)
  const kcalHit = totalKcal >= user.targetKcal - 200 && totalKcal <= user.targetKcal + 200;
  const proteinHit = totalProtein >= user.targetProtein - 10;

  const handleWeightSubmit = () => {
    if (newWeight) {
        onLogWeight(parseFloat(newWeight));
        setNewWeight('');
        setIsLoggingWeight(false);
    }
  };

  return (
    <div className="p-6 pb-24 space-y-8 animate-fade-in">
      {/* Header & Status Pill */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Hello, Athlete</h1>
          <p className="text-zinc-400 text-sm mt-1 font-medium">{user.goal}</p>
        </div>
        
        {/* Unified Status Pill */}
        <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 p-1.5 pr-4 rounded-full shadow-lg backdrop-blur-sm">
             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lime-400 to-lime-600 flex items-center justify-center text-black font-black text-xs shadow-inner">
                LVL
             </div>
             <div className="flex flex-col">
                 <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider leading-none mb-0.5">Streak</span>
                 <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white leading-none">{user.streakDays}</span>
                    <svg className="w-3.5 h-3.5 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13.08 3.06 12.29 3.33 11.62 3.8C7.27 6.77 8.29 13.18 10.28 15.93C10.5 16.23 10.74 16.5 11 16.76C11 16.76 11.03 16.79 11.03 16.79C12.44 18.06 14.33 18.66 16.2 18.35C16.32 18.33 16.44 18.31 16.55 18.27C17.69 17.96 18.67 17.3 19.34 16.34C20.89 14.15 19.86 12.03 17.66 11.2ZM12.13 15.39C10.68 13.14 10.27 8.84 12.87 6.4C12.92 8.24 13.88 9.92 15.24 11.14C15.82 11.65 16.62 12.29 16.91 13.08C17.5 14.7 16 16.21 14.45 16.55C13.59 16.74 12.71 16.21 12.13 15.39Z"/></svg>
                 </div>
             </div>
        </div>
      </div>

      {/* Macros */}
      <div className="flex justify-between items-center gap-4 px-2">
        <div className="relative flex-1 flex justify-center">
            <MacroRing 
                current={totalKcal} 
                target={user.targetKcal} 
                color="#a3e635" // lime-400
                label="Calories"
                unit="kcal"
            />
            {kcalHit && <div className="absolute top-0 right-2 bg-lime-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce shadow-lg">HIT!</div>}
        </div>
        <div className="relative flex-1 flex justify-center">
            <MacroRing 
                current={totalProtein} 
                target={user.targetProtein} 
                color="#3b82f6" // blue-500
                label="Protein"
                unit="g"
            />
            {proteinHit && <div className="absolute top-0 right-2 bg-blue-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce shadow-lg">HIT!</div>}
        </div>
      </div>

      {/* Weight Chart */}
      <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h3 className="text-white font-semibold">Weight Trend</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Last 30 Days</p>
            </div>
            <button 
                onClick={() => setIsLoggingWeight(!isLoggingWeight)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-lime-400 hover:bg-zinc-700 hover:text-lime-300 font-medium transition-colors border border-zinc-700"
            >
                {isLoggingWeight ? 'Cancel' : '+ Log Today'}
            </button>
        </div>

        {isLoggingWeight && (
            <div className="flex gap-2 mb-6 animate-fade-in">
                <input 
                    type="number" 
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="kg"
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-4 text-white focus:outline-none focus:border-lime-400 py-3"
                    autoFocus
                />
                <Button onClick={handleWeightSubmit} className="!py-2 !px-6">Save</Button>
            </div>
        )}

        <div className="h-48 w-full">
            {weightLogs.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightLogs}>
                        <XAxis 
                            dataKey="date" 
                            stroke="#52525b" 
                            fontSize={10} 
                            tickFormatter={(str) => str.split('-').slice(1).join('/')}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis 
                            stroke="#52525b" 
                            fontSize={10} 
                            domain={['dataMin - 1', 'dataMax + 1']} 
                            hide
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', padding: '8px 12px' }}
                            itemStyle={{ color: '#e4e4e7', fontSize: '12px', fontWeight: 'bold' }}
                            labelStyle={{ display: 'none' }}
                            formatter={(value) => [`${value} kg`]}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="weightKg" 
                            stroke="#a3e635" 
                            strokeWidth={3} 
                            dot={{ fill: '#09090b', stroke: '#a3e635', strokeWidth: 2, r: 4 }} 
                            activeDot={{ r: 6, fill: '#a3e635' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-zinc-600 text-sm">
                    No weight data yet
                </div>
            )}
        </div>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
        <h3 className="text-white font-semibold mb-4">Integrations</h3>
        <div className="space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/10 text-red-500 border border-red-500/20 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                     </div>
                     <div>
                         <p className="text-sm font-medium text-zinc-200">Apple Health</p>
                         <p className="text-xs text-zinc-500">Syncing steps...</p>
                     </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                    </span>
                    <span className="text-xs text-zinc-600 font-mono">Active</span>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};