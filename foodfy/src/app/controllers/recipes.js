const Recipes = require('../models/Recipes');
const File = require('../models/File');

module.exports = {

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
            let pagination = {};

            if(recipes != undefined)
                pagination = { total: 0, page}
            else{
                pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }
            }

            return response.render("recipes/index", { recipes, pagination,  filter });
        }
    }

    Recipes.paginate(params);  
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
            let pagination = {};

            if(recipes != undefined)
                pagination = { total: 0, page}
            else{
                pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }
            }
            return response.render("admin/recipes/index", { recipes, pagination,  filter });

        }
    }

    Recipes.paginate(params);  
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

            let filesId = await Promise.all(filePromise);
            
            const values = {
                ...request.body,
                created_at,
            }
            
            await Recipes.create(values, recipeId =>{

                filesId.forEach(result => (
                    File.recipecreate(recipeId, result.rows[0].id)
                ))
                return response.redirect(`/admin/recipes/${recipeId}`);
            });

        } catch (error) {
            console.log(error)   
        }
    }, 
        
    async show(request, response){
                
        let results = await Recipes.find(request.params.id)
        const recipe = results.rows[0];
        results = await Recipes.files(recipe.id);
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`
        })); 
        
        if(!recipe) return response.send("Receita não encontrada");
            
        return response.render("admin/recipes/show", { recipe, files });
        
    },
    
    async edit(request, response){

        let results = await Recipes.find(request.params.id)
        const recipe = results.rows[0];
        results = await Recipes.files(recipe.id);
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`
        })); 
        let options = await Recipes.chefsSelectOptions();
        options = options.rows;
        
        return response.render("admin/recipes/edit", { recipe, files, chefOptions: options});
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