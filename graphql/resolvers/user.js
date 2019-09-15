//Models
const User = require('../../models/user');
//Module imports
const bcrypt = require('bcryptjs'); //Library to encrypt text.
const jwt = require('jsonwebtoken');
//Helpers
const { userData } = require('../../helpers/user');
const { deleted } = require('../../helpers/deleted');

//Exports the module, to allow external access.
module.exports = {
    users: async (args, req) => {
        //Authentication middleware
        if (!req.isAuth) {
            throw new Error(`Not authenticated`);
        }
        
        //Looking for the users
        const users = await User.find()
        try {
            //Retur the projects object.
            return users.map(user => {
                //Returning project data,.
                return userData(user);
            });
        } catch (error) {
            throw error;
        }
    },
    createUser: async (args, req) => {
        //Authentication middleware
        if (!req.isAuth) {
            throw new Error(`Not authenticated`);
        }

        try {
            //Looking for existing users.
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error(`User exists already.`);
            }

            //Create a secure pass encryption.
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            //Create a new user.
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword,
                name: args.userInput.name
            });

            const result = await user.save();
            return { ...result._doc };
        } catch (error) {
            throw error;
        }
    },
    updateUser: async (args, req) => {
        //Authentication middleware
        if (!req.isAuth) {
            throw new Error(`Not authenticated`);
        }

        try {
            //Create a secure pass encryption.
            const hashedPassword = await bcrypt.hash(args.password, 12);

            //Looking for existing users.
            const userUpdate = await User.findOneAndUpdate(
                { email: args.email },
                { $set: { password: hashedPassword } }
            );

            if (!userUpdate) {
                throw new Error(`User doesn't exists.`);
            }

            return { ...userUpdate._doc };
        } catch (error) {
            throw error;
        }
    },
    deleteUser: async (args, req) => {
        //Authentication middleware
        if (!req.isAuth) {
            throw new Error(`Not authenticated`);
        }

        try {
            //Looking for existing users.
            const userDelete = await User.findOneAndDelete(
                { email: args.email }
            );

            if (!userDelete) {
                throw new Error(`User doesn't exists.`);
            }

            return deleted();
        } catch (error) {
            throw error;
        }
    },
    login: async args => {
        try {
            const email = args.email;
            const password = args.password;
            const user = await User.findOne({ email: email });

            if (!user) {
                throw new Error(`User does not exists!`);
            }

            const isEqual = await bcrypt.compare(password, user.password);

            if (!isEqual) {
                throw new Error(`Password is incorrect`);
            }

            const token = jwt.sign({ userId: user.id, email: user.email }, 'westmountdevelopment', {
                expiresIn: '1h'
            });

            return {
                userId: user.id,
                token: token,
                tokenExpiration: 1
            };

        } catch (error) {
            throw error;
        }
    }
};