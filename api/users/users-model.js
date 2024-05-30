const db = require('../../data/db-config')

/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
async function find() {
  const users = await db('users')
    .select('user_id', 'username')
  return users
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
async function findBy(filter) {
  return db('users').where(filter)
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
async function findById(user_id) {
//   select
//     user_id, 
//     username
// from users
// where user_id = 1;
const [answer] = await db('users').select('user_id', 'username').where('user_id', user_id)
return answer;
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) {
//   insert into users (username, password)
// values('Thomas', );
  const [newUser] = await db('users').insert(user)
  return newUser;
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  add, 
  findById, 
  findBy,
  find
}
