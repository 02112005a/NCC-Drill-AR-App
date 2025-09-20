'use client';

import { useState, useEffect, useCallback } from 'react';
import { leaderboardData as initialLeaderboard } from '@/lib/data';

export type DrillSession = {
  date: string;
  score: number;
  drill: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  icon: string;
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  score: number;
  isCurrentUser: boolean;
};

export type CustomDrill = {
  name: string;
};

const ALL_BADGES: Omit<Badge, 'earned'>[] = [
  { id: 'first-drill', name: 'First Step', description: 'Complete your first drill.', icon: 'https://picsum.photos/seed/badge1/100/100' },
  { id: 'perfect-score', name: 'Perfectionist', description: 'Achieve a perfect score of 100.', icon: 'https://picsum.photos/seed/badge2/100/100' },
  { id: 'ten-drills', name: 'Drill Sergeant', description: 'Complete 10 drills.', icon: 'https://picsum.photos/seed/badge3/100/100' },
  { id: 'high-scorer', name: 'High Scorer', description: 'Achieve a score of 90 or higher.', icon: 'https://picsum.photos/seed/badge4/100/100' },
];

const useProgressData = () => {
  const [progress, setProgress] = useState<DrillSession[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [customDrills, setCustomDrills] = useState<CustomDrill[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedProgress = localStorage.getItem('drillMasterProgress');
      const storedLeaderboard = localStorage.getItem('drillMasterLeaderboard');
      const storedCustomDrills = localStorage.getItem('drillMasterCustomDrills');
      
      const progressData = storedProgress ? JSON.parse(storedProgress) : [];
      const leaderboardData = storedLeaderboard ? JSON.parse(storedLeaderboard) : initialLeaderboard;
      const customDrillsData = storedCustomDrills ? JSON.parse(storedCustomDrills) : [];

      setProgress(progressData);
      setLeaderboard(leaderboardData);
      setCustomDrills(customDrillsData);
      updateBadges(progressData);
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setProgress([]);
      setLeaderboard(initialLeaderboard);
      setCustomDrills([]);
      updateBadges([]);
    }
    setIsLoaded(true);
  }, []);

  const updateBadges = (currentProgress: DrillSession[]) => {
    const newBadges = ALL_BADGES.map(b => {
      let earned = false;
      if (b.id === 'first-drill' && currentProgress.length > 0) earned = true;
      if (b.id === 'perfect-score' && currentProgress.some(p => p.score === 100)) earned = true;
      if (b.id === 'ten-drills' && currentProgress.length >= 10) earned = true;
      if (b.id === 'high-scorer' && currentProgress.some(p => p.score >= 90)) earned = true;
      return { ...b, earned };
    });
    setBadges(newBadges);
  };

  const addDrillSession = useCallback((session: Omit<DrillSession, 'date'>) => {
    const newSession = { ...session, date: new Date().toISOString() };
    const updatedProgress = [...progress, newSession];
    
    try {
      localStorage.setItem('drillMasterProgress', JSON.stringify(updatedProgress));
      setProgress(updatedProgress);
      updateBadges(updatedProgress);

      // Update leaderboard score
      const currentUserIndex = leaderboard.findIndex(u => u.isCurrentUser);
      if (currentUserIndex !== -1) {
        const updatedLeaderboard = [...leaderboard];
        const newScore = Math.max(updatedLeaderboard[currentUserIndex].score, session.score);
        updatedLeaderboard[currentUserIndex].score = newScore;
        
        // Re-rank
        updatedLeaderboard.sort((a, b) => b.score - a.score);
        updatedLeaderboard.forEach((user, index) => user.rank = index + 1);

        localStorage.setItem('drillMasterLeaderboard', JSON.stringify(updatedLeaderboard));
        setLeaderboard(updatedLeaderboard);
      }
    } catch (error) {
      console.error("Failed to save progress to localStorage", error);
    }
  }, [progress, leaderboard]);

  const addCustomDrills = useCallback((drills: CustomDrill[]) => {
    const updatedDrills = [...customDrills, ...drills];
    try {
      localStorage.setItem('drillMasterCustomDrills', JSON.stringify(updatedDrills));
      setCustomDrills(updatedDrills);
    } catch (error) {
      console.error("Failed to save custom drills to localStorage", error);
    }
  }, [customDrills]);

  return { isLoaded, progress, badges, leaderboard, customDrills, addDrillSession, addCustomDrills };
};

export default useProgressData;
