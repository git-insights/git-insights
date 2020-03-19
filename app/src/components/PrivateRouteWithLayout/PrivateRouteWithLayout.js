import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useUser } from 'context';

const PrivateRouteWithLayout = props => {
  const { layout: Layout, component: Component, ...rest } = props;
  const { user } = useUser();

  if (user) {
    return (
      <Route
        {...rest}
        render={matchProps =>
          (
          <Layout>
            <Component {...matchProps} />
          </Layout>
          )
        }
      />
    );
  } else {
    return (
      <Route
        {...rest}
        render={matchProps =><Redirect to="/sign-in" />}
      />
    )
  }
};

PrivateRouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default PrivateRouteWithLayout;
