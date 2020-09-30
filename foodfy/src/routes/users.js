const express = require('express');
const routes = express.Router();
const UserController = require('../app/controllers/UserController');
const SessionController = require('../app/controllers/SessionController');
const ValidatorUser = require('../app/validators/user')

//Rotas de Login/Logout
routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionController.login)
routes.post('/logout', SessionController.logout)

//Rotas de reset de senha
// routes.get('/forgot-password', SessionController.forgotForm)
// routes.get('/password-reset', SessionController.resetForm)
// routes.post('/forgot-password', SessionController.forgot)
// routes.post('/password-reset', SessionController.reset)

//Registro de um usuário
routes.get('/register', UserController.registerForm)
routes.get('/', UserController.show)
routes.post('/register', ValidatorUser.post, UserController.post)

module.exports = routes;
