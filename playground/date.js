const moment = require('moment');
var createdAt = moment().valueOf();
console.log(createdAt);
var date = moment(createdAt);

console.log(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
