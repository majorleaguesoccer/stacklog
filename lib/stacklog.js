'use strict';

/*!
 * Constants
 */
var _defaultBd = '['
, _defaultEd = ']'
;

/**
 * Bind the passed logger object by wrapping each
 * function in a proxy. Returns a function that can
 * be called with new.
 *
 * @param {Object} logger
 * @param {Object} options
 * @return {Function} new StackLog instance
 */

function StackLog(logger, options) {
  var self = this;
  self.options = options || {};

  // Add push noop
  logger.push = push;

  return function (prefix) {
    self.prefix = addDelimiters(prefix, self.options);
    Object.keys(logger).forEach(function(k) {
      if (typeof logger[k] === 'function') {
        self[k] = self.wrap(self.prefix, logger[k], logger);
      }
    });

    return self;
  };
}


/**
 * Creates a prefixed logger function
 *
 * @param {String} prefix
 * @param {Function} logFunction
 * @param {Object} logger
 * @return {Function} logger proxy function
 */

StackLog.prototype.wrap = function (prefix, logFunction, logger) {
  var self = this;
  return function() {
    var stack = prefix;
    var args = arguments;

    if (arguments[0]) {

      if (logFunction === push || typeof arguments[1] !== 'undefined') {
        stack += addDelimiters(arguments[0], self.options);
        args = Array.prototype.slice.call(arguments, 1);
      }

      args[0] = stack + ' ' + args[0];

    } else if (arguments.length < 1) {
      // No arguments passed so just pass the stack
      args = [stack];
    } else {
      // First arg is null so keep the current stack
      args[0] = stack;
    }

    // Call the requested function with the prefix
    logFunction.apply(this, args);

    // Create a new proxy object with the stacked prefixes and return it
    var logProxy = {};

    Object.keys(logger).forEach(function(k) {
      if (typeof logger[k] === 'function') {
        logProxy[k] = self.wrap(stack, logger[k], logger);
      }
    });

    return logProxy;
  };
};

/*!
 * Private Methods
 */

/**
 * Wrap the prefix with delimiters
 */
function addDelimiters(prefix, options) {
  options = options || {};
  return (options.bd || _defaultBd)
    + prefix
    + (options.ed || _defaultEd);
}

/**
 * Noop function to push a level on the stack w/o logging
 */
function push() {}


/*!
 * Module exports.
 */

module.exports = StackLog;
