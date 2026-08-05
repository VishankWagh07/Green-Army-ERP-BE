import express from 'express'

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/refresh-token', refreshAccessToken);

router.get('/me', authenticate, me);

export default router;