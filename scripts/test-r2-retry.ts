/**
 * Test script for R2 retry logic
 * Run with: npx tsx scripts/test-r2-retry.ts
 */

import { retryWithBackoff, RetryPresets } from '../src/lib/retry';

// Test 1: Successful operation (no retry)
async function testSuccess() {
  console.log('\n=== Test 1: Successful Operation ===');
  let attempts = 0;
  
  const result = await retryWithBackoff(
    async () => {
      attempts++;
      console.log(`Attempt ${attempts}: Success`);
      return 'Success!';
    },
    RetryPresets.fast
  );
  
  console.log(`Result: ${result}`);
  console.log(`Total attempts: ${attempts}`);
  console.assert(attempts === 1, 'Should succeed on first attempt');
}

// Test 2: Transient failure then success
async function testTransientFailure() {
  console.log('\n=== Test 2: Transient Failure (Retry Success) ===');
  let attempts = 0;
  
  const result = await retryWithBackoff(
    async () => {
      attempts++;
      console.log(`Attempt ${attempts}`);
      
      if (attempts < 3) {
        const error = new Error('fetch failed');
        (error as any).cause = { code: 'ECONNRESET' };
        throw error;
      }
      
      return 'Success after retries!';
    },
    {
      ...RetryPresets.fast,
      onRetry: (error, attempt) => {
        console.log(`  → Retrying after error: ${error.message}`);
      }
    }
  );
  
  console.log(`Result: ${result}`);
  console.log(`Total attempts: ${attempts}`);
  console.assert(attempts === 3, 'Should succeed on third attempt');
}

// Test 3: Permanent failure (no retry)
async function testPermanentFailure() {
  console.log('\n=== Test 3: Permanent Failure (No Retry) ===');
  let attempts = 0;
  
  try {
    await retryWithBackoff(
      async () => {
        attempts++;
        console.log(`Attempt ${attempts}`);
        throw new Error('Bucket is required');
      },
      RetryPresets.fast
    );
    console.error('Should have thrown error!');
  } catch (error) {
    console.log(`Caught error: ${error instanceof Error ? error.message : error}`);
    console.log(`Total attempts: ${attempts}`);
    console.assert(attempts === 1, 'Should not retry permanent errors');
  }
}

// Test 4: Timeout
async function testTimeout() {
  console.log('\n=== Test 4: Timeout ===');
  let attempts = 0;
  
  try {
    await retryWithBackoff(
      async () => {
        attempts++;
        console.log(`Attempt ${attempts}: Sleeping for 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return 'Should not reach here';
      },
      {
        maxAttempts: 2,
        initialDelayMs: 500,
        timeout: 1000, // 1 second timeout
        retryableErrors: ['Operation timed out'],
      }
    );
    console.error('Should have thrown timeout error!');
  } catch (error) {
    console.log(`Caught error: ${error instanceof Error ? error.message : error}`);
    console.log(`Total attempts: ${attempts}`);
    console.assert(attempts === 2, 'Should retry on timeout');
  }
}

// Test 5: Max retries exhausted
async function testMaxRetries() {
  console.log('\n=== Test 5: Max Retries Exhausted ===');
  let attempts = 0;
  
  try {
    await retryWithBackoff(
      async () => {
        attempts++;
        console.log(`Attempt ${attempts}`);
        const error = new Error('fetch failed');
        (error as any).code = 'ECONNRESET';
        throw error;
      },
      {
        maxAttempts: 3,
        initialDelayMs: 100,
        maxDelayMs: 500,
        timeout: 5000,
        retryableErrors: ['ECONNRESET'],
        onRetry: (error, attempt) => {
          console.log(`  → Retry ${attempt}/3`);
        }
      }
    );
    console.error('Should have thrown error after max retries!');
  } catch (error) {
    console.log(`Caught error: ${error instanceof Error ? error.message : error}`);
    console.log(`Total attempts: ${attempts}`);
    console.assert(attempts === 3, 'Should exhaust all retries');
  }
}

// Test 6: Exponential backoff timing
async function testBackoffTiming() {
  console.log('\n=== Test 6: Exponential Backoff Timing ===');
  const delays: number[] = [];
  let lastTime = Date.now();
  
  try {
    await retryWithBackoff(
      async () => {
        const now = Date.now();
        const delay = now - lastTime;
        if (delays.length > 0) {
          delays.push(delay);
          console.log(`Delay before attempt ${delays.length + 1}: ${delay}ms`);
        }
        lastTime = now;
        
        const error = new Error('fetch failed');
        (error as any).code = 'ECONNRESET';
        throw error;
      },
      {
        maxAttempts: 4,
        initialDelayMs: 1000,
        maxDelayMs: 10000,
        backoffMultiplier: 2,
        timeout: 5000,
        retryableErrors: ['ECONNRESET'],
      }
    );
  } catch (error) {
    console.log('\nDelay progression:');
    delays.forEach((delay, i) => {
      console.log(`  Retry ${i + 1}: ${delay}ms`);
    });
    
    // Verify exponential growth (with jitter tolerance)
    console.assert(delays[0] >= 750 && delays[0] <= 1250, 'First delay ~1000ms ±25%');
    console.assert(delays[1] >= 1500 && delays[1] <= 2500, 'Second delay ~2000ms ±25%');
    console.assert(delays[2] >= 3000 && delays[2] <= 5000, 'Third delay ~4000ms ±25%');
  }
}

// Run all tests
async function runTests() {
  console.log('🧪 Testing R2 Retry Logic\n');
  console.log('='.repeat(50));
  
  try {
    await testSuccess();
    await testTransientFailure();
    await testPermanentFailure();
    await testTimeout();
    await testMaxRetries();
    await testBackoffTiming();
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('\n' + '='.repeat(50));
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

runTests();
