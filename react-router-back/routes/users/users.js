var express = require('express');
var router = express.Router();
let userController = require('./controllers/userController')
const requireAuthStrategy = require('../../passport/passport')
const passport = require('passport')

/* GET users listing. */
router.get('/', passport.authenticate('jwt-user', { session: false }), function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/sign-up', userController.signup)
// router.post('/sign-in', requireAuthStrategy("local"), userController.signin)
router.post('/sign-in', userController.signIn)



module.exports = router;


// router.get('/get-all-users', function (req, res, next) {
//   res.json(users)
// });

// router.get('/get-user-by-id/:id', function (req, res, next) {
//   let userId = req.params.id
//   let foundUser = users.filter(user => user.id == userId)
//   if (foundUser.length > 0) {
//     res.json(foundUser);
//   } else {
//     res.status(404).send('User not found!')
//   }
// });

// router.get('/get-user-by-id/:id', function (req, res, next) {
//   res.json(users)
// });
// let users = [
//   {
//     id: 1,
//     name: "butts",
//     hobbies: "gaming",
//     occupation: "fuccboi"
//   },
//   {
//     id: 2,
//     name: "bofaDeez",
//     hobbies: "gaming",
//     occupation: "fuccboi Ninja"
//   },
//   {
//     id: 5,
//     name: "MelonTits",
//     hobbies: "gaming",
//     occupation: "fuccboi Skillz"
//   }
// ]