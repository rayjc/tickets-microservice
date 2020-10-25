import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  // notify browser to drop jwt cookie
  if (req.session?.jwt) {
    delete req.session.jwt;
  }

  res.json({ message: "Token removed" });
});


export { router as signoutRouter };