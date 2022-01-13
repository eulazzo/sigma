const aws = require("aws-sdk");
const dynamoDBClient = new aws.DynamoDB();

const tableName = process.env.USERTABLE;

exports.handler = async (event) => {
  // insert code to be executed by your lambda trigger.
  //trigger by cognito

  //when the user has the email confirmed then we're going to save
  //his data on DYNAMO DB

  if (!event?.request?.userAttributes?.sub) {
    console.log("No sub provided!");
    return;
  }

  const now = new Date();
  const timestamp = now.getTime();

  const userItem = {
    __typename: { S: "User" },
    _lastChangedAt: { N: timestamp.toString() },
    _version: { N: "1" },
    updatedAt: { S: now.toISOString() },
    createdAt: { S: now.toISOString() },
    name: { S: event.request.userAttributes.email },
    id: { S: event.request.userAttributes.sub },
  };

  const params = {
    Item: userItem,
    TableName: tableName,
  };

  //Save a new user to DynamoDb
  try {
    await dynamoDBClient.putItem(params).promise();
    console.log("Success")
  } catch (error) {
    console.log(error)
  }
};