import { Router } from 'express';
import { login, registro, verificarSesion, loginGoogle, resetPassword, forgotPassword } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/google', loginGoogle);
//router.post('/registro', registro);
//router.get('/verify', verificarSesion);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;