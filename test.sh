#!/bin/bash

echo "Test 1: 50 requests starting..."

for i in {1..50}
do
  curl -X POST https://url-shortener-production-9379.up.railway.app/api/shorten \
    -H "Content-Type: application/json" \
    -d '{"url":"https://example.com/load-'$i'"}' &
done

wait
echo "✅ 50 requests done!"

echo ""
echo "Test 2: 100 requests starting..."

for i in {1..100}
do
  curl -X POST https://url-shortener-production-9379.up.railway.app/api/shorten \
    -H "Content-Type: application/json" \
    -d '{"url":"https://example.com/stress-'$i'"}' &
done

wait
echo "✅ 100 requests done!"
echo "🎉 All tests complete!"

