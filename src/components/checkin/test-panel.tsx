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
        toast.error(result.message || "操作失败");
      }
    } catch (error) {
      console.error('Test API call failed:', error);
      toast.error("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleSetConsecutiveDays = async () => {
    if (consecutiveDays < 0 || consecutiveDays > 7) {
      toast.error("连续天数必须在0-7之间");
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
      toast.success("获取调试信息成功");
    } catch (error) {
      console.error('Get debug info failed:', error);
      toast.error("获取调试信息失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mb-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-orange-500" />
          <CardTitle className="text-xl">签到测试面板</CardTitle>
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            测试环境
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 自定义连续签到天数 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-blue-500" />
            <Label className="text-sm font-medium">自定义连续签到天数</Label>
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
              设置签到天数
            </Button>
            <span className="text-sm text-muted-foreground">
              (0-7天，会自动生成对应的历史记录)
            </span>
          </div>
        </div>

        <Separator />

        {/* 测试场景按钮组 */}
        <div className="space-y-4">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-500" />
            快速测试场景
          </Label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 重置所有签到 */}
            <Button
              onClick={handleResetAll}
              disabled={loading}
              variant="destructive"
              size="sm"
              className="justify-start"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              重置所有签到
            </Button>

            {/* 模拟签到中断 */}
            <Button
              onClick={handleSimulateBreak}
              disabled={loading}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              <CalendarX className="h-4 w-4 mr-2" />
              模拟签到中断
            </Button>

            {/* 模拟第8天情况 */}
            <Button
              onClick={handleSimulateDay8}
              disabled={loading}
              variant="outline"
              size="sm"
              className="justify-start"
            >
              <Gift className="h-4 w-4 mr-2" />
              模拟完成7天(第8天)
            </Button>

            {/* 设置为第3天 */}
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
              快速设为第3天
            </Button>

            {/* 设置为第6天 */}
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
              快速设为第6天
            </Button>

            {/* 设置为第7天 */}
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
              快速设为第7天
            </Button>

            {/* 调试信息按钮 */}
            <Button
              onClick={handleGetDebugInfo}
              disabled={loading}
              variant="secondary"
              size="sm"
              className="justify-start"
            >
              <TestTube className="h-4 w-4 mr-2" />
              获取API调试信息
            </Button>
          </div>
        </div>

        <Separator />

        {/* 调试信息显示 */}
        {debugInfo && (
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">API返回数据：</h4>
            
            {debugInfo.data && (
              <div className="text-sm space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">今天是否签到：</span>
                    <span className={debugInfo.data.checked_in_today ? "text-green-600" : "text-red-600"}>
                      {debugInfo.data.checked_in_today ? "是" : "否"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">连续天数：</span>
                    <span className="text-blue-600 font-bold">{debugInfo.data.consecutive_days}天</span>
                  </div>
                  <div>
                    <span className="font-medium">最后签到日期：</span>
                    <span>{debugInfo.data.last_checkin_date || "无"}</span>
                  </div>
                  <div>
                    <span className="font-medium">今日获得积分：</span>
                    <span className="text-purple-600">{debugInfo.data.today_credits}</span>
                  </div>
                </div>
              </div>
            )}
            
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-600 dark:text-gray-400">查看完整JSON数据</summary>
              <pre className="mt-2 text-gray-600 dark:text-gray-400 overflow-auto bg-white dark:bg-gray-800 p-2 rounded">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          </div>
        )}

        <Separator />

        {/* 使用说明 */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">测试说明：</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• <strong>自定义天数</strong>：设置用户已连续签到的天数(0-7)</li>
            <li>• <strong>重置签到</strong>：清空所有签到记录，回到初始状态</li>
            <li>• <strong>模拟中断</strong>：模拟用户连续签到后中断3天的情况</li>
            <li>• <strong>模拟第8天</strong>：模拟用户已完成7天签到，今天是新周期第1天</li>
            <li>• <strong>快速设置</strong>：一键设置常见的测试场景</li>
          </ul>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
            <span className="ml-2 text-sm text-muted-foreground">处理中...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
