import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import {
  RouteWithLayout,
  PrivateRouteWithLayout,
  RootRedirect
} from './components';
import {
  Main as MainLayout,
  Minimal as MinimalLayout } from './layouts';
import {
  Dashboard as DashboardView,
  Code as CodeView,
  Reviews as ReviewsView,
  Issues as IssuesView,
  Settings as SettingsView,
  Account as AccountView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  Test as TestView,
  SetupCodeRepository as SetupCodeRepositoryView,
  GithubCodeRepository as GithubCodeRepositoryView,
} from './views';

const Routes = () => {
  return (
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
      {/* <PrivateRouteWithLayout
        component={TestView}
        exact
        layout={MainLayout}
        path="/private"
      />
      <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path="/users"
      />
      <RouteWithLayout
        component={ProductListView}
        exact
        layout={MainLayout}
        path="/products"
      />
      <RouteWithLayout
        component={TypographyView}
        exact
        layout={MainLayout}
        path="/typography"
      />
      <RouteWithLayout
        component={IconsView}
        exact
        layout={MainLayout}
        path="/icons"
      />
      <RouteWithLayout
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account"
      />
      <RouteWithLayout
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/sign-up"
      />
      <RouteWithLayout
        component={TestView}
        exact
        layout={MainLayout}
        path="/test"
      /> */}
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
  );
};

export default Routes;
