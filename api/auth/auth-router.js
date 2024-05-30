// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const express = require('express')
const router = express.Router()
const Middle = require('../auth/auth-middleware')

const User = require('../users/users-model')

const bcrypt = require('bcryptjs')

router.post('/register', Middle.checkUsernameFree, Middle.checkPasswordLength, async (req, res) => {
  const {username, password} = req.body
  const hash = bcrypt.hashSync( password, 10)
  const newUser = {
    username: username,
    password: hash
  }
  const result = await User.add(newUser)
  const position = await User.findById(result)
  res.status(200).json(position)
})


/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */

  router.post('/login', Middle.checkUsernameExists, Middle.checkPasswordLength, (req, res) => {
    const { password } = req.body
    if (bcrypt.compareSync(password, req.user.password)) {
      req.session.user = req.user
      res.json({ message: `Welcome ${req.user.username}!` });
    } else {
      res.status(401).json({ message: 'invalid credentials' });
    }
  })


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */
router.get('/logout', (req, res) => {
  if (req.session.user) {
    console.log('in the if ')
    req.session.destroy( err => {
      console.log('in the destroy')
      if (err) {
        console.log('error ');
        res.json({message: 'you can never leave!'})
      } else {
        console.log('session destroyed ');
        res.json({message: 'logged out'})
      }
    })
  } else {
    console.log('in the else ');
    res.json({message: 'no session'})
  }
})

 
// Don't forget to add the router to the `exports` object so it can be required in other modules

module.exports = router
