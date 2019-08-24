const moment = require('moment')
module.exports = {
    numbering: function(){
        let formatNumber = moment().format('YYYYMMDD')
        return formatNumber
    }
}