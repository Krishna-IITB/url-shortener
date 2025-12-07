# Load Test Results - Day 15

## Baseline (before optimization)

# (Use your first ./load-test.sh run)
Requests/sec (12t, 1000c): 15271.51
Avg latency: 151.49 ms
Non-2xx (mostly 429): 434491

## After DB Pooling (max=20)

Requests/sec (12t, 1000c): 15716.27
Avg latency: 89.41 ms
Non-2xx (mostly 429): 445661

## After DB Pooling + Redis TTL

Requests/sec (12t, 1000c): 14470.76
Avg latency: 103.63 ms
Non-2xx (mostly 429): 409905

## Focused Shorten Test (/api/shorten, 4t, 200c)

Requests/sec: 17345.39
Avg latency: 12.39 ms  # p50 < 20 ms target

## Test Config

- 1000 concurrent connections (primary test)
- Duration: 30 seconds
- Threads: 12 for baseline, 4 for focused test
- Host: http://localhost:3000
