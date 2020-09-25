const express = require('express');
const routes = express.Router();
const multer = require('./app/middlewares/multer');
const recipes = require('./app/controllers/RecipesController');
const home = require('./app/controllers/HomeController');
const chefs = require('./app/controllers/ChefsController');
const HomeController = require('./app/controllers/HomeController');

routes.get("/", home.index)


routes.get("/about", (request, response) => {
    return response.render("about");
});

routes.get("/recipes", HomeController.recipes);

routes.get("/recipe/:id", HomeController.show);



routes.get("/admin/recipes", recipes.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", recipes.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipes.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", recipes.edit); // Mostrar formulário de edição de receita

routes.post("/admin/recipes", multer.array("photos", 5), recipes.post); // Cadastrar nova receita
routes.put("/admin/recipes", multer.array("photos", 5), recipes.put); // Editar uma receita
routes.delete("/admin/recipes", recipes.delete); // Deletar uma receita

routes.get("/admin/chefs", chefs.index); // Mostrar a lista de receitas
routes.get("/admin/chefs/create", chefs.create); // Mostrar formulário de nova receita
routes.get("/admin/chefs/:id", chefs.show); // Exibir detalhes de uma receita
routes.get("/admin/chefs/:id/edit", chefs.edit); // Mostrar formulário de edição de receita

routes.post("/admin/chefs", multer.array("photos", 1), chefs.post); // Cadastrar nova receita
routes.put("/admin/chefs", multer.array("photos", 1), chefs.put); // Editar uma receita
routes.delete("/admin/chefs", chefs.delete); // Deletar uma receita

routes.use(function(request, response) {
    response.status(404).render("not-found");
});
module.exports = routes;