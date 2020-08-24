import authClient from './auth-client'

async function bootstrapAppData() {
  const data = await authClient.getUser();
  if (!data) {
    return { profile: null, repositories: null }
  }

  const { user: profile, user: { repos: repositories } } = data;

  delete data.user.repos;

  return { profile, repositories };
}

export default bootstrapAppData;
