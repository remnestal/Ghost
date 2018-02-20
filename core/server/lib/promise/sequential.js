/**
 * 
 * # Execute a number of tasks with a single argument in sequential order 
 * 
 */
var Promise = require('bluebird');

function pipeline(tasks, options) {
    // Iterate through the tasks with options as arg
    return Promise.reduce(tasks, function (arg, task) {
        return task(options);
    }, options);
}

module.exports = pipeline;
