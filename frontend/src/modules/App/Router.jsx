import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Alert from "../Alert";
import QRCodeDisplay from "../QRCodeDisplay";
import Login from "../Login";
import Home from "../Home";

import { useWeb3 } from "../../common/providers/Web3.provider";
import { getItem } from "../../common/utils/storage";

function AuthenticatedRoute({ component: C, appProps, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        appProps.token ? <C {...props} {...appProps} /> : <Redirect to="/" />
      }
    />
  );
}

function UnAuthenticated({ component: C, appProps, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        !appProps.token ? (
          <C {...props} {...appProps} />
        ) : (
          <Redirect to="/app" />
        )
      }
    />
  );
}

export default function Router() {
  const [{ address, loginType, token }] = useWeb3();
  const [user, setUser] = useState({ address, loginType, token });

  useEffect(() => {
    updateState();
  }, [address, loginType]);

  const updateState = () => {
    setUser({
      address,
      token: getItem("token") || token,
      loginType
    });
  };
  return (
    <>
      <Switch>
        <UnAuthenticated appProps={user} path="/" component={Login} exact />
        <AuthenticatedRoute appProps={user} path="/app" component={Home} />
        <Redirect from="*" to="/" />
      </Switch>
      <Alert />
      <QRCodeDisplay />
    </>
  );
}
