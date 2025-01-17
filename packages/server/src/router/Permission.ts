import { router } from '../initTRPC';
import authProcedure from '../procedure/auth';
import AuthTree from '@bta/common/AuthTree';

const permissionRouter = router({
  getAuthTree: authProcedure
    .meta({
      permission: AuthTree.permissionModule.code,
    })
    .query(() => AuthTree),
});

export default permissionRouter;
