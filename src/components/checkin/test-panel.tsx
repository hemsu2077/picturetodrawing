"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  RotateCcw, 
  Calendar, 
  CalendarX,
  TestTube,
  Zap,
  Gift
} from "lucide-react";
import { toast } from "sonner";

interface TestPanelProps {
  onStatusUpdate: () => void;
}

export default function TestPanel({ onStatusUpdate }: TestPanelProps) {
  const [loading, setLoading] = useState(false);
  const [consecutiveDays, setConsecutiveDays] = useState<number>(3);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const callTestAPI = async (action: string, data?: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkin/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, ...data }),
      });
      
      const result = await response.json();
      
      if (result.code === 0) {
        toast.success(result.message);
        onStatusUpdate();
      } else {
        toast.error(result.message || "Operation failed");
      }
    } catch (error) {
      console.error('Test API call failed:', error);
      toast.error("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleSetConsecutiveDays = async () => {
    if (consecutiveDays < 0 || consecutiveDays > 7) {
      toast.error("The number of consecutive days must be between 0 and 7");
      return;
    }
    await callTestAPI("set_consecutive_days", { days: consecutiveDays });
  };

  const handleResetAll = async () => {
    await callTestAPI("reset_all");
  };

  const handleSimulateBreak = async () => {
    await callTestAPI("simulate_break", { days: consecutiveDays });
  };

  const handleSimulateDay8 = async () => {
    await callTestAPI("simulate_day8");
  };

  const handleGetDebugInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkin');
      const result = await response.json();
      setDebugInfo(result);
      toast.success("Get debug info successfully");
    } catch (error) {
      console.error('Get debug info failed:', error);
      toast.error("Get debug info failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mb-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-orange-500" />
          <CardTitle className="text-xl">Test Checkin Panel</CardTitle>
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            Test Environment
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Customize consecutive checkin days */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-blue-500" />
            <Label className="text-sm font-medium">Customize consecutive checkin days</Label>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min="0"
              max="7"
              value={consecutiveDays}
              onChange={(e) => setConsecutiveDays(Number(e.target.value))}
              className="w-20"
              disabled={loading}
            />
            <Button
              onClick={handleSetConsecutiveDays}
              disabled={loading}
              size="sm"
              variant="outline"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Set Checkin Days
            </Button>
            <span className="text-sm text-muted-foreground">
              (0-7 days, will automatically generate corresponding history records)
            </span>
          </div>
        </div>

        <Separator />

        {/* Test Scenario Buttons */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-500" />
            Quick Test Scenarios
          </Label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Reset all checkins */}
            <Button
              onClick={handleResetAll}
              disabled={loading}
              variant="destructive"
              size="sm"
              className="justify-start"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All Checkins
            </Button>

            {/* Simulate checkin interruption */}
            <Button
              onClick={handleSimulateBreak}
              disabled={loading}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              <CalendarX className="h-4 w-4 mr-2" />
              Simulate Checkin Interruption
            </Button>

            {/* Simulate 8th day */}
            <Button
              onClick={handleSimulateDay8}
              disabled={loading}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              <Gift className="h-4 w-4 mr-2" />
              Simulate 8th Day (Reset New Cycle)
            </Button>

            {/* Set to 3rd day */}
            <Button
              onClick={() => {
                setConsecutiveDays(3);
                callTestAPI("set_consecutive_days", { days: 3 });
              }}
              disabled={loading}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Set to 3rd Day
            </Button>

            {/* Set to 6th day */}
            <Button
              onClick={() => {
                setConsecutiveDays(6);
                callTestAPI("set_consecutive_days", { days: 6 });
              }}
              disabled={loading}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Set to 6th Day
            </Button>

            {/* Set to 7th day */}
            <Button
              onClick={() => {
                setConsecutiveDays(7);
                callTestAPI("set_consecutive_days", { days: 7 });
              }}
              disabled={loading}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              <Zap className="h-4 w-4 mr-2" />
              Set to 7th Day
            </Button>

            {/* Debug Info Button */}
            <Button
              onClick={handleGetDebugInfo}
              disabled={loading}
              variant="secondary"
              size="sm"
              className="justify-start"
            >
              <TestTube className="h-4 w-4 mr-2" />
              Get Debug Info
            </Button>
          </div>
        </div>

        <Separator />

        {/* Debug Info Display */}
        {debugInfo && (
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">API Return Data:</h4>
            
            {debugInfo.data && (
              <div className="text-sm space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Is Checked In Today:</span>
                    <span className={debugInfo.data.checked_in_today ? "text-green-600" : "text-red-600"}>
                      {debugInfo.data.checked_in_today ? "Yes" : "No"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Consecutive Days:</span>
                    <span className="text-blue-600 font-bold">{debugInfo.data.consecutive_days}</span>
                  </div>
                  <div>
                    <span className="font-medium">Last Checkin Date:</span>
                    <span>{debugInfo.data.last_checkin_date || "None"}</span>
                  </div>
                  <div>
                    <span className="font-medium">Cycle Credits:</span>
                    <span className="text-purple-600">{debugInfo.data.cycle_credits || debugInfo.data.today_credits || 0}</span>
                  </div>
                </div>
              </div>
            )}
            
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-600 dark:text-gray-400">View Full JSON Data</summary>
              <pre className="mt-2 text-gray-600 dark:text-gray-400 overflow-auto bg-white dark:bg-gray-800 p-2 rounded">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          </div>
        )}

        <Separator />

        {/* Usage Instructions */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Usage Instructions:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• <strong>Customize Days</strong>: Set the number of consecutive checkin days (0-7)</li>
            <li>• <strong>Reset Checkin</strong>: Clear all checkin records and return to initial state</li>
            <li>• <strong>Simulate Break</strong>: Simulate the situation where the user has checked in for 3 consecutive days</li>
            <li>• <strong>Simulate 8th Day</strong>: Simulate the situation where the user has completed the 7th day yesterday and today resets to the 1st day of the new cycle</li>
            <li>• <strong>Quick Set</strong>: Set common test scenarios with one click</li>
          </ul>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
            <span className="ml-2 text-sm text-muted-foreground">Processing...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
