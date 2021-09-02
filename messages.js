const moment = require("moment");

function formateMessage(username, text) {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
  };
}

// export default formateMessage;
module.exports = formateMessage;
