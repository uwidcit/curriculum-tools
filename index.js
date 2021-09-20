const {getStats, backupData, getTopics} = require('./stats.js');


getTopics('topics-dump.csv').catch(console.error);