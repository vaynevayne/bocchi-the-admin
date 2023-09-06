import backgroundUrl from '@/assets/images/background.jpg';
import trpc, { RouterInput } from '@/trpc';
import { setToken } from '@/utils/authUtil';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginFormPage, ProFormText } from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import './index.less';

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="login-container">
      <LoginFormPage<RouterInput['userRouter']['signIn']>
        backgroundImageUrl={backgroundUrl}
        title="Lotus-Admin"
        subTitle="轻量级的全栈后台模板"
        onFinish={async (value) => {
          trpc.userRouter.signIn.mutate(value).then((res) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            res?.authorization && setToken(res?.authorization);
            navigate('/home');
          });
        }}
      >
        <ProFormText
          name="username"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={'prefixIcon'} />,
          }}
          placeholder={'请输入用户名'}
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder={'请输入密码'}
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
      </LoginFormPage>
    </div>
  );
};
export default Login;
