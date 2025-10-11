# R2 Upload Monitoring Guide

## Quick Reference

### Log Patterns to Monitor

#### 1. Retry Attempts (Warning - Expected)
```
[Storage] Upload retry 1/4 for picturetodrawing/inputs/input_1234567890.png: fetch failed
```
**Action**: Normal - automatic retry in progress
**Alert**: If retry rate > 10% of total uploads

#### 2. Critical Upload Failures (Error - Needs Attention)
```
[Critical] Failed to upload generated image: Error: ...
[Storage Error] Key: picturetodrawing/file.png, Size: 1234567 bytes, Error: ...
```
**Action**: Investigate immediately
**Alert**: Any occurrence in production

#### 3. Input Upload Failures (Error - User-Facing)
```
Failed to upload input image: Error: ...
Generation error: Error: Image upload timed out. Please try again...
```
**Action**: Check network/R2 status
**Alert**: If error rate > 5% of requests

### Key Metrics to Track

| Metric | Target | Alert Threshold | Priority |
|--------|--------|-----------------|----------|
| Upload success rate | > 99% | < 95% | High |
| Retry rate | < 10% | > 20% | Medium |
| Average upload time | < 2s | > 5s | Medium |
| P95 upload time | < 5s | > 10s | Low |
| Critical failures | 0 | > 5/hour | Critical |
| Timeout errors | < 1% | > 5% | High |

## Monitoring Queries

### For Vercel/Production Logs

#### Count Retry Attempts (Last Hour)
```
[Storage] Upload retry
```

#### Count Critical Failures (Last Hour)
```
[Critical] Failed to upload generated image
```

#### Count User-Facing Errors (Last Hour)
```
Generation error: Error:
```

#### Find Slow Uploads (> 10s)
```
[Storage] Upload retry 3/4
```

### For Local Development

#### Enable Verbose Logging
```bash
NODE_ENV=development npm run dev
```

#### Test Network Failures
```bash
# Simulate slow network (Chrome DevTools)
# Network tab → Throttling → Slow 3G

# Or use network-link-conditioner on Mac
```

## Error Categories

### Transient Errors (Auto-Retry)
- ✅ `ECONNRESET` - Connection reset
- ✅ `ETIMEDOUT` - Timeout
- ✅ `ENOTFOUND` - DNS failure
- ✅ `ECONNREFUSED` - Connection refused
- ✅ `fetch failed` - Generic fetch failure

**Expected Behavior**: Automatic retry with exponential backoff

### Permanent Errors (No Retry)
- ❌ `Bucket is required` - Configuration error
- ❌ `Upload failed: 403` - Permission error
- ❌ `Upload failed: 400` - Invalid request
- ❌ `No body in response` - Invalid response

**Expected Behavior**: Immediate failure with error message

## Debugging Workflow

### 1. User Reports Upload Failure

**Check:**
1. Recent error logs for that user/timestamp
2. R2 service status
3. Network connectivity issues
4. File size (> 10MB may timeout)

**Ask User:**
- What was the file size?
- Did they see any error message?
- Can they retry successfully?

### 2. High Retry Rate Detected

**Investigate:**
1. Check R2 status dashboard
2. Review recent deployments
3. Check for rate limiting
4. Verify network latency to R2

**Actions:**
- If R2 issue: Wait for resolution
- If rate limiting: Implement request throttling
- If latency: Consider regional R2 buckets

### 3. Critical Upload Failures

**Immediate Actions:**
1. Check R2 credentials/permissions
2. Verify R2 bucket exists and is accessible
3. Check storage quota/limits
4. Review recent config changes

**Escalation:**
- If credentials invalid: Update secrets
- If quota exceeded: Increase limits or cleanup
- If R2 outage: Enable fallback storage

## Health Check Script

Create a monitoring script to test R2 connectivity:

```bash
#!/bin/bash
# scripts/check-r2-health.sh

echo "Testing R2 upload connectivity..."

# Test upload
curl -X POST http://localhost:3000/api/gen-drawing \
  -H "Content-Type: application/json" \
  -d '{
    "style": "line-drawing",
    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "ratio": "1:1"
  }'

echo ""
echo "Check logs for any retry attempts or errors"
```

