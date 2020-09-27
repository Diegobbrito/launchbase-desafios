const express = require('express');
const routes = express.Router();

const users = require('./users')
const admin = require('./admin')
const HomeController = require('../app/controllers/HomeController');

routes.use('/users', users);
routes.use('/admin', admin);

routes.get("/", HomeController.index);

routes.get("/about", (request, response) => {
    return response.render("about");
});

routes.get("/recipes", HomeController.recipes);

routes.get("/recipe/:id", HomeController.show);

routes.use(function(request, response) {
    response.status(404).render("not-found");
});
module.exports = routes;