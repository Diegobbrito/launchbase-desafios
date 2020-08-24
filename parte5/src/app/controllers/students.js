const Student = require('../models/Student');
const {date, grade} = require('../../lib/utils.js');

module.exports = {
    
    index(request, response){
        Student.all(function(students){
            
            students.map((student)=>{
                student.education_level = grade(student.education_level);
            });

            return response.render("students/index", { students });
        });      
    },

    create(request, response){
        return response.render("students/create");
    },

    post(request, response){
        const keys = Object.keys(request.body);

        for (const key of keys) {
            if(request.body[key] == "")
            return response.send("Por favor, preencha todos os campos")
        }
        
        Student.create(request.body, function(student){
            return response.redirect(`/students/${student.id}`);
        });        
    }, 
    
    show(request, response){

        Student.find(request.params.id, function(student){
            if(!student) return response.send("Aluno não encontrado");
             
            student.birth_date = date(student.birth_date).birthDay;
            student.education_level = grade(student.education_level);

            return response.render("students/show", { student });
        });
        
    },
    
    edit(request, response){

        Student.find(request.params.id, function(student){
            if(!student) return response.send("Aluno não encontrado");
             
            student.birth_date = date(student.birth_date).iso;
           
            return response.render(`students/edit`, { student });
        });

    },
    
    update(request, response){
        const keys = Object.keys(request.body);

        for (const key of keys) {
            if(request.body[key] == "")
            return response.send("Por favor, preencha todos os campos")
        }

        Student.update(request.body, function(){
            return response.redirect(`/students/${request.body.id}`);
        });

    },
    
    delete(request, response){
        Student.delete(request.body.id, function(){
            return response.redirect(`/students`);
        });
    },
    
}