const bcrypt = require('bcryptjs');

const hashed = '$2a$10$5vkcQQpxUDHu1aThuvCSp.wW4y7OI/X2KK01jBJuhp8ptxVkPzb42'; // from your DB
const inputPassword = '123'; // replace with the password you type to login

bcrypt.compare(inputPassword, hashed, (err, res) => {
  if (err) throw err;
  console.log('Password match?', res);
});
