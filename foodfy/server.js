const express = require('express');
const server = express();
const nunjucks = require('nunjucks');

nunjucks.configure("views", {
    express: server
});
server.listen(5000);

const recipes = require('./data');

server.use(express.static('public'));

server.set("view engine", "njk");

server.get("/", (request, response) => {
    return response.render("index", {recipes});
});

server.get("/about", (request, response) => {
    return response.render("about");
});

server.get("/recipes", (request, response) => {
    return response.render("recipes", {recipes});
});

server.get("/recipe/:id", function (request, response) {
    const id = request.params.id;


    const recipe = recipes.find(function(recipe){
        return recipe.id == id;
    });

    if(!recipe){
        return response.send("Receita não encontrada");
    }
    
    response.render("recipe", {recipe});
  })

server.use(function(request, response) {
    response.status(404).render("not-found");
});