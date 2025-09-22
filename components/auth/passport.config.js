const passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth20'),
  User = require('../user/user.model');

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL
} = process.env;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK_URL,
  scope: ['profile', 'email'],
  state: true
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({googleId: profile.id});

    if (!user) {
      user = await User.create({
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0].value,
        username: profile.emails[0].value.split('@')[0],
        provider: 'google'
      })
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}))
