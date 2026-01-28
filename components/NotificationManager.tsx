import React, { useEffect, useState, useRef } from 'react';

export const NotificationManager: React.FC = () => {
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);
  const lastHourRef = useRef<number>(new Date().getHours());
  
  // Initialize next hydration time to be between 45 and 90 minutes from now
  const nextHydrationTimeRef = useRef<number>(
    Date.now() + 1000 * 60 * (45 + Math.random() * 45)
  );

  useEffect(() => {
    // Request permission for native notifications on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      const now = new Date();
      
      // --- Hourly Movement Reminder ---
      // Check if we are in a new hour and minutes are near 0 (top of the hour)
      if (now.getHours() !== lastHourRef.current) {
        lastHourRef.current = now.getHours();
        triggerNotification("Time to Move", "Stand up, stretch, or walk for 2 minutes.");
      }

      // --- Random Hydration Reminder ---
      if (now.getTime() > nextHydrationTimeRef.current) {
        triggerNotification("Hydrate", "Time for a glass of water.");
        
        // Reset next hydration timer: Randomly between 60 and 120 minutes
        const nextDelay = 1000 * 60 * (60 + Math.random() * 60);
        nextHydrationTimeRef.current = now.getTime() + nextDelay;
      }
    };

    // Check every minute
    const intervalId = setInterval(checkReminders, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const triggerNotification = (title: string, body: string) => {
    // 1. Try Native Notification
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, { body, icon: '/favicon.ico' });
      } catch (e) {
        console.error("Notification failed", e);
      }
    }

    // 2. Always show in-app Toast for guaranteed visibility
    setToast({ title, body });
    
    // Auto hide toast after 6 seconds
    setTimeout(() => setToast(null), 6000);
  };

  if (!toast) return null;

  return (
    <div className="fixed top-6 left-6 right-6 z-[100] flex justify-center pointer-events-none">
      <div className="bg-zinc-800/95 backdrop-blur-md border border-lime-500/30 shadow-2xl rounded-2xl p-4 flex items-center gap-4 max-w-sm w-full animate-slide-down pointer-events-auto">
        <div className="w-10 h-10 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </div>
        <div className="flex-1">
          <h4 className="text-white font-semibold text-sm">{toast.title}</h4>
          <p className="text-zinc-400 text-xs mt-0.5">{toast.body}</p>
        </div>
        <button onClick={() => setToast(null)} className="text-zinc-500 hover:text-white p-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};