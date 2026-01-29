import React, { useState } from 'react';
import { findNearbyPlaces } from '../services/geminiService';
import { Button } from './Button';

export const NearbyExplorer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ text: string; links: any[] } | null>(null);

  const explore = (query: string) => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const data = await findNearbyPlaces(query, pos.coords.latitude, pos.coords.longitude);
      setResults(data);
      setLoading(false);
    }, () => {
      alert("Location access denied.");
      setLoading(false);
    });
  };

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl space-y-4">
      <h3 className="text-white font-semibold flex items-center gap-2">
        <svg className="w-4 h-4 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        Environment Explorer
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => explore("healthy restaurants")} className="bg-zinc-800 p-2 rounded-lg text-xs text-zinc-300 hover:bg-zinc-700 transition-colors">Healthy Food</button>
        <button onClick={() => explore("gyms and parks")} className="bg-zinc-800 p-2 rounded-lg text-xs text-zinc-300 hover:bg-zinc-700 transition-colors">Fitness Spots</button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-lime-400 animate-pulse text-xs py-4">
            <div className="w-4 h-4 border-2 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
            Scanning area for resources...
        </div>
      )}

      {results && (
        <div className="mt-4 space-y-3 animate-fade-in">
          <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap">{results.text}</p>
          <div className="flex flex-wrap gap-2">
            {results.links.map((link, idx) => (
              <a 
                key={idx} 
                href={link.uri} 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] bg-lime-400/10 border border-lime-400/30 text-lime-400 px-2 py-1 rounded-md hover:bg-lime-400/20"
              >
                {link.title || "View on Maps"}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};