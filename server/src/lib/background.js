'use strict';

/**
 * Create a task for a given queue with an arbitrary payload.
 */
async function createTask(
  uri,
  payload = undefined, // The task HTTP request body
  project = process.env.GCP_PROJECT_ID, // Your GCP Project id
  queue = 'long-tasks', // Name of your Queue
  location = process.env.GCP_PROJECT_LOCATION, // The GCP region of your queue
) {
  // Imports the Google Cloud Tasks library.
  const {CloudTasksClient} = require('@google-cloud/tasks');

  // Instantiates a client.
  const client = new CloudTasksClient();

  // Construct the fully qualified queue name.
  const parent = client.queuePath(project, location, queue);

  const task = {
    appEngineHttpRequest: {
      httpMethod: 'POST',
      relativeUri: uri,
      headers: { 'Content-Type': 'application/json' },
    },
  };

  if (payload) {
    task.appEngineHttpRequest.body = Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  console.log('Sending task:');
  console.log(task);
  try {
    // Send create task request.
    const request = {parent, task};
    const [response] = await client.createTask(request);
    const name = response.name;
    console.log(`Created task ${name}`);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  createTask,
};
