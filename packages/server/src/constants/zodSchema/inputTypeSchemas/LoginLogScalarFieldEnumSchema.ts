import { z } from 'zod';

export const LoginLogScalarFieldEnumSchema = z.enum(['id','accountId','ip','address','browser','os','status','message','username']);

export default LoginLogScalarFieldEnumSchema;
