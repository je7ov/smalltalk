const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

const keys = require('./config/keys');
require('./models/User');
require('./models/Room');
// require('./services/passport');

mongoose.connect(keys.mongoURI);
mongoose.Promise = global.Promise;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
// app.use(passport.session());

const localLoginStrategy = require('./services/passport/local-login');
const localSignupStrategy = require('./services/passport/local-signup');
passport.use('local-login', localLoginStrategy);
passport.use('local-signup', localSignupStrategy);

const authCheckMiddleware = require('./middlewares/authCheck');
app.use('/api', authCheckMiddleware);

require('./routes/authRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (req, res) => {
    console.log('fallback');
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
