# 回退到免费版本（不使用 Cloudflare Image Resizing）

## 如果你不想付费使用 Cloudflare Image Resizing

### 选项 A: 保留懒加载，移除图片优化调用

只需修改 3 个文件，移除 `ImagePresets` 调用：

#### 1. `src/components/drawing-generator/style-selector.tsx`

```tsx
// 移除这行导入
import { ImagePresets } from '@/lib/image-optimizer';

// 修改图片标签
<img
  src={style.image}  // 改回原始 URL
  alt={style.name + " - Picture to Drawing style"}
  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
  loading="lazy"      // 保留
  decoding="async"    // 保留
/>
```

#### 2. `src/components/drawing-generator/style-preview.tsx`

```tsx
// 移除这行导入
import { ImagePresets } from '@/lib/image-optimizer';

// 修改图片标签
<img
  src={displayStyle.preview}  // 改回原始 URL
  alt={displayStyle.name + ' - Picture to Drawing Style Preview'}
  className="w-full h-full object-cover"
  loading="eager"         // 保留
  fetchPriority="high"    // 保留
  decoding="async"        // 保留
/>
```

#### 3. `src/components/drawing-generator/image-upload.tsx`

```tsx
// 移除这行导入
import { ImagePresets } from '@/lib/image-optimizer';

// 修改图片标签
<img
  src={sampleUrl}  // 改回原始 URL
  alt={t('drawing_generator.sample_alt', { index: index + 1 })}
  className="w-full h-full hover:scale-105 transition-transform object-cover"
  loading="lazy"      // 保留
  decoding="async"    // 保留
/>
```

**效果**：
- ✅ 仍然有懒加载优化（减少首屏请求）
- ✅ 完全免费
- ⚠️ 图片体积不会减小（仍然是原始大小）
- 预计优化效果：60-70%

---

### 选项 B: 手动优化图片 + 懒加载（推荐免费方案）

**步骤**：

1. **安装 sharp**
   ```bash
   npm install sharp
   ```

2. **运行优化脚本**
   ```bash
   npm run optimize:images
   ```

3. **上传优化后的图片到 R2**
   ```bash
   # 优化后的图片在 public/optimized/ 目录
   # 手动上传到 Cloudflare R2，保持相同的路径结构
   ```

4. **更新 `src/config/drawing-styles.ts`**
   ```typescript
   // 将 URL 指向优化后的图片
   {
     id: 'pencil-sketch',
     name: t('styles.pencil_sketch'),
     image: 'https://files.picturetodrawing.com/styles/thumbnails/pencil-sketch.webp',  // 新路径
     preview: 'https://files.picturetodrawing.com/styles/previews/sample-pencil-sketch.webp'  // 新路径
   }
   ```

5. **移除 ImagePresets 调用**（同选项 A）

**效果**：
- ✅ 图片体积减小 70-80%
- ✅ 懒加载优化
- ✅ 完全免费
- ⚠️ 需要手动维护（每次新增图片都要优化）
- 预计优化效果：80-85%

---

## 对比总结

| 方案 | 代码改动 | Cloudflare 配置 | 成本 | 效果 | 维护 |
|------|---------|----------------|------|------|------|
| **当前（我的修改）** | 已完成 | 需启用 Image Resizing | $5/月 | 96% | 零 |
| **选项 A（仅懒加载）** | 回退 3 个文件 | 无 | $0 | 60% | 低 |
| **选项 B（预优化）** | 回退 + 更新配置 | 无 | $0 | 85% | 中 |

---

## 我的建议

### 如果月访问量 < 5K
→ 使用**选项 B**（手动优化 + 懒加载）

### 如果月访问量 5K - 50K
→ 使用**当前方案**（Cloudflare Image Resizing，$5/月）

### 如果月访问量 > 50K
→ 使用**当前方案** + Cloudflare Pro（$20/月，性价比更高）

---

## 快速回退命令

如果你现在就想回退到完全免费版本：

```bash
# 1. 回退我的修改
git diff HEAD -- src/components/drawing-generator/

# 2. 如果满意，执行回退
git checkout HEAD -- src/components/drawing-generator/style-selector.tsx
git checkout HEAD -- src/components/drawing-generator/style-preview.tsx
git checkout HEAD -- src/components/drawing-generator/image-upload.tsx

# 3. 删除新增的文件（可选）
rm src/lib/image-optimizer.ts
rm cloudflare-worker-image-resize.js
rm scripts/optimize-images.js
```

**然后只保留 `loading="lazy"` 和 `decoding="async"` 属性即可。**
