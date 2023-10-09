import { z } from 'zod';

/////////////////////////////////////////
// LOGIN LOG SCHEMA
/////////////////////////////////////////

export const LoginLogSchema = z.object({
  id: z.number().int(),
  accountId: z.number().int(),
  ip: z.string(),
  address: z.string().nullish(),
  browser: z.string().nullish(),
  os: z.string().nullish(),
  status: z.boolean().nullish(),
  message: z.string().nullish(),
  username: z.string(),
})

export type LoginLog = z.infer<typeof LoginLogSchema>

/////////////////////////////////////////
// LOGIN LOG PARTIAL SCHEMA
/////////////////////////////////////////

export const LoginLogPartialSchema = LoginLogSchema.partial()

export type LoginLogPartial = z.infer<typeof LoginLogPartialSchema>

/////////////////////////////////////////
// LOGIN LOG OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const LoginLogOptionalDefaultsSchema = LoginLogSchema.merge(z.object({
  id: z.number().int().optional(),
}))

export type LoginLogOptionalDefaults = z.infer<typeof LoginLogOptionalDefaultsSchema>

export default LoginLogSchema;
