const fs = require('fs');
const data = require('../data.json');
const { age, date, graduation,splitArea, splitareadeatuacao } = require('../utils');

exports.post = function(request, response){
    const keys = Object.keys(request.body);
    for (const key of keys) {
        if(request.body[key] == "")
            return response.send("Por favor, preencha todos os campos")
    }

    let { avatar_url, name, birth, escolaridade, tipodeaula, areadeatuacao } = request.body;

    birth = Date.parse(birth);
    const created_at = Date.now();
    let id = 1;
    const lastId = data.students[data.students.length -1];
    if (lastId){
        id = lastId.id + 1;
    }
    data.teachers.push({
        id,
        avatar_url,
        name,
        birth,
        escolaridade,
        tipodeaula,
        areadeatuacao,
        created_at
    });

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(error){
        if(error)
            return response.send("Write file error");
        
        return response.redirect(`/teachers/${id}`);
    });
} 
    
exports.show = function(request, response){
    const { id } = request.params;

    const teacherFound = data.teachers.find(function(teacher){
        return teacher.id == id;
    });
    
    if(!teacherFound){
        return response.send('Professor não encontrado');
    }

    const splitTeacher = splitareadeatuacao(teacherFound.areadeatuacao)
    
    const teacher = {
        ...teacherFound,
        age: age(teacherFound.birth),
        escolaridade: graduation(teacherFound.escolaridade),
        areadeatuacao: splitTeacher,
        created_at: new Intl.DateTimeFormat("pt-BR"). format(teacherFound.created_at),
    }


    return response.render("teachers/show", { teacher });
}

exports.edit = function(request, response){

    const { id } = request.params;

    const teacherFound = data.teachers.find(function(teacher){
        return teacher.id == id;
    });
    
    if(!teacherFound){
        return response.send('Professor não encontrado');
    }

    const teacher = {
        ...teacherFound,
        birth: date(teacherFound.birth).iso,
    }

    return response.render('teachers/edit', { teacher });
}

exports.update = function(request, response){
    const { id } = request.body;
    let index = 0;


    const teacherFound = data.teachers.find(function(teacher, foundIndex){
        if(teacher.id == id){
            index = foundIndex;
            return true;
        }
    });
    
    if(!teacherFound){
        return response.send('Professor não encontrado para atualização');
    }

    const teacher = {
        ...teacherFound,
        ...request.body,
        birth: Date.parse(request.body.birth),
        id: Number(id),

    }

    data.teachers[index] = teacher;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err)=>{
        if(err) return response.send("Update file error");

        return response.redirect(`/teachers/${id}`);
    })
}

exports.delete = function(request, response){
    const {id} = request.body;

    const filteredTeachers = data.teachers.filter(function(teacher){
        return teacher.id != id;
    });
    data.teachers = filteredTeachers;
    console.log("cheguei aqui")
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(error){
        if (error) return response.send("Erro ao deletar");

        return response.redirect("/teachers");
    })
}

exports.index = function(request, response){

    const teachers = splitArea(data);
    
    return response.render("teachers/index", { teachers });
}