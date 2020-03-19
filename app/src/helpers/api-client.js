function client(endpoint, {body, ...customConfig} = {}) {
  const headers = {
    'content-type': 'application/json',
  }
  const config = {
    method: body ? 'POST' : 'GET',
    'credentials': 'include',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }
  if (body) {
    config.body = JSON.stringify(body)
  }

  return window
    .fetch(`${process.env.REACT_APP_API_SERVER}/${endpoint}`, config)
    .then(r => r.json())
}

export default client
