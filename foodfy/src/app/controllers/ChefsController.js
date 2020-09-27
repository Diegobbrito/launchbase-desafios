const Chef = require('../models/Chefs');
const File = require('../models/File');

module.exports = {
    
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
            callback(chefs){

                let pagination = {};

                if(chefs != undefined)
                    pagination = { total: 0, page}
                else{
                    pagination = {
                        total: Math.ceil(chefs[0].total / limit),
                        page
                    }
                }

                return response.render("admin/chefs/index", { chefs, pagination });
            }
        }

        Chef.paginate(params);    
    },

    create(request, response){
        return response.render("admin/chefs/create");
    },

    async post(request, response){
        try {
            const keys = Object.keys(request.body);
            const created_at = Date.now();
            
            for (key of keys) {
                if(request.body[key] == ""){
                    return response.send("Por favor, preencha todos os campos");
                }
            }
            
            if (request.files == "") {
                return response.status(400).send('No files were uploaded.');
            }
            
            const filePromise =  request.files.map(file => File.create({
                ...file
            }));

            let numId;
            let fileId = await Promise.all(filePromise);
            fileId.forEach(row => (numId=row.rows))
            
            const values = {
                ...request.body,
                created_at,
                file_id: numId[0].id
            }            
            await Chef.create(values, chefId => {
                return response.redirect(`/admin/chefs/${chefId}`); 
            });

        } catch (error) {
            console.log(error)
        }
    }, 
    
    async show(request, response){     
        const results = await Chef.find(request.params.id);
        const chef = results.rows[0];
        
        if(!chef) return response.send("Chef não encontrado");   

        return response.render("admin/chefs/show", { chef });
    },
    
    async edit(request, response){

        let results = await Chef.find(request.params.id);
        const chef = results.rows[0];
        results = await Chef.files(chef.id);
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${request.protocol}://${request.headers.host}${file.path.replace("public", "")}`

        })); 

        if(!chef) return response.send("Chef não encontrado");
        
        return response.render("admin/chefs/edit", { chef, files });
    },
    
    async put(request, response){
        const keys = Object.keys(request.body);

        for (const key of keys) {
            if(request.body[key] == "" && key != "removed_files")
            return response.send("Por favor, preencha todos os campos")
        }


        if(request.files.length != 0){     
            const newFilesPromise = request.files.map(file => File.create({...file}))
            let fileId = await Promise.all(newFilesPromise);  
            fileId.forEach(row => (numId = row.rows));
            chefToUpdate = {file_id: numId[0].id}

        }else{
            chefToUpdate = await Chef.find(request.body.id)
            chefToUpdate = { file_id: chefToUpdate.rows[0].file_id }
        }

        if(request.body.removed_files != ""){
            const removedFiles = request.body.removed_files.split(",");
            const lastIndex = removedFiles.length - 1;
            removedFiles.splice(lastIndex, 1);
            
            const removedFilesPromise = removedFiles.map(id => File.delete(id));   
            await Promise.all(removedFilesPromise);
        }

        var values = {
            ...request.body,
            file_id: chefToUpdate.file_id
        }   

        await Chef.update(values, function(){
            return response.redirect(`/admin/chefs/${request.body.id}`);
        });

    },
    
    delete(request, response){
        Chef.delete(request.body.id, function(){
            return response.redirect(`/admin/chefs`);
        });
    }
    
}