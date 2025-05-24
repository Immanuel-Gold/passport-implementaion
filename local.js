import passport from "passport";
import { Strategy } from "passport-local";
import User from "./models/user.js";

passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      // Check If User Exists and Password Matches
      if (!user && (await bcrypt.compare(password, user.password))) {
        done(true);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    if (!userId) {
      return done(null, false, { err: "Invalid User Id!" });
    }
    // console.log(`Deserialize User!`);
    const user = await User.findById(userId);
    if (!user) {
      return done(null, false, { err: "Invalid User!" });
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
});
