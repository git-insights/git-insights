import React, { createContext, useContext, useState, useLayoutEffect } from 'react';
import { FullPageSpinner } from 'components';
import { bootstrapAppData } from 'helpers';
import authClient from 'helpers/auth-client';
import { useAsync } from 'react-async';

const AuthContext = createContext();

function AuthProvider(props) {
  const [firstAttemptFinished, setFirstAttemptFinished] = useState(false)
  const {
    data = { profile: null, repositories: null },
    error,
    isRejected,
    isPending,
    isSettled,
    reload,
  } = useAsync({
    promiseFn: bootstrapAppData,
  });

  useLayoutEffect(() => {
    if (isSettled) {
      setFirstAttemptFinished(true)
    }
  }, [isSettled])

  if (!firstAttemptFinished) {
    if (isPending) {
      return <FullPageSpinner />
    }
    if (isRejected) {
      return (
        <div css={{color: 'red'}}>
          <p>Uh oh... There's a problem. Try refreshing the app.</p>
          <pre>{error.message}</pre>
        </div>
      )
    }
  }

  // const login = form => authClient.login(form).then(reload)
  // const register = form => authClient.register(form).then(reload)

  const login = () => undefined;
  const register = () => undefined;
  const logout = () => authClient.logout().then(reload);

  return (
    <AuthContext.Provider value={{data, login, logout, register}} {...props} />
  )
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth }
