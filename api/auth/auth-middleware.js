const UserModel = require('../users/users-model')

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
//     response:
//   status 200
//   [
//     {
//       "user_id": 1,
//       "username": "bob"
//     },
//     // etc
//   ]

//   response on non-authenticated:
//   status 401
//   {
//     "message": "You shall not pass!"
//   }
if (!req.session.user) {
  res.status(401).json({message: 'You shall not pass!'})
} else {
  next()
}
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  const { username } = req.body
  const [answer] = await UserModel.findBy({username: username})
  if (answer) {
    res.status(422).json({message: 'Username taken'})
  } else {
    next()
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  const {username} = req.body
  const find = {
    username: username
  }
  const [answer] = await UserModel.findBy(find)
  
  if (answer) {
    req.user = answer
    next()
  } else {
    res.status(401).json({message: 'Invalid credentials'})
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  const { password } = req.body
  if (!password || password.length <= 3) {
    res.status(422).json({message: 'Password must be longer that 3 chars'})
  } else {
    next()
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
  restricted
}
