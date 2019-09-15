//Arrow funtion to work with project data.
const userData = user => {
    return {
        ...user._doc,
        _id: user.id
    };
};

//Make the functions public.
exports.userData = userData;