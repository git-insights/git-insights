import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import {
  RouteWithLayout,
  PrivateRouteWithLayout,
  RootRedirect,
  GA,
} from './components';
import {
  Main as MainLayout,
  Minimal as MinimalLayout } from './layouts';
import {
  Dashboard as DashboardView,
  Code as CodeView,
  Reviews as ReviewsView,
  Issues as IssuesView,
  Account as AccountView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  SetupCodeRepository as SetupCodeRepositoryView,
  GithubCodeRepository as GithubCodeRepositoryView,
} from './views';

const Routes = () => {
  return (
    <>
      { GA.init() && <GA.RouteTracker /> }
      <Switch>
        <Route exact path="/">
          <RootRedirect/>
        </Route>
        <PrivateRouteWithLayout
          component={DashboardView}
          exact
          layout={MainLayout}
          path="/repo/:repoid/dashboard"
        />
        <PrivateRouteWithLayout
          component={CodeView}
          exact
          layout={MainLayout}
          path="/repo/:repoid/code"
        />
        <PrivateRouteWithLayout
          component={ReviewsView}
          exact
          layout={MainLayout}
          path="/repo/:repoid/reviews"
        />
        <PrivateRouteWithLayout
          component={IssuesView}
          exact
          layout={MainLayout}
          path="/repo/:repoid/issues"
        />
        <PrivateRouteWithLayout
          component={SetupCodeRepositoryView}
          exact
          layout={MinimalLayout}
          path="/setup/code-repository"
        />
        <PrivateRouteWithLayout
          component={GithubCodeRepositoryView}
          exact
          layout={MinimalLayout}
          path="/setup/code-repository/github"
        />
        <PrivateRouteWithLayout
          component={AccountView}
          exact
          layout={MainLayout}
          path="/settings"
        />
        <Route
          exact
          path="/sign-in"
          render={matchProps => (<SignInView {...matchProps} />)}
        />
        <RouteWithLayout
          component={NotFoundView}
          exact
          layout={MinimalLayout}
          path="/not-found"
        />
        <Redirect to="/not-found" />
      </Switch>
    </>
  );
};

export default Routes;
