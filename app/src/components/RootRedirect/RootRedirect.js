import React from 'react';
import { Redirect } from 'react-router-dom';
import { useUser } from 'context';

const RootRedirect = () => {
  const { user } = useUser();

  if (user && user.trackingRepo) {
    return (<Redirect to={`/repo/${user.primaryRepo}/dashboard`} />);
  } else {
    return (<Redirect to={`/setup/code-repository`} />);
  }
};

export default RootRedirect;
