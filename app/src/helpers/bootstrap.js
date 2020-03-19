import authClient from './auth-client'

async function bootstrapAppData() {
  const data = await authClient.getUser();
  if (!data) {
    return { user: null }
  }
  const { user } = data;
  return { user };
}

export default bootstrapAppData;
