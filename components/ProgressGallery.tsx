import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { ProgressPhoto } from '../types';

export const ProgressGallery: React.FC = () => {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto: ProgressPhoto = {
            id: Math.random().toString(),
            date: new Date().toISOString().split('T')[0],
            uri: reader.result as string
        };
        setPhotos(prev => [newPhoto, ...prev]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 pb-24 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Physique</h2>
        <Button onClick={() => fileInputRef.current?.click()} className="!px-3 !py-2 text-sm">
            + Snap
        </Button>
        <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
        />
      </div>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p>No photos yet.</p>
            <p className="text-xs mt-2">Track your transformation.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
            {photos.map(photo => (
                <div key={photo.id} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                    <img src={photo.uri} alt="Progress" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <p className="text-xs font-mono text-white">{photo.date}</p>
                    </div>
                </div>
            ))}
        </div>
      )}
      
      {photos.length >= 2 && (
          <div className="mt-8 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
            <h3 className="text-lime-400 font-semibold mb-4 text-sm uppercase tracking-wider">Comparison</h3>
            <div className="flex gap-2">
                <div className="flex-1 aspect-[3/4] relative">
                    <img src={photos[photos.length - 1].uri} className="w-full h-full object-cover rounded-lg opacity-50 grayscale" />
                    <span className="absolute top-2 left-2 text-[10px] bg-black/50 text-white px-1 rounded">Start</span>
                </div>
                <div className="flex-1 aspect-[3/4] relative">
                    <img src={photos[0].uri} className="w-full h-full object-cover rounded-lg" />
                     <span className="absolute top-2 left-2 text-[10px] bg-lime-500 text-black px-1 rounded font-bold">Now</span>
                </div>
            </div>
          </div>
      )}
    </div>
  );
};