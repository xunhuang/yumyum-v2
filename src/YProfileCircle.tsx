import { Avatar, Popover } from 'antd';
import { gapi } from 'gapi-script';
import { useEffect } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { atom, useRecoilState } from 'recoil';

const LoginUserProfileState = atom({
  key: "LoginUserProfile",
  default: null,
});

export const useProfile = () => {
  return useRecoilState<any>(LoginUserProfileState);
};

export const YProfileCircle = () => {
  const [profile, setProfile] = useRecoilState<any>(LoginUserProfileState);
  const clientId =
    "217254739278-lvhkh4717oabh6f7s8d79hdv3k619n8c.apps.googleusercontent.com";

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  });

  const onSuccess = (res: any) => {
    console.log(res);
    setProfile(res.profileObj);
  };

  const onFailure = (err: any) => {
    console.log("failed", err);
  };

  const logOut = () => {
    setProfile(null);
  };

  return (
    <div>
      {profile ? (
        <Popover
          content={
            <GoogleLogout
              clientId={clientId}
              buttonText="Log out"
              onLogoutSuccess={logOut}
            />
          }
          trigger="click"
        >
          <Avatar
            src={profile.imageUrl}
            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            alt="user"
          />
        </Popover>
      ) : (
        <GoogleLogin
          clientId={clientId}
          buttonText="Sign in"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        />
      )}
    </div>
  );
};
