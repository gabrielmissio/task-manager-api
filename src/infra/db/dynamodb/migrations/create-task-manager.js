const { DYNAMODB } = require('../../../../main/confing/aws-resources');
const { TASK_MANAGER_TABLE_NAME, NODE_ENV } = require('../../../../main/confing/env');

const params = {
  TableName: TASK_MANAGER_TABLE_NAME,
  AttributeDefinitions: [
    {
      AttributeName: 'PK',
      AttributeType: 'S'
    },
    {
      AttributeName: 'SK',
      AttributeType: 'S'
    },
    {
      AttributeName: 'email',
      AttributeType: 'S'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'PK',
      KeyType: 'HASH'
    },
    {
      AttributeName: 'SK',
      KeyType: 'RANGE'
    }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'email-index',
      KeySchema: [
        {
          AttributeName: 'email',
          KeyType: 'HASH'
        }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
};

const createTable = async () => {
  const response = await DYNAMODB.createTable(params).promise();
  console.log(JSON.stringify(response));
};

const deleteTable = async () => {
  const response = await DYNAMODB.deleteTable({ TableName: TASK_MANAGER_TABLE_NAME }).promise();
  console.log(JSON.stringify(response));
};

const handler = () => {
  const operation = process.argv[2];
  if (operation === 'start') return createTable();

  const isDevOrTest = NODE_ENV === 'dev' || NODE_ENV === 'test';
  if (operation === 'undo') return isDevOrTest ? deleteTable() : null;

  return console.log(`Invalid parameter: ${process.argv[2]}`);
};

handler();
