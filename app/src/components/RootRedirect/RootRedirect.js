import React from 'react';
import { Redirect } from 'react-router-dom';
import { useUserState } from 'context';

const RootRedirect = () => {
  const { profile } = useUserState();

  if (profile && profile.trackingRepo) {
    return (<Redirect to={`/repo/${profile.primaryRepo}/dashboard`} />);
  } else {
    return (<Redirect to={`/setup/code-repository`} />);
  }
};

export default RootRedirect;
