/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useHoraryStore } from '@/store/horaryStore';
import { usePremiumFeatures } from './usePremiumFeatures';

export interface HoraryLimits {
  dailyLimit: number;
  monthlyLimit: number;
  dailyUsed: number;
  monthlyUsed: number;
  canAskQuestion: boolean;
  nextResetDaily: Date;
  nextResetMonthly: Date;
  limitMessage?: string;
}

export function useHoraryLimits() {
  const { user } = useUserStore();
  const { questions } = useHoraryStore();
  const { shouldShowFeature } = usePremiumFeatures();
  
  const [limits, setLimits] = useState<HoraryLimits>({
    dailyLimit: 3,  // Free tier: 3 questions per day
    monthlyLimit: 30, // Free tier: 30 questions per month
    dailyUsed: 0,
    monthlyUsed: 0,
    canAskQuestion: true,
    nextResetDaily: new Date(),
    nextResetMonthly: new Date()
  });
  
  useEffect(() => {
    if (!user) return;
    
    const userIsPremium = user.subscriptionTier === 'premium';
    
    // Set limits based on premium status
    const dailyLimit = userIsPremium ? 999 : 3; // Unlimited for premium
    const monthlyLimit = userIsPremium ? 999 : 30;
    
    // Calculate used questions
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Filter questions by user and date
    const userQuestions = questions.filter(q => q.userId === user.id);
    
    const dailyUsed = userQuestions.filter(q => {
      const questionDate = new Date(q.date);
      return questionDate >= todayStart;
    }).length;
    
    const monthlyUsed = userQuestions.filter(q => {
      const questionDate = new Date(q.date);
      return questionDate >= monthStart;
    }).length;
    
    // Calculate next reset times
    const nextResetDaily = new Date(todayStart);
    nextResetDaily.setDate(nextResetDaily.getDate() + 1);
    
    const nextResetMonthly = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    // Determine if user can ask questions
    let canAskQuestion = true;
    let limitMessage: string | undefined;
    
    if (!userIsPremium) {
      if (dailyUsed >= dailyLimit) {
        canAskQuestion = false;
        const hoursUntilReset = Math.ceil((nextResetDaily.getTime() - now.getTime()) / (1000 * 60 * 60));
        limitMessage = `Daily limit reached (${dailyLimit} questions). Resets in ${hoursUntilReset} hours.`;
      } else if (monthlyUsed >= monthlyLimit) {
        canAskQuestion = false;
        const daysUntilReset = Math.ceil((nextResetMonthly.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        limitMessage = `Monthly limit reached (${monthlyLimit} questions). Resets in ${daysUntilReset} days.`;
      }
    }
    
    setLimits({
      dailyLimit,
      monthlyLimit,
      dailyUsed,
      monthlyUsed,
      canAskQuestion,
      nextResetDaily,
      nextResetMonthly,
      limitMessage
    });
  }, [user, questions]);
  
  return limits;
}

export function formatTimeUntilReset(resetTime: Date): string {
  const now = new Date();
  const diff = resetTime.getTime() - now.getTime();
  
  if (diff <= 0) return 'Now';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
}