import { Router } from 'express';
import * as HolaController from '../controllers/hola.controller';

const router = Router();

router.get('/', HolaController.getHelloWorld);
router.get('/hola/:nombre', HolaController.getPersonalizedHola);

export default router;