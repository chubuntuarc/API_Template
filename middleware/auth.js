const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //Check the Auth header
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }

    //Get the token
    const token = authHeader.split(' ')[1];
    if (!token || token === '') {
        req.isAuth = false;
        return next();
    }

    //Check the token string.
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'westmountdevelopment');
    } catch (error) {
        req.isAuth = false;
        return next();
    }

    //Check if token is correct.
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }

    //If is all ok, returns true.
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();

}