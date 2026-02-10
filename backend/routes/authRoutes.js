import express from "express";
import passport from "passport";

const router = express.Router();

// Redirect to Google for authentication
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

// Google callback URL
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      console.error("Google Auth Error:", err);
      return res.redirect(`${process.env.FRONTEND_URL}/admin/login?error=server_error`);
    }
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/admin/login?error=unauthorized`);
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error("Login Error:", err);
        return res.redirect(`${process.env.FRONTEND_URL}/admin/login?error=login_failed`);
      }
      return res.redirect(`${process.env.FRONTEND_URL}/admin`);
    });
  })(req, res, next);
});

// Get current user
router.get("/current_user", (req, res) => {
  res.send(req.user || null);
});

// Logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect(process.env.FRONTEND_URL || "/");
  });
});

export default router;
