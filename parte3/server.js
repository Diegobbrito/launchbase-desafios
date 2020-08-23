const express = require('express');
const server = express();
const nunjucks = require('nunjucks');

const cursos = require('./data');

server.use(express.static('public'));

server.set("view engine", "njk");


nunjucks.configure("views", {
    express: server
});

server.listen(5000);

server.get("/about", (request, response) => {
    return response.render("about");
});

server.get("/courses", (request, response) => {
    const data = {
        links: [
            {name:"Github", url: "https://github.com"},
            {name:"Instagram", url: "https://instagram.com"},
            {name:"Facebook", url: "https://facebook.com"}
        ]
    }
    return response.render("courses", {items: cursos, data});
});

// server.get("/courses/:id", function(request, response) {
//     const id = request.params.id;
  
//     return res.send(`O id fornecido na rota é: ${id}`);
// });



server.get("/course/:id", function(request, response){
    const id = request.params.id;

    console.log(request.params);

    const curso = cursos.find(function(curso){
        return curso.id == id;
    });
    if(!curso){
        return response.send("Curso não encontrado");
    }
     return response.render("course", {item: curso});

});


server.use(function(request, response) {
    response.status(404).render("not-found");
});