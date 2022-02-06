<h1 align="center">TASK-MANAGER-API</h1>


<p align="center"> Restful Nodejs API for easy task management! 🚀</p>





## Overview



Lorem Ipsum is simply dummy text of the printing and typesetting industry.




## Stack



 - [Nodejs (v 14.17)](https://nodejs.org/en/)
 - [npm (v 6.14)](https://www.npmjs.com/)
 - [Docker](https://www.docker.com/)
 - [Serverless Framework](https://www.serverless.com/)
 - [DynamoDB](https://aws.amazon.com/dynamodb)
 - [AWS lambda](https://aws.amazon.com/lambda)
 - [AWS-SDK](https://www.npmjs.com/package/aws-sdk)
 - [Express](https://www.npmjs.com/package/express)
 - [Husky](https://www.npmjs.com/package/husky)
 - [ESLint](https://www.npmjs.com/package/eslint)
 - [Jest](https://www.npmjs.com/package/jest)
 - [Joi](https://www.npmjs.com/package/joi)
 - ...




## Project anatomy



```
app
 └ __mocks__                        → Source folder for mock dependencies 
 └ __test__                         → Source folder for unit, integration and features tests
 └ .husky                           → Source folder for husky hook scripts
 └ my-dynamodb-data (generated)     → Dynamodb-Local data
 └ node_modules (generated)         → NPM dependencies
 └ src                              → Application sources 
    └ domain                           → Application services layer
       └ services                         → Application business rules 
    └ infra                            → Application infrastructure layer
       └ db                               → Application data handler
          └ dynamodb                         → Dynamodb implementation
             └ factories                        → Adapters between dynamodb data and application entities
             └ helpers                          → Dynamodb implementation helpers
             └ migrations                       → Module for creating and removing dynamodb tables
             └ repositories                     → Operation to put, read and remove data in dynamodb tables
             └ seeders                          → Module for inserting and removing data in dynamodb tables
       └ helpers                          → Infrastructure helpers
    └ main                             → Application main layer
       └ adapters                         → adpters
       └ config                           → config
       └ factories                        → Application component builders
       └ middlewares                      → middlewares
       └ routers                          → routes
    └ presentation                     → Application presentation layer
       └ controllers                      → Application requests handler
       └ errors                           → Presentation errors
       └ helpers                          → Presentation helpers
       └ validations                      → Request schema validations
    └ utils                            → Application utils
       └ enums                            → enums
       └ errors                           → errors
       └ helpers                          → helpers
       └ regular-expressions              → regular expressions
 └ index.js                         → Application entry point
 └ ...                              → Other files
 ```




## Run Locally




### Install dependencies


```bash
npm install
```



### Initialize in-memory database


```bash
npm run start-dynamodb
```



### Run tests



Unit Tests




```bash
npm run test-unit
```




Integration Tests



```bash
npm run test-integration
```



Feature Tests



```bash
npm run test-feature
```



Coverage Test ( performs all the above tests)




```bash
npm run test-coverage
```



### Create tables



```bash
npm run start-dynamodb-migrations
```




### Run seeders





```bash
npm run start-dynamodb-seeders
```




### Start API

 

```bash
npm run start-dev
```


## License



[LICENSE](/LICENSE)
