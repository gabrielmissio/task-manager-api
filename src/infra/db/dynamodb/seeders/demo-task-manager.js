const { DYNAMODB_DOCUMENT_CLIENT } = require('../../../../main/confing/aws-resources');
const { TASK_MANAGER_TABLE_NAME, NODE_ENV } = require('../../../../main/confing/env');

const items = [
  {
    PK: 'USER#e2a138b7-409f-4092-864f-66c9b232555b',
    SK: 'PROFILE',
    name: 'John Smith',
    email: 'user@domain.com',
    password: '$2a$10$aT83xYBn5horL5rV76BT1enpxje/GkbwNia656qj2AzFguK28BM5q',
    createdAt: '2019-01-21T20:36:59.632Z'
  },
  {
    PK: 'USER#e2a138b7-409f-4092-864f-66c9b232555b',
    SK: 'BOOK#c7808a58-ddf9-42dd-b851-effc725e95a7',
    title: 'New Year Goals',
    description: 'Lore Ipsum',
    createdAt: '2019-01-21T20:36:59.632Z'
  },
  {
    PK: 'USER#e2a138b7-409f-4092-864f-66c9b232555b',
    SK: 'BOOK#7c870911-a0b6-4d06-897c-bbdd45faeb91',
    title: 'Carrer',
    description: 'Lore Ipsum',
    createdAt: '2019-01-21T20:36:59.632Z'
  },
  {
    PK: 'USER#e2a138b7-409f-4092-864f-66c9b232555b',
    SK: 'BOOK#c7808a58-ddf9-42dd-b851-effc725e95a7#TASK#1e66c9e3-522b-42bb-8648-906e404c73e8',
    description: 'Take a trip at least',
    isDone: false,
    createdAt: '2019-01-21T20:36:59.632Z'
  },
  {
    PK: 'USER#e2a138b7-409f-4092-864f-66c9b232555b',
    SK: 'BOOK#c7808a58-ddf9-42dd-b851-effc725e95a7#TASK#e4a20210-412b-4643-9f2a-1c68f03feace',
    description: 'Get in shape',
    isDone: false,
    createdAt: '2019-01-21T20:36:59.632Z'
  },
  {
    PK: 'USER#e2a138b7-409f-4092-864f-66c9b232555b',
    SK: 'BOOK#7c870911-a0b6-4d06-897c-bbdd45faeb91#TASK#b357e50a-3216-4041-9b9c-398bbcdc4d5d',
    description: 'Get an AWS certification',
    isDone: false,
    createdAt: '2019-01-21T20:36:59.632Z'
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
