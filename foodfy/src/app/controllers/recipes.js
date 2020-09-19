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

    async post(request, response){
        try {
            
            const keys = Object.keys(request.body);
            
            const created_at = Date.now();
            
            for (const key of keys) {
                if(request.body[key] == "")
                return response.send("Por favor, preencha todos os campos")
            }

            if (request.files == "") {
                return response.status(400).send('No files were uploaded.');
            }
            
            const filePromise =  request.files.map(file => File.create({
                ...file
            }));

            let numId;
            let fileId = await Promise.all(filePromise);
            fileId.forEach(row => (numId = row.rows))
            
            const values = {
                ...request.body,
                created_at,
            }
            
            const recipeId = await Recipes.create(values);
            return response.redirect(`/admin/recipes/${recipeId}`);
        } catch (error) {
            console.log(error)   
        }
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