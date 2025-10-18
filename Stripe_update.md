Stripe 订阅续费积分未入账修复说明

背景

线上收到 Stripe 的续费事件 invoice.payment_succeeded，Vercel 日志显示已扣费成功，但服务返回 500 且未加积分。
报错信息为“not handle none-subscription payment”，表明代码未能识别为订阅续费。
根因

你当前 Webhook 使用的 Stripe API 版本为 2025-07-30.basil（预览/较新版本），发票对象结构与旧版本不同。
旧代码强依赖 invoice.subscription（字符串）字段拿订阅 ID，若取不到就直接抛错，导致续费流程终止，未创建续费订单也未发放积分。
修改要点

不改变业务规则，仅增强“订阅 ID 与周期字段”的兼容获取，确保不同 API 结构下都能走通原有逻辑。
订阅 ID 多重兜底（从强到弱，任一命中即返回）：
invoice.subscription（字符串或对象）
invoice.parent（有的版本将父对象或 subscription.id 放在这里）
通过 expand 重新 invoices.retrieve(invoice.id, { expand: ['subscription','lines.data','lines.data.price'] }) 读取 subscription
遍历发票行 lines.data[*].subscription_item，调用 subscriptionItems.retrieve() 反查对应订阅
以 customer 列出订阅，优先用 latest_invoice === invoice.id 精确匹配；否则按发票里的 price.id 与订阅项 price.id 交集匹配
订阅周期字段回退：
旧字段 item.plan.interval[_count]
回退到新版 item.price.recurring.interval[_count]
首次订阅（checkout.session.completed）同样做了周期字段回退，避免在创建订阅时 metadata 不完整。
涉及文件
src/services/stripe.ts:76 handleInvoice 订阅 ID 获取、周期字段兼容
src/services/stripe.ts:5 handleCheckoutSession 周期字段兼容
影响评估

无业务规则变更：仍只在续费成功时创建“续费订单 + 发放积分”；仍跳过 billing_reason === 'subscription_create' 的首次订阅发票。
幂等性保持：续费订单号形如 原单号_次数，数据库唯一约束防重复入账；即使 Stripe 重试 Webhook 也不会重复加积分。
改动范围小、向后兼容，不影响一次性购买流程和已有订单/积分逻辑。
验证步骤

部署后在 Stripe Dashboard 回放失败的 invoice.payment_succeeded 到 /api/pay/notify/stripe。
期望不再返回 500；数据库中：
orders 表新增续费订单（order_no 形如 原单号_2、原单号_3）
credits 表新增一条正向积分流水，对应该续费订单号
前台“我的订单”页可见新增记录；用户积分增加。
线上建议

在 Stripe Webhook 端点固定 API 版本到一个与你 SDK 兼容的稳定版，避免未来字段变化再次影响。
如需排查，可临时打印 invoice.id / invoice.subscription / invoice.parent / invoice.customer / lines.length 等关键字段，验证兜底命中路径。
如需回补历史漏发积分，可加一个仅管理员可用的小脚本，批量重放一段时间内的 invoice.payment_succeeded 事件。
回滚说明

仅改动了 src/services/stripe.ts，如需回滚可直接恢复该文件到修改前版本，不影响其他模块。