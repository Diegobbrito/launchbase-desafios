const Teacher = require('../models/Teacher');
const {age, date, graduation} = require('../../lib/utils.js');

module.exports = {
    
    index(request, response){
        Teacher.all(function(teachers){
            
            teachers.map((teacher)=>{
                teacher.subjects_taught = teacher.subjects_taught.split(",");
            });
            
            return response.render("teachers/index", { teachers });
        });      
    },

    create(request, response){
        return response.render("teachers/create");
    },

    post(request, response){
        const keys = Object.keys(request.body);

        for (const key of keys) {
            if(request.body[key] == "")
            return response.send("Por favor, preencha todos os campos")
        }
        
        Teacher.create(request.body, function(teacher){
            return response.redirect(`/teachers/${teacher.id}`);
        });        
    }, 
    
    show(request, response){

        Teacher.find(request.params.id, function(teacher){
            if(!teacher) return response.send("Professor não encontrado");
             
            teacher.birth_date = age(teacher.birth_date);
            teacher.subjects_taught = teacher.subjects_taught.split(",");
            teacher.education_level = graduation(teacher.education_level);
            teacher.created_at = date(teacher.created_at).format;

            return response.render("teachers/show", { teacher });
        });
        
    },
    
    edit(request, response){

        Teacher.find(request.params.id, function(teacher){
            if(!teacher) return response.send("Professor não encontrado");
             
            teacher.birth_date = date(teacher.birth_date).iso;
           
            return response.render(`teachers/edit`, { teacher });
        });

    },
    
    update(request, response){
        const keys = Object.keys(request.body);

        for (const key of keys) {
            if(request.body[key] == "")
            return response.send("Por favor, preencha todos os campos")
        }

        Teacher.update(request.body, function(){
            return response.redirect(`/teachers/${request.body.id}`);
        });

    },
    
    delete(request, response){
        Teacher.delete(request.body.id, function(){
            return response.redirect(`/teachers`);
        });
    },
    
}