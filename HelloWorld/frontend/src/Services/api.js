import { API_BASE_URL } from '../config.js';

export async function sendApiMessage(method, message = null) {
  console.log("sendApiMessage will send message: ", message);

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Only include body for POST (or PUT/PATCH) requests
  if (method.toUpperCase() === 'POST' && message !== null) {
    options.body = JSON.stringify({ content: message });
    console.log("sendApiMessage STRINGIFIED body: ", options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/data/message`, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending API message:', error);
    throw error;
  }
}
