const express = require('express');
const routes = express.Router();
const multer = require('../app/middlewares/multer');
const recipes = require('../app/controllers/RecipesController');
const chefs = require('../app/controllers/ChefsController');


routes.get("/recipes", recipes.index); // Mostrar a lista de receitas
routes.get("/recipes/create", recipes.create); // Mostrar formulário de nova receita
routes.get("/recipes/:id", recipes.show); // Exibir detalhes de uma receita
routes.get("/recipes/:id/edit", recipes.edit); // Mostrar formulário de edição de receita

routes.post("/recipes", multer.array("photos", 5), recipes.post); // Cadastrar nova receita
routes.put("/recipes", multer.array("photos", 5), recipes.put); // Editar uma receita
routes.delete("/recipes", recipes.delete); // Deletar uma receita

routes.get("/chefs", chefs.index); // Mostrar a lista de receitas
routes.get("/chefs/create", chefs.create); // Mostrar formulário de nova receita
routes.get("/chefs/:id", chefs.show); // Exibir detalhes de uma receita
routes.get("/chefs/:id/edit", chefs.edit); // Mostrar formulário de edição de receita

routes.post("/chefs", multer.array("photos", 1), chefs.post); // Cadastrar nova receita
routes.put("/chefs", multer.array("photos", 1), chefs.put); // Editar uma receita
routes.delete("/chefs", chefs.delete); // Deletar uma receita

// Rotas de perfil de um usuário logado
// routes.get('/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
// routes.put('/profile', ProfileController.put)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
// routes.get('/users', UserController.list) //Mostrar a lista de usuários cadastrados
// routes.post('/users', UserController.post) //Cadastrar um usuário
// routes.put('/users', UserController.put) // Editar um usuário
// routes.delete('/users', UserController.delete) // Deletar um usuário

module.exports = routes;

