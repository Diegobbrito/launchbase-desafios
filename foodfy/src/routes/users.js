const express = require('express');
const routes = express.Router();
const UserController = require('../app/controllers/UserController');
const SessionController = require('../app/controllers/SessionController');
const UserValidator = require('../app/validators/user');
const SessionValidator = require('../app/validators/session');
const { isLoggedRedirectToUsers, onlyUsers } = require('../app/middlewares/session'); 

//Rotas de Login/Logout
routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm);
routes.post('/login', SessionValidator.login, SessionController.login);
routes.post('/logout', SessionController.logout);

//Rotas de reset de senha
routes.get('/forgot-password', SessionController.forgotForm);
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot);
routes.get('/password-reset', SessionController.resetForm);
routes.post('/password-reset', SessionValidator.reset, SessionController.reset);

routes.get('/create-password', UserController.createPassword);
routes.post('/create-password', SessionValidator.createPassword, SessionController.reset);

//Registro de um usuário
routes.get('/register', onlyUsers, UserController.registerForm);
routes.put('/', UserValidator.update, UserController.update);
routes.get('/', onlyUsers, UserController.show);
routes.post('/register', UserValidator.post, UserController.post);

module.exports = routes;
