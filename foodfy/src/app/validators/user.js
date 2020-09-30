const User = require('../models/User');
const { compare } = require('bcryptjs');

function checkAllFields(body){
    const keys = Object.keys(body)
    for(key of keys){
        if(body[key] == ""){
            return response.render('user/register', {
                user:body,
                error: "Por favor, preencher todos os campos"
            });
        }
    }
}

async function show(request, response, next){
    const {userId: id} = request.session;
    const user = await User.findOne({where: {id}});

    if(!user){
        return response.render('user/register', {
            error: 'Usuário não encontrado'
        });
    }
    request.user = user;
    next(); 
}

async function post(request, response, next){
    const fillAllFields = checkAllFields(request.body);
    if(fillAllFields)
        return response.render("user/login", fillAllFields);

    let { email, password, passwordRepeat } = request.body;

    const user = await User.findOne({ where: { email }});

    if(user) return response.render("user/register", {
        user: request.body,
        error: 'Usuário já cadastrado'
    })

    if(password != passwordRepeat) return response.render("user/register", {
        user: request.body,
        error: 'As senhas são diferentes'
    })
    next();
}

async function update(request, response, next){
    const fillAllFields = checkAllFields(request.body);
    if(fillAllFields)
        return response.render("user/login", fillAllFields);

    const { id, password } = request.body;

    if(!password) return response.render("user/login", {
        user: request.body,
        error: "Coloque sua senha para atualizar o cadastro"
    });

    const user = await User.findOne({where: { id }});
    const passed = await compare(password, user.password);

    if(!passed) return response.render("user/login", {
        user: request.body,
        error: "Senha incorreta."
    });

    request.user = user;
    next();
}

module.exports = {
    post,
    update,
    show
}