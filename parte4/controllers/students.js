const fs = require('fs');
const data = require('../data.json');
const { age, date, grade  } = require('../utils');

exports.create = (request, response)=>{
    return response.render("students/create");
}

exports.post = function(request, response){
    const keys = Object.keys(request.body);
    for (const key of keys) {
        if(request.body[key] == "")
            return response.send("Por favor, preencha todos os campos")
    }

    let { avatar_url, name, birth, email, escolaridade, carga  } = request.body;

    birth = Date.parse(birth);
    let id = 1;
    const lastId = data.students[data.students.length -1];
    if (lastId){
        id = lastId.id + 1;
    }
    data.students.push({
        id,
        avatar_url,
        name,
        birth,
        email,
        escolaridade,
        carga
    });

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(error){
        if(error)
            return response.send("Write file error");
        
        return response.redirect(`/students/${id}`);
    });
} 
    
exports.show = function(request, response){
    const { id } = request.params;

    const studentFound = data.students.find(function(student){
        return student.id == id;
    });
    
    if(!studentFound){
        return response.send('Estudante não encontrado para exibição');
    }
    
    const student = {
        ...studentFound,
        age: date(studentFound.birth).birthDay,
        escolaridade: grade(studentFound.escolaridade),
    }
    console.log('antes')
    console.log(student.escolaridade);

    return response.render("students/show", { student });
}

exports.edit = function(request, response){

    const { id } = request.params;

    const studentFound = data.students.find(function(student){
        return student.id == id;
    });
    
    if(!studentFound){
        return response.send('Estudante não encontrado');
    }

    const student = {
        ...studentFound,
        birth: date(studentFound.birth).iso,
    }

    return response.render('students/edit', { student });
}

exports.update = function(request, response){
    const { id } = request.body;
    let index = 0;


    const studentFound = data.students.find(function(student, foundIndex){
        if(student.id == id){
            index = foundIndex;
            return true;
        }
    });
    
    if(!studentFound){
        return response.send('Estudante não encontrado para atualização');
    }

    const student = {
        ...studentFound,
        ...request.body,
        birth: Date.parse(request.body.birth),
        id: Number(id),

    }

    data.students[index] = student;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err)=>{
        if(err) return response.send("Update file error");

        return response.redirect(`/students/${id}`);
    });
}

exports.delete = function(request, response){
    const {id} = request.body;

    const filteredStudents = data.students.filter(function(student){
        return student.id != id;
    });
    data.students = filteredStudents;
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(error){
        if (error) return response.send("Erro ao deletar");

        return response.redirect("/students");
    })
}

exports.index = function(request, response){
    const students = data.students.map((student)=>{
        student.escolaridade = grade(student.escolaridade)
        return student
    });

    return response.render("students/index", { students });
}