"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Gift, Calendar, Coins } from "lucide-react";
import { RiCoinsLine } from "react-icons/ri";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface CheckinStatus {
  checked_in_today: boolean;
  consecutive_days: number;
  last_checkin_date: string | null;
  cycle_credits: number;
}

interface CheckinDay {
  day: number;
  credits: number;
  completed: boolean;
  isToday: boolean;
}

const DAILY_REWARDS = [2, 2, 4, 2, 4, 2, 8];

export default function DailyCheckin() {
  const t = useTranslations();
  const [status, setStatus] = useState<CheckinStatus>({
    checked_in_today: false,
    consecutive_days: 0,
    last_checkin_date: null,
    cycle_credits: 0,
  });
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    fetchCheckinStatus();
  
  }, []);

  const fetchCheckinStatus = async () => {
    try {
      const response = await fetch('/api/checkin');
      const result = await response.json();
      
      if (result.code === 0) {
        setStatus(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch checkin status:', error);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleCheckin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.code === 200 || result.code === 0) {
        toast.success(result.message);
        // Recalculate cycle credits after successful checkin
        const calculateCycleCredits = (consecutiveDays: number): number => {
          let totalCredits = 0;
          for (let i = 1; i <= consecutiveDays; i++) {
            totalCredits += DAILY_REWARDS[Math.min(i - 1, 6)];
          }
          return totalCredits;
        };
        
        setStatus(prev => ({
          ...prev,
          checked_in_today: true,
          consecutive_days: result.data.consecutive_days,
          cycle_credits: calculateCycleCredits(result.data.consecutive_days),
        }));
      } else if (result.code === 208) {
        toast.info(t("daily_checkin.already_checked_in"));
        // Update local state to reflect reality
        setStatus(prev => ({
          ...prev,
          checked_in_today: true,
        }));
      } else {
        toast.error(result.message || t("daily_checkin.checkin_failed"));
      }
    } catch (error) {
      console.error('Checkin failed:', error);
      toast.error(t("daily_checkin.network_error"));
    } finally {
      setLoading(false);
    }
  };


  const generateCheckinDays = (): CheckinDay[] => {
    return DAILY_REWARDS.map((credits, index) => {
      const dayNumber = index + 1;
      
      // if today is checked in, then the consecutive days include today
      // if today is not checked in, then the consecutive days do not include today
      let completed = false;
      let isToday = false;
      
      if (status.checked_in_today) {
        // today is checked in: the previous consecutive_days days are completed
        completed = dayNumber <= status.consecutive_days;
        isToday = false; // today is completed, no need to highlight
      } else {
        // today is not checked in: the previous consecutive_days days are completed, today is not checked in
        // Special case: if consecutive_days is 0 (reset after 7 days), all should be uncompleted
        if (status.consecutive_days === 0) {
          completed = false;
          isToday = dayNumber === 1; // First day should be highlighted as today
        } else {
          completed = dayNumber <= status.consecutive_days;
          isToday = dayNumber === status.consecutive_days + 1;
        }
      }
      
      return {
        day: dayNumber,
        credits,
        completed,
        isToday,
      };
    });
  };

  
  const checkinDays = generateCheckinDays();
  const totalCredits = DAILY_REWARDS.reduce((sum, credits) => sum + credits, 0);

  return (
    <Card className="w-full max-w-4xl mx-auto px-2 sm:px-0">
      <CardHeader className="text-center space-y-4 px-2 sm:px-6">
        <div className="flex flex-col items-center justify-center gap-3">
          <img 
            src="https://files.picturetodrawing.com/ui/free-credits.webp" 
            alt="Picture to Drawing Free Credits" 
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
          />
          <CardTitle className="text-xl sm:text-2xl font-bold">
            {t("daily_checkin.title")}
          </CardTitle>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm sm:text-md">{t("daily_checkin.get_credits", { credits: totalCredits })}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm text-muted-foreground max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-primary">
              {statusLoading ? (
                <div className="animate-pulse inline-block w-16 h-4 bg-muted rounded"></div>
              ) : (
                t("daily_checkin.checked_in_days", { 
                  days: status.consecutive_days, 
                  plural: status.consecutive_days !== 1 ? 's' : '' 
                })
              )}
            </span>
          </div>
          {status.cycle_credits > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-primary font-medium"> +{status.cycle_credits}</span>
              <RiCoinsLine className="h-4 w-4 text-primary" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Daily Progress */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {checkinDays.map((day) => (
            <div
              key={day.day}
              className={`
                relative flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg border-1 transition-all min-h-[70px] sm:min-h-[80px]
                ${day.completed 
                  ? 'border-primary bg-primary/5 dark:bg-primary/5' 
                  : day.isToday 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-500/20' 
                    : 'border-muted bg-muted/30'
                }
              `}
            >
              {/* Day Icon */}
              <div className={`
                w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mb-1
                ${day.completed 
                  ? 'bg-primary text-primary-foreground' 
                  : day.isToday
                    ? 'bg-purple-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }
              `}>
                {day.completed ? '✓' : `+${day.credits}`}
              </div>
              
              {/* Day Label */}
              <span className={`text-[10px] sm:text-xs font-medium ${
                day.completed ? 'text-primary dark:text-primary' : day.isToday ? 'text-purple-600 dark:text-purple-400' : ''
              }`}>
                {t("daily_checkin.day", { day: day.day })}
              </span>
              
            </div>
          ))}
        </div>


        {/* Check In Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleCheckin}
            disabled={loading || status.checked_in_today}
            size="lg"
            variant={status.checked_in_today ? "secondary" : "default"}
            className={`px-4 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold min-w-[160px] sm:min-w-[200px] ${
              status.checked_in_today ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-background border-t-transparent"></div>
                {t("daily_checkin.checking_in")}
              </div>
            ) : status.checked_in_today ? (
              <div className="flex items-center gap-2">
                {t("daily_checkin.checked_in_today")}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Gift className="h-3 w-3 sm:h-4 sm:w-4" />
                {t("daily_checkin.check_in")}
              </div>
            )}
          </Button>
        </div>

        {/* Progress Info */}
        <div className="text-center space-y-2">
          <div className="text-sm text-muted-foreground">
            {statusLoading ? (
              <div className="animate-pulse inline-block w-32 h-4 bg-muted rounded"></div>
            ) : status.consecutive_days >= 7 ? (
              <span>{t("daily_checkin.completed_week")}</span>
            ) : status.checked_in_today ? (
              <span>{t("daily_checkin.come_back_tomorrow")}</span>
            ) : status.consecutive_days === 0 ? (
              <span>{t("daily_checkin.start_streak")}</span>
            ) : (
              <span>{t("daily_checkin.continue_streak", { days: status.consecutive_days })}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
