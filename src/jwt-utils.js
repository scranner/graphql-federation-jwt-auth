const jwt = require('jsonwebtoken');

const secret = 'secret';

const sign = (data) => {
    return jwt.sign({ ...data }, secret);
};

const decode = (token) => {
    if (token) {
        return { ...jwt.verify(token, secret) }
    }
    return undefined;
};


module.exports = { sign, decode };