// utils/responseHelpers.js
const { parseJsonField } = require('./jsonHelpers');

const formatUserResponse = (user) => {
  if (!user) return null;
  
  return {
    ...user,
    notification: parseJsonField(user.notification),
    seenNotification: parseJsonField(user.seenNotification)
  };
};

const formatUsersResponse = (users) => {
  return users.map(user => formatUserResponse(user));
};

module.exports = { formatUserResponse, formatUsersResponse };