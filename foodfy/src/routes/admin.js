const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');
const RecipesController = require('../app/controllers/RecipesController');
const ChefsController = require('../app/controllers/ChefsController');
const ProfileController = require('../app/controllers/ProfileController');
const { onlyUsers } = require('../app/middlewares/session');

routes.get("/recipes", RecipesController.index); // Mostrar a lista de receitas
routes.get("/recipes/create", onlyUsers, RecipesController.create); // Mostrar formulário de nova receita
routes.get("/recipes/:id", onlyUsers, RecipesController.show); // Exibir detalhes de uma receita
routes.get("/recipes/:id/edit", onlyUsers, RecipesController.edit); // Mostrar formulário de edição de receita

routes.post("/recipes", multer.array("photos", 5), RecipesController.post); // Cadastrar nova receita
routes.put("/recipes", multer.array("photos", 5), RecipesController.put); // Editar uma receita
routes.delete("/recipes", RecipesController.delete); // Deletar uma receita

routes.get("/chefs", onlyUsers, ChefsController.index); // Mostrar a lista de receitas
routes.get("/chefs/create", onlyUsers, ChefsController.create); // Mostrar formulário de nova receita
routes.get("/chefs/:id", onlyUsers, ChefsController.show); // Exibir detalhes de uma receita
routes.get("/chefs/:id/edit", onlyUsers, ChefsController.edit); // Mostrar formulário de edição de receita

routes.post("/chefs", multer.array("photos", 1), ChefsController.post); // Cadastrar nova receita
routes.put("/chefs", multer.array("photos", 1), ChefsController.put); // Editar uma receita
routes.delete("/chefs", ChefsController.delete); // Deletar uma receita

// Rotas de perfil de um usuário logado
routes.get('/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
// routes.put('/profile', ProfileController.put)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
// routes.get('/users', UserController.list) //Mostrar a lista de usuários cadastrados
// routes.post('/users', UserController.post) //Cadastrar um usuário
// routes.put('/users', UserController.put) // Editar um usuário
// routes.delete('/users', UserController.delete) // Deletar um usuário

module.exports = routes;

