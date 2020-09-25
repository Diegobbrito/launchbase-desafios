const Recipes = require('../models/Recipes');

module.exports = {
    
    async index(request, response){
         
        let results = await Recipes.all();
        
        let recipes = results.rows;
    
        async function getImage(recipeId){
            let results = await Recipes.files(recipeId)
            const files = results.rows.map(file => `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`)
        return files[0];
        }
    
        const recipesPromise = recipes.map(async recipe => {
            recipe.src = await getImage(recipe.id)
            return recipe;
        })
        
        recipes = await Promise.all(recipesPromise);
    
        return response.render("recipes/index", { recipes });
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
            
        return response.render("recipes/recipe", { recipe, files });
        
    },

    async recipes(request, response){
         
        let results = await Recipes.all();
        
        let recipes = results.rows;
    
        async function getImage(recipeId){
            let results = await Recipes.files(recipeId)
            const files = results.rows.map(file => `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`)
        return files[0];
        }
    
        const recipesPromise = recipes.map(async recipe => {
            recipe.src = await getImage(recipe.id)
            return recipe;
        })
        
        recipes = await Promise.all(recipesPromise);
    
        return response.render("recipes/recipes", { recipes });
    },
    
}