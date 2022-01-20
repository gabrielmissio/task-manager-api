const { DYNAMODB_DOCUMENT_CLIENT } = require('../../../../main/confing/aws-resources');

class DynamodbClient {
  static async get(params) {
    const response = await DYNAMODB_DOCUMENT_CLIENT.get(params).promise();

    const error = this.getResponseError(response);
    if (error) throw new Error(error);

    return response;
  }

  static async query(params) {
    const response = await DYNAMODB_DOCUMENT_CLIENT.query(params).promise();

    const error = this.getResponseError(response);
    if (error) throw new Error(error);

    return response;
  }

  static getResponseError({ $response }) {
    return $response && $response.error;
  }
}

module.exports = DynamodbClient;
