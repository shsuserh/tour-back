import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from '../config/env';

export const configurePassportStrategies = () => {
  // Google Strategy
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${env.BACKEND_URL}/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            return done(null, profile);
          } catch (error) {
            return done(error, false);
          }
        }
      )
    );
  }

  // Facebook Strategy - Removed due to review requirements

  // Instagram Strategy - Removed due to Facebook platform requirements

  // Note: We don't need serializeUser/deserializeUser since we're using session: false
};
