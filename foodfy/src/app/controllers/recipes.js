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

    async create(request, response){
        try { 
            let options = await Recipes.chefsSelectOptions();
            options = options.rows;
            
            return response.render("admin/recipes/create", { chefOptions: options});
        } catch (error) {
            console.log(error)
        }
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
    
    async put(request, response){
        const keys = Object.keys(request.body);

        for (const key of keys) {
            if(request.body[key] == "" && key != "removed_files")
                return response.send("Preencha todos os campos");
        }

        if(request.files.length != 0){     
            const newFilesPromise = request.files.map(file => File.create({...file}))
            fileId = await Promise.all(newFilesPromise);  
            fileId.forEach(result => (
                File.recipecreate(request.body.id, result.rows[0].id)
            ));
        }

        if(request.body.removed_files != ""){
            const removedFiles = request.body.removed_files.split(",");
            const lastIndex = removedFiles.length - 1;
            removedFiles.splice(lastIndex, 1);
            
            const removedFilesPromise = removedFiles.map(id => File.delete(id));   
            await Promise.all(removedFilesPromise);
        }

        Recipes.update(request.body, function(){
            return response.redirect(`/admin/recipes/${request.body.id}`);
        });

    },
    
    delete(request, response){
        Recipes.delete(request.body.id, function(){
            return response.redirect(`admin/recipes`);
        });
    },
    
}