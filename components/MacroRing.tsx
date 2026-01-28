import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MacroRingProps {
  current: number;
  target: number;
  color: string;
  label: string;
  unit: string;
}

export const MacroRing: React.FC<MacroRingProps> = ({ current, target, color, label, unit }) => {
  const percentage = Math.min(100, Math.max(0, (current / target) * 100));
  
  // We use two layered pies to create a progress ring with rounded corners.
  // The first pie is the background track (full circle).
  // The second pie is the progress indicator (arc).
  
  const trackData = [{ value: 1 }];
  const progressData = [{ value: 1 }];
  
  // Calculate angles for the progress arc.
  // 360 degrees total. Starts at 90 deg (top).
  const startAngle = 90;
  const endAngle = 90 - (360 * (percentage / 100));

  return (
    <div className="flex flex-col items-center justify-center relative w-full aspect-square max-w-[160px]">
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <span className="text-2xl font-bold text-white">{current}</span>
        <span className="text-xs text-zinc-400">/ {target} {unit}</span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500 mt-1">{label}</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Background Track */}
          <Pie
            data={trackData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={70}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
          >
            <Cell fill="#27272a" />
          </Pie>
          
          {/* Progress Arc */}
          {percentage > 0 && (
            <Pie
              data={progressData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={70}
              startAngle={startAngle}
              endAngle={endAngle}
              dataKey="value"
              stroke="none"
              cornerRadius={percentage < 100 ? 10 : 0}
            >
              <Cell fill={color} />
            </Pie>
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};