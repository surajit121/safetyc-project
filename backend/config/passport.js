import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const configurePassport = () => {
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",");

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
        proxy: true // Required for correctly constructing callback URL behind proxy
      },
      async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0]?.value;

        if (!email) {
          return done(null, false, { message: "No email found" });
        }

        if (!adminEmails.includes(email)) {
          return done(null, false, { message: "Unauthorized email" });
        }

        const user = {
          googleId: profile.id,
          displayName: profile.displayName,
          email: email,
          photos: profile.photos
        };

        return done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

export default configurePassport;
