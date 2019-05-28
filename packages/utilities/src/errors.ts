/**
 * Error class for an API response outside the 200 range
 *
 * @param {number} statusCode - the status code of the API response
 * @param {string} statusText - the status text of the API response
 * @param {object} response - the parsed JSON response of the API server if the
 *  'Content-Type' header signals a JSON response
 */
export class ApiError extends Error {

  private statusText: string;

  private response: ResponseInit;

  constructor(status: number, statusText: string, response: Response) {
    super();
    this.name = 'ApiError';
    this.statusText = statusText;
    this.response = response;
    this.message = `${status} - ${statusText}`;
  }

  static errorToHumanString(error) {
    if (error.name === 'ApiError') {
      return ApiError.toHumanString(error);
    }
    return error.toString();
  }

  static async toHumanString(error) {
    try {
      switch (error.status) {
        case 403:
          return `You don't have access: ${
            (await error.response.json()).message
          } Maybe you aren't logged in.`;
        case 404:
          return `Some page is missing: ${
            (await error.response.json()).message
          }`;
        case 400:
          return `You posted some invalid data, contact the administration team: ${
            (await error.response.json()).message
          }`;
        case 500:
          return `The server crashed, contact the administration team: ${
            (await error.response.json()).message
          }`;
        default:
          return error.toString();
      }
    } catch (e) {
      return error.toString();
    }
  }
}

