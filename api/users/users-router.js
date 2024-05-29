// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const express = require('express')
const router = express.Router()

const Model = require('./users-model')

router.get('/', async (req, res) => {
  const answer = await Model.find()
  res.status(200).json(answer)
})


/**
  [GET] /api/users

  This endpoint is RESTRICTED: only authenticated clients
  should have access.

  response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response on non-authenticated:
  status 401
  {
    "message": "You shall not pass!"
  }
 */


// Don't forget to add the router to the `exports` object so it can be required in other modules

module.exports = router
