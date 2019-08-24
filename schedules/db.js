var model = require('./../routes/model');
const schedule = require('pomelo-schedule');
function checkConnection () {
	if (!model || model.User === undefined) {
		console.log('connecting mongo ..')
		require('./../routes/model');
	}
};
schedule.scheduleJob("0 0 0/8 * * *", checkConnection, {name:'checkDbConnection'});