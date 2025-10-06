# Cloudflare 缓存配置指南

## 🎯 目标
优化 `files.picturetodrawing.com` 和 R2 存储的资源缓存，提升 LCP 性能。

## 📍 方案 1: Cloudflare Dashboard 配置（推荐）

### A. 为 files.picturetodrawing.com 配置缓存

1. **登录 Cloudflare Dashboard**
   - https://dash.cloudflare.com

2. **选择域名** `picturetodrawing.com`

3. **进入 Rules > Page Rules** 或 **Rules > Cache Rules**

4. **创建缓存规则**:
   ```
   URL Pattern: files.picturetodrawing.com/sample/*
   
   Settings:
   - Browser Cache TTL: 1 month (2592000 seconds)
   - Edge Cache TTL: 1 month
   - Cache Level: Cache Everything
   ```

5. **再创建一个规则**:
   ```
   URL Pattern: files.picturetodrawing.com/users/*
   
   Settings:
   - Browser Cache TTL: 1 month
   - Edge Cache TTL: 1 month
   - Cache Level: Cache Everything
   ```

### B. 为 R2 存储配置缓存

1. **进入 R2 > 您的 Bucket**

2. **Settings > Custom Domain**

3. **配置 Cache Control**:
   - 在 R2 bucket 设置中添加默认的 Cache-Control header
   - 或使用 Cloudflare Workers 添加 header

## 📍 方案 2: 使用 Cloudflare Workers（更灵活）

创建一个 Worker 来添加缓存 header：

```javascript
// cloudflare-worker.js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // 获取原始响应
    const response = await fetch(request);
    
    // 克隆响应以修改 headers
    const newResponse = new Response(response.body, response);
    
    // 为图片和视频添加长期缓存
    if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|mp4|webm)$/i)) {
      newResponse.headers.set('Cache-Control', 'public, max-age=2592000, immutable');
    }
    
    return newResponse;
  }
};
```

**部署步骤**:
1. Cloudflare Dashboard > Workers & Pages
2. Create Application > Create Worker
3. 粘贴上面的代码
4. Deploy
5. 在 files.picturetodrawing.com 的 DNS 设置中绑定这个 Worker

## 📍 方案 3: 使用 _headers 文件（如果支持）

如果您的 Cloudflare Pages 或存储支持 `_headers` 文件：

```
# _headers
/sample/*
  Cache-Control: public, max-age=2592000, immutable

/users/*
  Cache-Control: public, max-age=2592000, immutable

/styles/*
  Cache-Control: public, max-age=2592000, immutable
```

## 🧪 验证缓存是否生效

### 使用 curl 检查
```bash
# 检查 files.picturetodrawing.com
curl -I https://files.picturetodrawing.com/sample/example-color-pencil-drawing2.webp

# 应该看到:
# cache-control: public, max-age=2592000, immutable
# cf-cache-status: HIT (第二次请求时)
```

### 使用浏览器 DevTools
1. 打开 https://picturetodrawing.com
2. F12 > Network 标签
3. 刷新页面
4. 查看图片请求的 Response Headers
5. 检查 `cache-control` 和 `cf-cache-status`

## 📊 预期效果

配置后，Lighthouse 报告中的问题会改善：

**Before**:
```
使用高效的缓存生命周期 有望节省 3,627 KiB
/sample/draw-introduce.mp4 - 4小时缓存
/sample/example-*.webp - 4小时缓存
```

**After**:
```
✅ 缓存配置优化完成
所有静态资源缓存 30 天
```

## 💡 额外优化建议

### 1. 启用 Cloudflare 图片优化
在 Cloudflare Dashboard:
- Speed > Optimization > Image Optimization
- 启用 Polish (Lossless 或 Lossy)
- 启用 WebP 转换

### 2. 启用 Rocket Loader
- Speed > Optimization > Rocket Loader
- 可以延迟 JavaScript 加载

### 3. 启用 Auto Minify
- Speed > Optimization > Auto Minify
- 勾选 JavaScript, CSS, HTML

## 🎯 优先级

1. **高优先级**: 配置 files.picturetodrawing.com 的缓存（方案1或2）
2. **中优先级**: 配置 R2 的缓存
3. **低优先级**: 启用其他 Cloudflare 优化功能

---

**注意**: 配置完成后，需要清除 Cloudflare 缓存才能立即生效：
Caching > Configuration > Purge Everything
