import React, { createContext, useContext } from 'react';
import { useAuth } from './useAuth';
import { apiClient, objectToParams } from 'helpers';

const UserContext = createContext()

// Fetch repos user has access to
const fetchUserRepoPage = (page) => {
  const qs = {
    currentPage: page
  }
  return apiClient(`api/user/github-repos${objectToParams(qs)}`);
}

// User picks primary repo
const postUserPrimaryRepo = (repo) => {
  const options = {
    body: repo
  };
  return apiClient(`api/user/track-repo`, options)
}

function UserProvider(props) {
  const {
    data: { user },
  } = useAuth();

  const fns = {
    // put fns here
    fetchUserRepoPage,
    postUserPrimaryRepo,
  }

  return <UserContext.Provider value={{ user, fns }} {...props} />
}

function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserProvider`)
  }
  return context
}

export { UserProvider, useUser }
