import { LoginLog } from './../constants/zodSchema/modelSchema/LoginLogSchema';
import publicProcedure from '@server/procedure/public';
import { router } from '@server/initTRPC';
import z from 'zod';
import prisma from '../repository';
import JWTUtil from '../utils/JWTUtil';
import _ from 'lodash';
import { exclude, paramsToFilter } from '../utils/objectUtils';
import { throwTRPCBadRequestError } from '../utils/ErrorUtil';
import authProcedure from '../procedure/auth';
import {
  SortOrderSchema,
  UserOptionalDefaults,
  UserOptionalDefaultsSchema,
  UserPartialSchema,
  UserSchema,
} from '../constants/zodSchema';
import AuthTree from '@bta/common/AuthTree';
import { getAddressByIp, getUserAgent } from '@server/utils/LoginLogUtil';

const userRouter = router({
  signIn: publicProcedure
    .input(
      z.object({
        account: z.string().max(15),
        password: z
          .string()
          .regex(
            /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,15}$/,
            '密码必须包含数字与字母且大于6位小于15位',
          ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let account = await prisma.account.findFirst({
        where: {
          password: input.password,
          OR: [
            {
              account: input.account,
            },
            {
              phoneNumber: input.account,
            },
            {
              email: input.account,
            },
          ],
        },
        include: {
          user: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!account) {
        // 不存在则创建
        const creacted = await prisma.account
          .create({
            data: {
              account: input.account,
              password: input.password,
            },
            include: {
              user: true,
            },
          })
          .catch((err) => console.error('creacted:err', err));
        console.log('creacted', creacted);
        account = creacted as any;
      }

      console.log('account', account);

      // 记录登录日志

      try {
        console.log('loginlog');

        const createdLog = await prisma.loginLog.create({
          data: {
            ip: ctx.req.ip,
            username: account?.account,
            address: getAddressByIp(ctx.req.ip),
            browser: getUserAgent(ctx).family,
            os: getUserAgent(ctx).os.toString(),
            account: {
              connect: {
                id: account?.id,
              },
            },
          },
        });
        console.log('createdLog', createdLog);
      } catch (err) {
        console.error('...', err);
      }

      return account
        ? {
            user: account.user,
            authorization: JWTUtil.encode({ id: account.user[0]?.id }),
          }
        : throwTRPCBadRequestError('登陆失败，请检查用户名或密码是否正确');
    }),

  getUserInfoByToken: authProcedure.query(({ ctx }) => ctx.user),
  queryUsers: authProcedure
    .meta({
      permission: AuthTree.userModule.code,
    })
    .input(
      z.object({
        sort: z.record(UserSchema.keyof(), SortOrderSchema).optional(),
        filter: UserPartialSchema.optional(),
        page: z.object({
          current: z.number(),
          pageSize: z.number(),
        }),
      }),
    )
    .query(async ({ input: { sort, filter, page } }) => {
      const filterParams = paramsToFilter(filter || {});

      const result = await prisma.$transaction([
        prisma.user.findMany({
          skip: (page.current - 1) * page.pageSize,
          take: page.pageSize,
          orderBy: sort,
          where: filterParams,
        }),

        prisma.user.count({
          where: filterParams,
        }),
      ]);
      return {
        data: result[0],
        count: result[1],
      };
    }),

  updateUser: authProcedure
    .meta({
      permission: AuthTree.userModule.update.code,
    })
    .input(UserPartialSchema.required({ id: true, version: true }))
    .mutation(async ({ input: user }) => {
      await prisma.user.updateWithVersion({
        where: {
          id: user.id,
        },
        data: user,
      });
    }),

  createUser: authProcedure
    .meta({
      permission: AuthTree.userModule.create.code,
    })
    .input(UserOptionalDefaultsSchema)
    .mutation(async ({ input }) => {
      await prisma.user.create({
        data: input,
      });
    }),

  deleteUser: authProcedure
    .meta({
      permission: AuthTree.userModule.delete.code,
    })
    .input(z.number())
    .mutation(async ({ input }) => {
      await prisma.user.delete({
        where: {
          id: input,
        },
      });
    }),
});

export default userRouter;
