# Model Selection Logic

## 🎯 功能说明

根据用户选择的绘画风格，API会自动选择最适合的AI模型来生成图片。

## 🤖 模型选择规则

### Line Drawing 专用模型
```typescript
const model = style === 'line-drawing' 
  ? "black-forest-labs/flux-kontext-dev"    // 线稿专用模型
  : "black-forest-labs/flux-kontext-pro";   // 其他风格通用模型
```

### 模型对应关系

| 绘画风格 | 使用模型 | 说明 |
|---------|---------|------|
| **Line Drawing** | `flux-kontext-dev` | 专门优化线稿绘制 |
| Pencil Sketch | `flux-kontext-pro` | 通用高质量模型 |
| Charcoal Drawing | `flux-kontext-pro` | 通用高质量模型 |
| Color Pencil Drawing | `flux-kontext-pro` | 通用高质量模型 |
| Watercolor Painting | `flux-kontext-pro` | 通用高质量模型 |
| InkArt | `flux-kontext-pro` | 通用高质量模型 |

## 🔧 实现细节

### 代码逻辑
```typescript
// 1. 选择模型
const model = style === 'line-drawing' 
  ? "black-forest-labs/flux-kontext-dev" 
  : "black-forest-labs/flux-kontext-pro";

// 2. 记录日志
console.log(`Using model: ${model} for style: ${style}`);

// 3. 创建模型实例
const imageModel = replicate.image(model);
```

### 日志输出
API会在控制台输出使用的模型信息：
```
Using model: black-forest-labs/flux-kontext-dev for style: line-drawing
Using model: black-forest-labs/flux-kontext-pro for style: pencil-sketch
```

## 🎨 为什么这样设计？

### Line Drawing 的特殊性
- **线稿绘制**需要更精确的线条控制
- **flux-kontext-dev**模型可能对线条艺术有更好的优化
- **专用模型**能提供更准确的线稿效果

### 其他风格的统一性
- **flux-kontext-pro**是成熟的通用模型
- 适合处理各种复杂的绘画风格
- 保证一致的高质量输出

## 🔍 测试验证

### API测试
```bash
# 测试line-drawing风格
curl -X POST /api/gen-drawing \
  -d '{"style":"line-drawing",...}'
# 预期: 使用flux-kontext-dev模型

# 测试其他风格  
curl -X POST /api/gen-drawing \
  -d '{"style":"pencil-sketch",...}'
# 预期: 使用flux-kontext-pro模型
```

### 日志确认
检查服务器日志确认模型选择正确：
```
✅ Using model: black-forest-labs/flux-kontext-dev for style: line-drawing
✅ Using model: black-forest-labs/flux-kontext-pro for style: pencil-sketch
```

## 🚀 扩展性

如果需要为其他风格添加专用模型，只需修改选择逻辑：

```typescript
const getModelForStyle = (style: string): string => {
  switch (style) {
    case 'line-drawing':
      return "black-forest-labs/flux-kontext-dev";
    case 'watercolor-painting':
      return "watercolor-specialized-model";  // 假设的水彩专用模型
    default:
      return "black-forest-labs/flux-kontext-pro";
  }
};
```

这种设计保证了每种绘画风格都能使用最适合的AI模型，提供最佳的生成效果！
