import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { getItem } from "../../common/utils/storage";

import Alert from "../Alert";
import QR from "../QR";
import Login from "../Login";

import Home from "../Home";

function AuthenticatedRoute({ component: C, appProps, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        appProps ? <C {...props} {...appProps} /> : <Redirect to="/" />
      }
    />
  );
}

function UnAuthenticated({ component: C, appProps, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        !appProps ? <C {...props} {...appProps} /> : <Redirect to="/app" />
      }
    />
  );
}

function Router() {
  let user = getItem("address");
  return (
    <>
      <Switch>
        <UnAuthenticated appProps={user} path="/" component={Login} exact />
        <AuthenticatedRoute appProps={user} path="/app" component={Home} />
      </Switch>
      <Alert />
      <QR />
    </>
  );
}

export default Router;
