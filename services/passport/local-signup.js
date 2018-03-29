const User = require('mongoose').model('users');
const PassportLocalStrategy = require('passport-local').Strategy;

module.exports = new PassportLocalStrategy(async (username, password, done) => {
  const user = await new User({
    username: username.trim(),
    password: password.trim()
  })
    .save()
    .catch(err => done(err));

  return done(null);
});
