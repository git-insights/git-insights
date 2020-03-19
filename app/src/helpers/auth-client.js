import client from './api-client';

function getUser() {
  return client('api/accounts').catch(error => {
    logout();
    return Promise.reject(error);
  })
}

function logout() {
  // remove tokens or other stuff
  return client('api/user/logout')
    .catch(error => {
      return Promise.reject(error);
    })
  // return Promise.resolve();
}

export default { getUser, logout }