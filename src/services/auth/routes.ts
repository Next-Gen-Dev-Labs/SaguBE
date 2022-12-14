import { Router } from 'express';
import {
  handshakeValidator,
  signupValidator,
  socialsValidator,
  web3SigninValidator,
} from './middleware';
import controller from './controllers';
import { validateContentType } from '../../commons';
const { handshake, signin } = controller;

/**
 *
 * Router
 *
 */

export const authRouter: Router = Router();
authRouter.use(validateContentType);

/**
 *
 * Signups
 *
 */

authRouter.post('/handshake/signup', [handshakeValidator, handshake.signup]);
authRouter.post('/signup/generic', [signupValidator, controller.signup]);

/**
 *
 * Signins
 *
 */

authRouter.post('/handshake/signin', [handshakeValidator, handshake.signin]);
authRouter.post('/signin/web3', [web3SigninValidator, signin.web3]);

/**
 *
 * Misc
 *
 */

authRouter.post('/misc/add-socials', [socialsValidator, controller.addSocials]);
