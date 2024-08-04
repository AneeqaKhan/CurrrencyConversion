// api.js
const API_URL = 'http://localhost:8000';
const API_KEY = '85f7ccfd-677a-4e5a-a5eb-21c19734edf7';

export const getExchangeRates = async (payload) => {
  try {
    const response = await fetch(`${API_URL}/rates/${payload}`, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    throw error;
  }
};
