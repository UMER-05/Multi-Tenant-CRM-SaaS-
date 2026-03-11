import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
  
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('profile::',profile)
      try {
        const email = profile.emails[0].value;

        const user = await User.findOne({ where: { email } });
      console.log('email::',email)

        if (!user) {
          return done(null, false, {
            message: "User not registered"
          });
        }

        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
