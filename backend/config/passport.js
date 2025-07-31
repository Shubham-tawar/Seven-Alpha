const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

/**
 * Configure Passport with Google OAuth 2.0 strategy
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (user) {
          // Update user's last login
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        }

        // Check if user exists with the same email
        user = await User.findOne({ where: { email: profile.emails[0].value } });

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.isEmailVerified = true; // Auto-verify email for Google users
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        }

        // Create new user
        const newUser = await User.create({
          googleId: profile.id,
          firstName: profile.name.givenName || profile.displayName.split(' ')[0],
          lastName: profile.name.familyName || profile.displayName.split(' ').slice(1).join(' '),
          email: profile.emails[0].value,
          isEmailVerified: true, // Auto-verify email for Google users
          avatar: profile.photos[0].value,
          lastLogin: new Date()
        });

        return done(null, newUser);
      } catch (error) {
        console.error('Google auth error:', error);
        return done(error, null);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;