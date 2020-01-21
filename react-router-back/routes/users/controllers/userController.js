const User = require('../models/Users');
const dbErrorMessage = require('../../helpers/dbErrorMessage')
const authHelper = require('../../helpers/authHelper')
const bcrypt = require('bcryptjs')


module.exports = {
    signup: async (req, res) => {

        try {
            let createdUser = await new User({
                email: req.body.email,
                password: req.body.password,
                username: req.body.username
            });
            let salt = await bcrypt.genSalt(12)
            let hash = await bcrypt.hash(createdUser.password, salt)
            createdUser.password = hash;
            await createdUser.save()

            res.json({
                message: "success"
            });
        }
        catch (e) {
            res.status(400).json({
                message: dbErrorMessage(e)
            });
        }
    },
    // signin: async (req, res) => {
    //     res.status(200).json({ token: req.user.generateToken() });
    // },
    signIn: async (req, res) => {
        try {
            let foundUser = await User.findOne({ username: req.body.username });
            if (foundUser === null) {
                throw "Something is wrong with User / Pass"
            }
            let comparedPassword = await authHelper.comparePassword(req.body.password, foundUser.password)

            if (comparedPassword === 409) {

                throw "Something is wrong with User / Pass"

            } else {
                let jwtToken = await authHelper.createJwtToken(foundUser);
                console.log(jwtToken);

                res.status(200).json({
                    token: jwtToken
                })

            }

        } catch (e) {
            console.log(e)
            res.status(400).json({
                message: e
            });
        }
    }
}