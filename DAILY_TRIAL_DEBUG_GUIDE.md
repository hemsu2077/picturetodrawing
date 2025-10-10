# Daily Trial 调试指南

## 问题描述
每日试用限制失效，用户可以无限次免费生成图片，即使规则是每天只能免费生成一次。

## 根本原因分析

### 可能的原因

1. **数据库表未创建**
   - `pic_to_dra_daily_trials` 表可能不存在
   - 迁移文件存在但未执行

2. **试用记录保存失败**
   - `recordDailyTrial()` 函数抛出异常
   - 异常被捕获但只打印日志，不影响图片生成成功
   - 下次请求时 `checkDailyTrial()` 查不到记录，继续显示可以免费试用

3. **数据库连接问题**
   - 本地开发环境数据库未启动
   - DATABASE_URL 配置错误
   - 数据库权限问题

## 调试步骤

### 1. 检查数据库表是否存在

```bash
# 运行调试脚本
./scripts/check-daily-trials.sh
```

如果表不存在，运行迁移：

```bash
# 推送 schema 到数据库
pnpm db:push

# 或者运行迁移
pnpm db:migrate
```

### 2. 检查服务器日志

启动开发服务器并观察日志：

```bash
pnpm dev
```

当你尝试生成图片时，应该看到以下日志：

#### 检查试用状态时（页面加载）：
```
[check-trial-status] Request received, userUuid: xxx
[checkDailyTrial] Checking trial for user xxx on 2025-10-10
[checkDailyTrial] User xxx: existingTrial.length=0, canUseTrial=true
[check-trial-status] Trial check result for user xxx: { canUseTrial: true, isTrialUsage: true }
```

#### 生成图片时：
```
[gen-drawing] Checking trial status for user xxx
[checkDailyTrial] Checking trial for user xxx on 2025-10-10
[checkDailyTrial] User xxx: existingTrial.length=0, canUseTrial=true
[gen-drawing] Trial check result: { canUseTrial: true, isTrialUsage: true }
[gen-drawing] ✅ Using daily trial for user xxx
...
[gen-drawing] Recording daily trial for user xxx
[recordDailyTrial] Attempting to record trial for user xxx, IP xxx.xxx.xxx.xxx, date 2025-10-10
[recordDailyTrial] ✅ Daily trial successfully recorded for user xxx, record ID: 123
[gen-drawing] ✅ Daily trial recorded successfully for user xxx
```

#### 第二次尝试生成（应该失败）：
```
[gen-drawing] Checking trial status for user xxx
[checkDailyTrial] Checking trial for user xxx on 2025-10-10
[checkDailyTrial] User xxx: existingTrial.length=1, canUseTrial=false
[gen-drawing] Trial check result: { canUseTrial: false, isTrialUsage: false }
[gen-drawing] Trial not available, checking credits for user xxx
[gen-drawing] User credits: 0
[gen-drawing] ❌ Insufficient credits (0) and trial already used
```

### 3. 关键错误日志

如果看到以下错误，说明试用记录保存失败：

```
[recordDailyTrial] ❌ Error recording daily trial: ...
[gen-drawing] ❌ CRITICAL: Failed to record daily trial for user xxx
[gen-drawing] ⚠️ WARNING: User xxx may be able to use unlimited trials due to recording failure!
```

常见错误：
- `relation "pic_to_dra_daily_trials" does not exist` - 表未创建
- `null value in column "ip_address" violates not-null constraint` - IP 获取失败
- `duplicate key value violates unique constraint` - 正常，说明约束生效

### 4. 手动测试数据库

```bash
# 连接到数据库
psql $DATABASE_URL

# 检查表是否存在
\dt pic_to_dra_daily_trials

# 查看表结构
\d pic_to_dra_daily_trials

# 查看今天的试用记录
SELECT * FROM pic_to_dra_daily_trials WHERE trial_date = CURRENT_DATE;

# 清空测试数据（仅用于调试）
DELETE FROM pic_to_dra_daily_trials WHERE trial_date = CURRENT_DATE;
```

### 5. 验证唯一约束

```sql
-- 检查唯一约束是否存在
SELECT conname, contype, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'pic_to_dra_daily_trials'::regclass;

-- 应该看到两个 UNIQUE 约束：
-- user_daily_trial_unique: UNIQUE (user_uuid, trial_date)
-- ip_daily_trial_unique: UNIQUE (ip_address, trial_date)
```

### 6. 测试流程

1. **清空今天的测试数据**：
   ```sql
   DELETE FROM pic_to_dra_daily_trials WHERE trial_date = CURRENT_DATE;
   ```

2. **第一次生成**（应该成功，使用试用）：
   - 登录账号
   - 上传图片并生成
   - 检查日志确认 `[recordDailyTrial] ✅ Daily trial successfully recorded`
   - 检查数据库：`SELECT * FROM pic_to_dra_daily_trials WHERE trial_date = CURRENT_DATE;`

3. **第二次生成**（应该失败或扣除 credits）：
   - 刷新页面（按钮应该显示 "2" credits 而不是 "Free"）
   - 尝试生成
   - 如果没有 credits，应该看到错误提示
   - 检查日志确认 `canUseTrial=false`

## 修复内容总结

### 1. 添加详细日志 (`src/services/trial.ts`)
- `checkDailyTrial()`: 记录查询过程和结果
- `recordDailyTrial()`: 记录插入过程和结果
- 使用 emoji 标记成功/失败/警告

### 2. 添加详细日志 (`src/app/api/gen-drawing/route.ts`)
- 记录试用检查过程
- 记录 credits 检查和扣除
- **CRITICAL** 标记试用记录失败（这是关键问题）

### 3. 添加详细日志 (`src/app/api/check-trial-status/route.ts`)
- 记录每次试用状态检查

### 4. 调试脚本 (`scripts/check-daily-trials.sh`)
- 自动检查表是否存在
- 显示表结构和约束
- 显示今天的试用记录

## 下一步行动

1. **运行迁移**（如果表不存在）：
   ```bash
   pnpm db:push
   ```

2. **启动开发服务器**：
   ```bash
   pnpm dev
   ```

3. **测试并观察日志**：
   - 打开浏览器控制台和终端日志
   - 尝试生成图片
   - 查看所有 `[checkDailyTrial]` 和 `[recordDailyTrial]` 日志

4. **如果仍然失败**：
   - 复制完整的错误日志
   - 检查 DATABASE_URL 是否正确
   - 确认数据库服务是否运行

## 常见问题

### Q: 为什么 recordDailyTrial 失败不会阻止图片生成？
A: 因为图片已经生成并上传成功，如果此时失败会导致用户体验不好。但这是一个**严重的安全问题**，因为用户可以无限使用试用。日志中会用 `CRITICAL` 和 `WARNING` 标记。

### Q: 如何修复无限试用问题？
A: 
1. 确保数据库表存在且可写
2. 确保 `recordDailyTrial()` 不抛出异常
3. 考虑在生成前先记录试用（预扣除模式）

### Q: 本地测试时如何重置试用？
A: 
```sql
DELETE FROM pic_to_dra_daily_trials WHERE user_uuid = 'your-user-uuid' AND trial_date = CURRENT_DATE;
```

## 生产环境注意事项

1. **监控 CRITICAL 日志**：设置告警监控 `recordDailyTrial` 失败
2. **定期检查**：检查是否有用户多次使用试用
3. **考虑改进**：在生成前预记录试用，失败则不允许生成
