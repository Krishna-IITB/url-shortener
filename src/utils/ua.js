import useragent from 'useragent';

export function parseUserAgent(uaString = '') {
  const agent = useragent.parse(uaString);
  const browser = agent.family || null;

  const uaLower = uaString.toLowerCase();
  let device_type = 'desktop';
  if (uaLower.includes('mobile')) device_type = 'mobile';
  else if (uaLower.includes('tablet') || uaLower.includes('ipad')) device_type = 'tablet';

  return { browser, device_type };
}
