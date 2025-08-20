"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Gift, Calendar, Coins } from "lucide-react";
import { toast } from "sonner";

interface CheckinStatus {
  checked_in_today: boolean;
  consecutive_days: number;
  last_checkin_date: string | null;
  today_credits: number;
}

interface CheckinDay {
  day: number;
  credits: number;
  completed: boolean;
  isToday: boolean;
}

const DAILY_REWARDS = [2, 2, 4, 2, 4, 2, 8];

export default function DailyCheckin() {
  const [status, setStatus] = useState<CheckinStatus>({
    checked_in_today: false,
    consecutive_days: 0,
    last_checkin_date: null,
    today_credits: 0,
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [remindMe, setRemindMe] = useState(false);

  useEffect(() => {
    fetchCheckinStatus();
    
    // Load reminder preference from localStorage
    const savedReminder = localStorage.getItem('checkin-reminder');
    setRemindMe(savedReminder === 'true');
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
      setInitialLoading(false);
    }
  };

  const handleCheckin = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.code === 0) {
        toast.success(result.message);
        setStatus(prev => ({
          ...prev,
          checked_in_today: true,
          consecutive_days: result.data.consecutive_days,
          today_credits: result.data.credits_earned,
        }));
      } else if (result.code === 208) {
        toast.info("Already checked in today!");
      } else {
        toast.error(result.message || "Checkin failed");
      }
    } catch (error) {
      console.error('Checkin failed:', error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReminderToggle = (checked: boolean) => {
    setRemindMe(checked);
    localStorage.setItem('checkin-reminder', checked.toString());
    
    if (checked) {
      toast.success("Reminder enabled! We'll notify you daily.");
    } else {
      toast.info("Daily reminder disabled.");
    }
  };

  const generateCheckinDays = (): CheckinDay[] => {
    return DAILY_REWARDS.map((credits, index) => {
      const dayNumber = index + 1;
      
      // 如果今天已经签到，那么连续天数包含今天
      // 如果今天没签到，那么连续天数不包含今天
      let completed = false;
      let isToday = false;
      
      if (status.checked_in_today) {
        // 今天已签到：前 consecutive_days 天都完成了
        completed = dayNumber <= status.consecutive_days;
        isToday = false; // 今天已完成，不需要高亮
      } else {
        // 今天未签到：前 consecutive_days 天完成了，今天是待签到
        completed = dayNumber <= status.consecutive_days;
        isToday = dayNumber === status.consecutive_days + 1;
      }
      
      return {
        day: dayNumber,
        credits,
        completed,
        isToday,
      };
    });
  };

  if (initialLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="grid grid-cols-7 gap-4 mt-8">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const checkinDays = generateCheckinDays();
  const totalCredits = DAILY_REWARDS.reduce((sum, credits) => sum + credits, 0);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Gift className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl font-bold">
            Check In For 7 Consecutive Days
          </CardTitle>
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg">and</span>
          <Badge variant="destructive" className="text-lg px-3 py-1">
            Get {totalCredits} Credits
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>You've checked in for {status.consecutive_days} day{status.consecutive_days !== 1 ? 's' : ''}</span>
          </div>
          {status.checked_in_today && (
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium">+{status.today_credits}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Daily Progress */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4">
          {checkinDays.map((day) => (
            <div
              key={day.day}
              className={`
                relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg border-2 transition-all
                ${day.completed 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                  : day.isToday 
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                    : 'border-muted bg-muted/30'
                }
              `}
            >
              {/* Day Icon */}
              <div className={`
                w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold mb-1
                ${day.completed 
                  ? 'bg-green-500 text-white' 
                  : day.isToday
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }
              `}>
                {day.completed ? '✓' : `+${day.credits}`}
              </div>
              
              {/* Day Label */}
              <span className={`text-xs font-medium ${
                day.completed ? 'text-green-600 dark:text-green-400' : ''
              }`}>
                Day {day.day}
              </span>
              
              {/* Special Day Indicators */}
              {(day.day === 3 || day.day === 5 || day.day === 7) && !day.completed && (
                <Gift className="absolute -top-1 -right-1 h-3 w-3 text-primary" />
              )}
              
              {/* Completed indicator for special days */}
              {(day.day === 3 || day.day === 5 || day.day === 7) && day.completed && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Gift className="h-2.5 w-2.5 text-yellow-800" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reminder Checkbox */}
        <div className="flex items-center space-x-2 justify-center">
          <Checkbox
            id="remind-me"
            checked={remindMe}
            onCheckedChange={handleReminderToggle}
          />
          <label
            htmlFor="remind-me"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Remind me every day
          </label>
        </div>

        {/* Check In Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleCheckin}
            disabled={loading || status.checked_in_today}
            size="lg"
            variant={status.checked_in_today ? "secondary" : "default"}
            className={`px-8 py-3 text-lg font-semibold min-w-[200px] ${
              status.checked_in_today ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent"></div>
                Checking In...
              </div>
            ) : status.checked_in_today ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                Checked In Today
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Check In
              </div>
            )}
          </Button>
        </div>

        {/* Progress Info */}
        <div className="text-center space-y-2">
          <div className="text-sm text-muted-foreground">
            {status.checked_in_today ? (
              <span>Come back tomorrow to continue your streak!</span>
            ) : status.consecutive_days === 0 ? (
              <span>Start your daily check-in streak to earn credits!</span>
            ) : (
              <span>Continue your {status.consecutive_days}-day streak!</span>
            )}
          </div>
          
          {status.consecutive_days >= 7 && (
            <div className="text-sm text-primary font-medium">
              🎉 Amazing! You've completed a full week of check-ins!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
