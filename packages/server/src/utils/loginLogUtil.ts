import * as useragent from 'useragent';
import IP2Region from 'ip2region';
import { Context } from '@server/context';

export const getUserAgent = (ctx: Context): useragent.Agent => {
  return useragent.parse(ctx.req.headers['user-agent'] as string);
};

export const getAddressByIp = (ip: string): string => {
  if (!ip) return '';

  const query = new IP2Region();
  const res = query.search(ip);
  return [res?.province, res?.city].join(' ');
};
