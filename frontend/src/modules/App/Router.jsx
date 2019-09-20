import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";

import Alert from "../Alert";
import Login from "../Login";

import web3Connect from "../../common/utils/web3/Connectors";

function Router() {
  useEffect(() => {
    web3Connect.on("connect", provider => {
      console.log(provider);
    });
  });
  return (
    <>
      <Switch>
        <Route exact path="/" component={Login} />
      </Switch>
      <Alert />
    </>
  );
}

export default Router;
