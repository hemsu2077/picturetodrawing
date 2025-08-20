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
    // 强制刷新签到组件
    setRefreshKey(prev => prev + 1);
  };

  const handleManualRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-8">
      {/* 页面标题 */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <TestTube className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold">每日签到测试页面</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          这是一个专门用于测试每日签到功能的页面。您可以使用下面的测试面板来模拟各种签到场景，
          而无需等待真实的时间流逝。
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            仅限开发环境使用
          </Badge>
          <Button
            onClick={handleManualRefresh}
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            手动刷新
          </Button>
        </div>
      </div>

      {/* 测试控制面板 */}
      <TestPanel onStatusUpdate={handleStatusUpdate} />

      {/* 实际签到组件 */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-muted-foreground">
            ↓ 实际签到组件效果 ↓
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
            测试场景说明
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <h4 className="font-medium text-primary">基础测试场景：</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>新用户</strong>：重置后测试首次签到</li>
                <li>• <strong>连续签到</strong>：测试1-7天的连续签到奖励</li>
                <li>• <strong>重复签到</strong>：测试同一天重复签到的处理</li>
                <li>• <strong>周期重置</strong>：测试完成7天后重新开始</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-primary">高级测试场景：</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>签到中断</strong>：测试中断后重新开始</li>
                <li>• <strong>第8天场景</strong>：测试完成周期后的状态</li>
                <li>• <strong>特殊奖励</strong>：测试第3、5、7天的特殊奖励</li>
                <li>• <strong>边界情况</strong>：测试各种边界条件</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">奖励规则：</h4>
            <div className="grid grid-cols-7 gap-2 text-xs">
              {[2, 2, 4, 2, 4, 2, 8].map((credits, index) => (
                <div key={index} className="text-center">
                  <div className="font-medium">第{index + 1}天</div>
                  <div className="text-blue-600 dark:text-blue-400">+{credits}积分</div>
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
