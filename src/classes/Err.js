'use strict';

/*
    Custom Error class
*/
module.exports = class Err {
    /**
     * 
     * @param {Number} httpStatus 
     * @param {String} name 
     * @param {String} message 
     */
    constructor(httpStatus, name, message) {
        this.name = name ?? 'Unknown';
        this.message = message ?? 'Unknown';
        this.httpStatus = httpStatus ?? 500;
    }

    setStatusCode(code) {
        this.httpStatus = code;
        return this;
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setMessage(message) {
        this.message = message;
        return this;
    }

    badRequest() {
        this.httpStatus = 400;
        return this;
    }

    unauthorized() {
        this.httpStatus = 401;
        return this;
    }

    notFound() {
        this.httpStatus = 404;
        return this;
    }

    // For not knowing what to input
    syntaxErr() {
        this.name = 'Syntax Error';
        return this;
    }

    // When they know what they have to input but they do it wrong
    inputErr() {
        this.name = 'Input Error';
        return this;
    }

    // Anything else
    otherErr() {
        this.name = 'Error';
        return this;
    }

    // User is not fast enough
    timeErr() {
        this.name = 'Timed Out';
        return this;
    }

    // Member was not found in the guild
    memberNotFound() {
        this.httpStatus = 404;
        this.message = 'Member not found';
        return this;
    }

    // User not found in user cache or guild
    userNotFound() {
        this.httpStatus = 404;
        this.message = 'User not found';
        return this;
    }

    // Channel not found
    channelNotFound() {
        this.httpStatus = 404;
        this.message = 'Channel not found';
        return this;
    }

    // User was not found after API user fetch
    userNotExists() {
        this.httpStatus = 404;
        this.message = 'User no longer exists';
        return this;
    }

    // Role not found in the guid
    roleNotFound() {
        this.httpStatus = 404;
        this.message = 'Role not found';
        return this;
    }

    // The role already exists
    roleAlreadyExists(appendable) {
        this.httpStatus = 400;
        this.message = 'Role already exists ' + appendable;
        return this;
    }

    // The channel already exists
    channelAlreadyExists(appendable) {
        this.httpStatus = 400;
        this.message = 'Channel already exists ' + appendable;
        return this;
    }

    // Input was not a number
    notANumber(whatIsNotANumber) {
        this.httpStatus = 400;
        this.message = whatIsNotANumber + ' is not a number';
        return this;
    }

    // Number input is was not a positive number
    notPositive(whatIsNotPositive) {
        this.httpStatus = 400;
        this.message = whatIsNotPositive + ' should be greater than zero';
        return this;
    }

    // Inputted raw json is not valid
    jsonNotValid() {
        this.message = 'JSON not valid';
        return this;
    }

    // Used when user input is time limited
    timedOut() {
        this.message = 'User took too long to respond';
        return this;
    }
};
