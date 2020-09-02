const Recipes = require('../models/Recipes');

module.exports = {

    // (request, response) => {

//     console.log(recipes)
// });
    
    indexAll(request, response){
    let { filter, page, limit } = request.query;

    page = page || 1;
    limit = limit || 5;

    let offset =  limit * (page - 1);

    const params = {
        filter,
        page,
        limit,
        offset,
        callback(recipes){
            const pagination = {
                total: Math.ceil(recipes[0].total / limit),
                page
            }
            return response.render("recipes/index", { recipes, pagination,  filter });
        }
    }

    Recipes.paginate(params);

    // Recipes.all(function(recipes){    
    //     recipes.map((recipe)=>{
    //         recipe.education_level = grade(recipe.education_level);
    //     });
    //     return response.render("recipes/index", { recipes });
    // });      
    },
    
    index(request, response){
    let { filter, page, limit } = request.query;

    page = page || 1;
    limit = limit || 5;

    let offset =  limit * (page - 1);

    const params = {
        filter,
        page,
        limit,
        offset,
        callback(recipes){
            const pagination = {
                total: Math.ceil(recipes[0].total / limit),
                page
            }
            return response.render("admin/recipes/index", { recipes, pagination,  filter });

        }
    }

    Recipes.paginate(params);

    // Recipes.all(function(recipes){    
    //     recipes.map((recipe)=>{
    //         recipe.education_level = grade(recipe.education_level);
    //     });
    //     return response.render("recipes/index", { recipes });
    // });      
    },

    create(request, response){

        Recipes.chefsSelectOptions(function(options){
            return response.render("admin/recipes/create", { chefOptions: options});
        });
    },

    post(request, response){
        const keys = Object.keys(request.body);

        const created_at = Date.now();

        for (const key of keys) {
            if(request.body[key] == "")
            return response.send("Por favor, preencha todos os campos")
        }

        const recipe = {
            ...request.body,
            created_at
        }
        
        Recipes.create(recipe, function(recipe){
            return response.redirect(`/admin/recipes/${recipe.id}`);
        });        
    }, 
    
    show(request, response){

        Recipes.find(request.params.id, function(recipe){
            if(!recipe) return response.send("Receita não encontrada");
             
            return response.render("admin/recipes/show", { recipe });
        });
        
    },
    
    edit(request, response){

        Recipes.find(request.params.id, function(recipe){
            if(!recipe) return response.send("Receita não encontrada");

            Recipes.chefsSelectOptions(function(options){
                return response.render("admin/recipes/edit", { recipe, chefOptions: options});
            });           
        });

    },
    
    put(request, response){
        const keys = Object.keys(request.body);

        for (const key of keys) {
            if(request.body[key] == "")
            return response.send("Por favor, preencha todos os campos")
        }

        Recipes.update(request.body, function(){
            return response.redirect(`admin/recipes/${request.body.id}`);
        });

    },
    
    delete(request, response){
        Recipes.delete(request.body.id, function(){
            return response.redirect(`admin/recipes`);
        });
    },
    
}