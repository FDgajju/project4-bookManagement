let mongoose = require('mongoose')

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
};

const isValidTitle = function (title) {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}

const isValidMobileNum = function (value) {
    if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(value))) {
        return false
    }
    return true
}

const isValidEmail = function (value) {
    if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(value))) {
        return false
    }
    return true
}

const pincodelen = function (value) {
    if (value.length != 6) {
        return false
    }
    return true
}

module.exports = { isValidRequestBody, isValid, isValidObjectId, isValidTitle, isValidMobileNum, isValidEmail, pincodelen }