const axios = require('axios');

const makeRequest = async (url) => {
  try {
    const res = await axios({ method: 'get', url });
    return res.data;
  } catch (error) {
    return error.response;
  }
};

module.exports = {
  makeRequest,
};
