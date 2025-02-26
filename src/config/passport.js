// import passport from "passport";
// import GoogleStrategy from "passport-google-oauth20";
// import FacebookStrategy from "passport-facebook";
// import TwitterStrategy from "passport-twitter";
// import User from "../models/User.js";
// import dotenv from "dotenv";

// dotenv.config();

// const createOrUpdateUser = async (profile, done) => {
//   try {
//     let user = await User.findOne({ email: profile.emails[0].value });

//     if (!user) {
//       user = new User({
//         name: profile.displayName,
//         email: profile.emails[0].value,
//         password: "", // Password not required for OAuth
//         role: "wallOwner",
//       });
//       await user.save();
//     }

//     return done(null, user);
//   } catch (err) {
//     return done(err, null);
//   }
// };

// // Google Strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/api/auth/google/callback",
//       scope: ["profile", "email"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       await createOrUpdateUser(profile, done);
//     }
//   )
// );

// // Facebook Strategy
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: "/api/auth/facebook/callback",
//       profileFields: ["id", "displayName", "email"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       await createOrUpdateUser(profile, done);
//     }
//   )
// );

// // Twitter Strategy
// passport.use(
//   new TwitterStrategy(
//     {
//       consumerKey: process.env.TWITTER_CONSUMER_KEY,
//       consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
//       callbackURL: "/api/auth/twitter/callback",
//       includeEmail: true,
//     },
//     async (token, tokenSecret, profile, done) => {
//       await createOrUpdateUser(profile, done);
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   const user = await User.findById(id);
//   done(null, user);
// });
