/**
 * Error class for an API response outside the 200 range
 *
 * @param {number} status - the status code of the API response
 * @param {string} statusText - the status text of the API response
 * @param {object} response - the parsed JSON response of the API server if the
 *  'Content-Type' header signals a JSON response
 */
class ApiError extends Error {
  constructor(status, statusText, response) {
    super();
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.response = response;
    this.message = `${status} - ${statusText}`;
  }

  async toHumanString() {
    try {
      switch (this.status) {
        case 403:
          return `You don't have access: ${await this.response.json().message}`;
        case 404:
          return `Some page is missing: ${await this.response.json().message}`;
        case 400:
          return `You posted some invalid data, contact the administration team: ${await this.response.json().message}`;
        case 500:
          return `The server crashed, contact the administration team: ${await this.response.json().message}`;
        default:
          return this.toString();
      }
    }
    catch (e) {
      return this.toString();
    }
  }
}

// eslint-disable-next-line import/prefer-default-export
export { ApiError };
