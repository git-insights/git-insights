const getRepoById = octokit => {
  octokit.registerEndpoints({
    repos: {
      getById: {
        method: 'GET',
        url: '/repositories/:id',
        params: {
          id: {
            type: 'string',
            required: true
          }
        }
      },
      listContributorsById: {
        method: 'GET',
        url: '/repositories/:id/contributors',
        params: {
          id: {
            type: 'string',
            required: true
          }
        }
      }
    }
  });
};

module.exports = {
  getRepoById
}