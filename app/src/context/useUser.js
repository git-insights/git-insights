import React, { createContext, useContext, useReducer } from 'react';
import { apiClient, createActionSet } from 'helpers';
import { useAuth } from './useAuth';

const UserStateContext = createContext();
const UserDispatchContext = createContext();

// Action Types
const CHANGE_PRIMARY_REPO = createActionSet('CHANGE_PRIMARY_REPO');
const GET_GITHUB_REPOSITORIES = createActionSet('GET_GITHUB_REPOSITORIES');
const ADD_REPOSITORIES_FROM_GITHUB = createActionSet('ADD_REPOSITORIES_FROM_GITHUB');
const REMOVE_REPOSITORY = createActionSet('REMOVE_REPOSITORY');
const CHANGE_REPOSITORY = 'CHANGE_REPOSITORY';

// Fetch repos user has access to
const getGithubRepositories = async (dispatch, excludedRepositories = []) => {
  dispatch({ type: GET_GITHUB_REPOSITORIES.PENDING });
  try {
    let repositories = await apiClient(`api/user/github-repos/all`);
    repositories = repositories.filter(repo => !excludedRepositories.some(excludedRepo => excludedRepo.id === repo.id));
    dispatch({ type: GET_GITHUB_REPOSITORIES.SUCCESS, payload: repositories });
  } catch (error) {
    dispatch({ type: GET_GITHUB_REPOSITORIES.ERROR, payload: error })
  }
}

// Changes Primary Repo
const changePrimaryRepo = async (dispatch, repo) => {
  dispatch({ type: CHANGE_PRIMARY_REPO.PENDING });
  try {
    const q = { owner: repo.owner.login, repo: repo.name };
    const options = { body: q };
    await apiClient(`api/user/track-repo`, options);
    dispatch({ type: CHANGE_PRIMARY_REPO.SUCCESS, payload: repo.id })
  } catch (error) {
    dispatch({ type: CHANGE_PRIMARY_REPO.ERROR, payload: error })
  }
}

// Add new repo
const addRepositories = async (dispatch, repositories) => {
  const wait = ms => new Promise(r => setTimeout(r, ms));

  dispatch({ type: ADD_REPOSITORIES_FROM_GITHUB.PENDING, payload: repositories });
  try {
    const repos = repositories.map(repo => ({
      owner: repo.full_name.split('/')[0],
      name: repo.name
    }));
    const options = {
      body: {
        repositories: repos,
        /* type: 'github' */
      }
    };
    await apiClient(`api/user/repositories`, options);

    let res;
    let reposToProcess = [...repositories];

    while (true) {
      // wait 1 second
      await wait(1000);

      res = await apiClient(`api/user/repositories`);

      // Reverse loop to avoid skipping element
      for (let idx = reposToProcess.length - 1; idx >= 0; --idx) {
        let remoteRepo = res.find(repo => reposToProcess[idx].full_name === repo.full_name);

        if (remoteRepo === undefined) throw new Error('Unexpected error');

        if (remoteRepo.processed === true) {
          dispatch({ type: CHANGE_REPOSITORY, payload: { id: reposToProcess[idx].id, item: { processed: true } } })
          reposToProcess.splice(idx, 1); // remove element
        }
      }

      // If there are no more repos to be processed, break
      if (reposToProcess.length === 0) break;
    }

    dispatch({ type: ADD_REPOSITORIES_FROM_GITHUB.SUCCESS });
  } catch (error) {
    dispatch({ type: ADD_REPOSITORIES_FROM_GITHUB.ERROR, payload: error })
  }
}

// Remove repo
const removeRepository = async (dispatch, repositoryId) => {
  dispatch({ type: REMOVE_REPOSITORY.PENDING });
  try {
    await apiClient(`api/repo/${repositoryId}`, { method: 'DELETE' });
    dispatch({ type: REMOVE_REPOSITORY.SUCCESS, payload: repositoryId });
  } catch (error) {
    dispatch({ type: REMOVE_REPOSITORY.ERROR, payload: error })
  }
}

function reducer(state, action) {
  switch (action.type) {
    case CHANGE_PRIMARY_REPO.PENDING:
      return {
        ...state,
      };
    case CHANGE_PRIMARY_REPO.SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          primaryRepo: action.payload,
          trackingRepo: true,
        }
      };
    case CHANGE_PRIMARY_REPO.ERROR:
      return {
        ...state,
      };
    case GET_GITHUB_REPOSITORIES.PENDING:
      return {
        ...state,
        statusOfGithubRepositories: 'pending',
      };
    case GET_GITHUB_REPOSITORIES.SUCCESS:
      return {
        ...state,
        githubRepositories: [...action.payload],
        statusOfGithubRepositories: 'resolved',
      };
    case GET_GITHUB_REPOSITORIES.ERROR:
      return {
        ...state,
        statusOfGithubRepositories: 'rejected',
        error: action.payload,
      };
    case ADD_REPOSITORIES_FROM_GITHUB.PENDING:
      return {
        ...state,
        repositories: [...state.repositories, ...action.payload],
        statusOfRepositories: 'pending',
      };
    case ADD_REPOSITORIES_FROM_GITHUB.SUCCESS:
      return {
        ...state,
        statusOfRepositories: 'resolved',
      };
    case ADD_REPOSITORIES_FROM_GITHUB.ERROR:
      return {
        ...state,
        statusOfRepositories: 'rejected',
        error: action.payload,
      };
    case REMOVE_REPOSITORY.PENDING:
      return {
        ...state,
        statusOfRepositories: 'pending',
      }
    case REMOVE_REPOSITORY.SUCCESS:
      return {
        ...state,
        repositories: state.repositories.filter(repo => {
          if (repo.id === action.payload) {
            return false;
          } else {
            return true;
          }
        }),
        statusOfRepositories: 'resolved',
      };
    case REMOVE_REPOSITORY.ERROR:
      return {
        ...state,
        statusOfRepositories: 'rejected',
        error: action.payload,
      }
    case CHANGE_REPOSITORY:
      return {
        ...state,
        repositories: state.repositories.map(repo => {
          // Don't touch the repo if it's not our repo
          if (repo.id !== action.payload.id) {
            return repo
          }

          // Return the updated repo
          return {
            ...repo,
            ...action.payload.item
          }
        })
      }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function UserProvider({children}) {
  const {
    data: {
      profile,
      repositories,
    },
  } = useAuth();

  /*
    Status enums are the following:
    'idle': The initial state
    'pending': Loading data
    'resolved': Data successfuly loaded
    'rejected': Error state
  */
  const initialState = {
    profile,
    repositories,
    githubRepositories: [],
    statusOfRepositories: 'idle',
    statusOfGithubRepositories: 'idle',
    error: '',
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  const context = useContext(UserStateContext)
  if (context === undefined) {
    throw new Error(`useUserState must be used within a UserProvider`)
  }
  return context
}

function useUserDispatch() {
  const context = useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error('useUserDispatch must be used within a UserProvider');
  }
  return context;
}

export {
  UserProvider,
  useUserState,
  useUserDispatch,
  changePrimaryRepo,
  getGithubRepositories,
  addRepositories,
  removeRepository,
}
