import { Router } from 'express';
import {
  handshakeValidator,
  nativeSigninValidator,
  setPasswordValidator,
  signupValidator,
  web3SigninValidator,
} from './middleware';
import controller from './controllers';
const { handshake, signin, miscellanous } = controller;
const { setPasswaord } = miscellanous;

/**
 *
 * Router
 *
 */

export const authRouter: Router = Router();

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
authRouter.post('/signin/native', [nativeSigninValidator, signin.native]);

/**
 *
 * Miscellanous
 *
 */

authRouter.post('/misc/set-password', [setPasswordValidator, setPasswaord]);