## Dashboard Recommendations

### Grafana/Datadog Panels

1. **Upload Success Rate** (Time Series)
   - Success vs Failure over time
   - Alert: < 95% success rate

2. **Retry Rate** (Gauge)
   - Percentage of uploads requiring retry
   - Alert: > 20% retry rate

3. **Error Distribution** (Pie Chart)
   - ECONNRESET vs ETIMEDOUT vs Other
   - Helps identify root cause

4. **Upload Latency** (Histogram)
   - P50, P95, P99 upload times
   - Alert: P95 > 10s

5. **Critical Failures** (Counter)
   - Count of [Critical] errors
   - Alert: > 5 per hour

## Alerting Rules

### High Priority
```yaml
- alert: HighUploadFailureRate
  expr: (upload_failures / upload_total) > 0.05
  for: 5m
  annotations:
    summary: "Upload failure rate above 5%"
    
- alert: CriticalUploadFailure
  expr: critical_upload_failures > 0
  for: 1m
  annotations:
    summary: "Critical upload failure detected"
```

### Medium Priority
```yaml
- alert: HighRetryRate
  expr: (upload_retries / upload_total) > 0.20
  for: 10m
  annotations:
    summary: "Upload retry rate above 20%"
    
- alert: SlowUploads
  expr: upload_duration_p95 > 10
  for: 5m
  annotations:
    summary: "P95 upload time above 10s"
```

## Common Issues & Solutions

### Issue: High ECONNRESET Rate

**Possible Causes:**
- R2 endpoint instability
- Network issues between server and R2
- Too many concurrent connections

**Solutions:**
1. Check R2 status page
2. Implement connection pooling
3. Add circuit breaker pattern
4. Consider regional R2 buckets

### Issue: Frequent Timeouts

**Possible Causes:**
- Large file sizes
- Slow network connection
- R2 performance degradation

**Solutions:**
1. Increase timeout for large files
2. Implement chunked uploads
3. Compress images before upload
4. Add file size limits

### Issue: Intermittent 403 Errors

**Possible Causes:**
- Expired credentials
- Clock skew (AWS signature)
- Bucket permissions changed

**Solutions:**
1. Verify R2 credentials are current
2. Check server time sync (NTP)
3. Verify bucket CORS/permissions
4. Rotate credentials if needed

## Testing Checklist

Before deploying to production:

- [ ] Test with various file sizes (1KB, 1MB, 10MB)
- [ ] Test with simulated network failures
- [ ] Test with slow network (3G throttling)
- [ ] Verify retry logs appear correctly
- [ ] Verify user-friendly error messages
- [ ] Test concurrent uploads (10+ simultaneous)
- [ ] Verify graceful degradation on failure
- [ ] Check memory usage during retries
- [ ] Verify no memory leaks on repeated failures
- [ ] Test timeout handling for large files

## Production Deployment

### Pre-Deployment
1. Review all changes in staging
2. Set up monitoring/alerting
3. Prepare rollback plan
4. Notify team of deployment

### Post-Deployment
1. Monitor error rates for 1 hour
2. Check retry rate trends
3. Verify no increase in failures
4. Review user feedback/reports

### Rollback Criteria
- Upload failure rate > 10%
- Critical errors > 10 per hour
- P95 latency > 30s
- User reports of data loss

## Contact & Escalation

### Internal Team
- **On-call engineer**: Check retry/error logs first
- **DevOps**: R2 credentials, network issues
- **Backend lead**: Code review, architecture decisions

### External Support
- **Cloudflare R2 Support**: For R2-specific issues
- **Vercel Support**: For deployment/runtime issues

## Additional Resources

- [R2 Status Page](https://www.cloudflarestatus.com/)
- [Vercel Logs](https://vercel.com/dashboard)
- [Error Tracking Dashboard](https://sentry.io) (if configured)
