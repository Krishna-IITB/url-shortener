wrk.method = "POST"
wrk.headers["Content-Type"] = "application/json"
wrk.headers["X-Forwarded-For"] = "1.2.3.4"

local urls = {
  '{"url": "https://example.com"}',
  '{"url": "https://google.com"}',
  '{"url": "https://github.com"}',
  '{"url": "https://stackoverflow.com"}'
}

request = function()
  local payload = urls[math.random(#urls)]
  wrk.body = payload
  return wrk.format(nil, nil, nil, payload)
end
