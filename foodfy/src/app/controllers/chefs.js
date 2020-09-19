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
                
                const pagination = {
                    total: Math.ceil(chefs[0].total / limit),
                    page
                }

                return response.render("admin/chefs/index", { chefs, pagination });
            }
        }

        Chef.paginate(params);

        // Chef.all(function(students){    
        //     students.map((student)=>{
        //         student.education_level = grade(student.education_level);
        //     });
        //     return response.render("students/index", { students });
        // });      
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
            await Chef.create(values, (chefId)=>{
                return response.redirect(`/admin/chefs/${chefId}`); 
            });

        } catch (error) {
            console.log(error)
        }
    }, 
    
    show(request, response){        
        Chef.find(request.params.id, function(chef){
            if(!chef) return response.send("Chefe não encontrado");

            return response.render("admin/chefs/show", { chef });
        });
    },
    
    edit(request, response){

        Chef.find(request.params.id, function(chef){
            if(!chef) return response.send("Chef não encontrado");
             
            return response.render("admin/chefs/edit", { chef });
        });

    },
    
    put(request, response){
        const keys = Object.keys(request.body);

        for (const key of keys) {
            if(request.body[key] == "")
            return response.send("Por favor, preencha todos os campos")
        }

        Chef.update(request.body, function(){
            return response.redirect(`/admin/chefs/${request.body.id}`);
        });

    },
    
    delete(request, response){
        Chef.delete(request.body.id, function(){
            return response.redirect(`/admin/chefs`);
        });
    },
    
}