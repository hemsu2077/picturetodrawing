"use client";

import { useState } from "react";
import DailyCheckin from "@/components/checkin/daily-checkin";
import TestPanel from "@/components/checkin/test-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestTube, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DailyCheckinTest() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleStatusUpdate = () => {
    // 
    setRefreshKey(prev => prev + 1);
  };

  const handleManualRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-8">
      {/* title */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <TestTube className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold">Daily Checkin Test Page</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          This is a page specifically designed to test the daily checkin feature. You can use the test panel below to simulate various checkin scenarios without waiting for real time to pass.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            Only for development environment
          </Badge>
          <Button
            onClick={handleManualRefresh}
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Manual Refresh
          </Button>
        </div>
      </div>

      {/* test control panel */}
      <TestPanel onStatusUpdate={handleStatusUpdate} />

      {/* actual checkin component */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-muted-foreground">
            ↓ actual checkin component effect ↓
          </h2>
        </div>
        <div key={refreshKey}>
          <DailyCheckin />
        </div>
      </div>

      {/* 测试场景说明 */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test Scenario Description
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <h4 className="font-medium text-primary">Basic Test Scenarios:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>New User</strong>: Test first checkin after reset</li>
                <li>• <strong>Continuous Checkin</strong>: Test 1-7 days of consecutive checkin rewards</li>
                <li>• <strong>Repeated Checkin</strong>: Test handling of repeated checkin on the same day</li>
                <li>• <strong>Cycle Reset</strong>: Test the status after completing 7 days</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-primary">Advanced Test Scenarios:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Checkin Interruption</strong>: Test the status after interruption</li>
                <li>• <strong>8th Day Scenario</strong>: Test the status after completing 7 days</li>
                <li>• <strong>Special Rewards</strong>: Test the special rewards on the 3rd, 5th, and 7th days</li>
                <li>• <strong>Boundary Cases</strong>: Test various boundary conditions</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Reward Rules:</h4>
            <div className="grid grid-cols-7 gap-2 text-xs">
              {[2, 2, 4, 2, 4, 2, 8].map((credits, index) => (
                <div key={index} className="text-center">
                  <div className="font-medium">Day {index + 1}</div>
                  <div className="text-blue-600 dark:text-blue-400">+{credits} Credits</div>
                  {(index === 2 || index === 4 || index === 6) && (
                    <div className="text-yellow-600 text-xs">🎁</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
