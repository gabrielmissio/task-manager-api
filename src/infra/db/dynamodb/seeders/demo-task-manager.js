const { DYNAMODB_DOCUMENT_CLIENT } = require('../../../../main/confing/aws-resources');
const { TASK_MANAGER_TABLE_NAME, NODE_ENV } = require('../../../../main/confing/env');

const items = [
  {
    PK: 'USER#001',
    SK: 'PROFILE',
    name: 'John Smith',
    email: 'user@domain.com'
  },
  {
    PK: 'USER#001',
    SK: 'BOOK#001',
    title: 'New Year Goals',
    description: 'Lore Ipsum'
  },
  {
    PK: 'USER#001',
    SK: 'BOOK#002',
    title: 'Carrer',
    description: 'Lore Ipsum'
  },
  {
    PK: 'USER#001',
    SK: 'BOOK#001#TASK#001',
    description: 'Take a trip at least',
    isDone: false
  },
  {
    PK: 'USER#001',
    SK: 'BOOK#001#TASK#002',
    description: 'Get in shape',
    isDone: false
  },
  {
    PK: 'USER#001',
    SK: 'BOOK#002#TASK#003',
    description: 'Get an AWS certification',
    isDone: false
  }
];

const putItems = () => {
  items.forEach(async (item) => {
    await DYNAMODB_DOCUMENT_CLIENT.put({
      TableName: TASK_MANAGER_TABLE_NAME,
      Item: item
    }).promise();

    console.log(`created item ${JSON.stringify(item)}`);
  });
};

const deleteItems = () => {
  items.forEach(async (item) => {
    await DYNAMODB_DOCUMENT_CLIENT.delete({
      TableName: TASK_MANAGER_TABLE_NAME,
      Key: {
        PK: item.PK,
        SK: item.SK
      }
    }).promise();

    console.log(`deleted item ${JSON.stringify(item)}`);
  });
};

const handler = () => {
  const operation = process.argv[2];
  const isProd = NODE_ENV === 'prod';

  if (operation === 'start') return !isProd ? putItems() : null;
  if (operation === 'undo') return !isProd ? deleteItems() : null;

  return console.log(`Invalid parameter: ${process.argv[2]}`);
};

handler();
