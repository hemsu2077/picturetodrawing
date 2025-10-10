#!/bin/bash

# Script to check daily trials table and debug trial issues
# Usage: ./scripts/check-daily-trials.sh

echo "=== Daily Trials Debugging Script ==="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is not set"
    echo "Please set it in your .env file or export it"
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Check if table exists
echo "1. Checking if pic_to_dra_daily_trials table exists..."
TABLE_EXISTS=$(psql "$DATABASE_URL" -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'pic_to_dra_daily_trials');")

if [[ $TABLE_EXISTS == *"t"* ]]; then
    echo "✅ Table pic_to_dra_daily_trials exists"
else
    echo "❌ Table pic_to_dra_daily_trials does NOT exist"
    echo "   Run migrations: pnpm db:push or pnpm db:migrate"
    exit 1
fi
echo ""

# Check table structure
echo "2. Table structure:"
psql "$DATABASE_URL" -c "\d pic_to_dra_daily_trials"
echo ""

# Check constraints
echo "3. Checking unique constraints..."
psql "$DATABASE_URL" -c "SELECT conname, contype, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'pic_to_dra_daily_trials'::regclass;"
echo ""

# Count total records
echo "4. Total records in table:"
TOTAL=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM pic_to_dra_daily_trials;")
echo "   Total records: $TOTAL"
echo ""

# Show today's trials
TODAY=$(date +%Y-%m-%d)
echo "5. Trials for today ($TODAY):"
psql "$DATABASE_URL" -c "SELECT id, user_uuid, ip_address, trial_date, created_at FROM pic_to_dra_daily_trials WHERE trial_date = '$TODAY' ORDER BY created_at DESC;"
echo ""

# Show recent trials (last 5)
echo "6. Recent trials (last 5):"
psql "$DATABASE_URL" -c "SELECT id, user_uuid, ip_address, trial_date, created_at FROM pic_to_dra_daily_trials ORDER BY created_at DESC LIMIT 5;"
echo ""

echo "=== Debugging Tips ==="
echo "1. If table doesn't exist, run: pnpm db:push"
echo "2. Check server logs when generating images for detailed trial tracking"
echo "3. Look for [checkDailyTrial] and [recordDailyTrial] log entries"
echo "4. If trials are not being recorded, check database connection and permissions"
echo ""
