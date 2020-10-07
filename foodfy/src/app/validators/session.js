const User = require('../models/User');
const { compare } = require('bcryptjs');
 
async function login(request, response, next){
    const { email, password } = request.body;

    const user = await User.findOne({where: { email }});

    if(!user){
        return response.render('session/login', {
            user: request.body,
            error: 'Usuário não cadastrado'
        });
    }

    const passed = await compare(password, user.password);

    if(!passed) return response.render("session/login", {
        user: request.body,
        error: "Senha incorreta."
    });

    request.user = user;
    next();
}

async function forgot(request, response, next){

    const { email } = request.body;
    try {
        const user = await User.findOne({where: { email }});
        
        if(!user){
            return response.render('session/forgot-password', {
                user: request.body,
                error: 'Email não cadastrado'
            });
        }
        request.user = user;
        next();
    } catch (error) {
        console.error(error);
    }
}

async function reset(request, response, next){
    const { email, password, passwordRepeat, token } = request.body;

    const user = await User.findOne({ where: { email }});

    if(!user){
        return response.render('session/reset-password', {
            user: request.body,
            token,
            error: 'Usuário não cadastrado'
        });
    }

    if(password != passwordRepeat) return response.render("session/reset-password", {
        user: request.body,
        token,
        error: 'As senhas são diferentes'
    });

    if(token != user.reset_token) return response.render("session/reset-password", {
        user: request.body,
        token,
        error: 'Token inválido, solicite uma nova recuperação de senha'
    });

    let now = new Date();
    now = now.setHours(now.getHours());

    if(now > user.reset_token_expires) return response.render("session/reset-password", {
        user: request.body,
        token,
        error: 'Token expirado, solicite uma nova recuperação de senha'
    });

    request.user = user;

    next();
}

async function createPassword(request, response, next){
    const { email, token } = request.body;

    const user = await User.findOne({ where: { email }});

    if(!user){
        return response.render('user/create-password', {
            user: request.body,
            token,
            error: 'Email não cadastrado'
        });
    }
    
    if(token != user.reset_token){
        return response.render("user/create-password", {
            user: request.body,
            token,
            error: 'Token inválido, solicite uma nova recuperação de senha'
        });
    } 

    let now = new Date();
    now = now.setHours(now.getHours());

    if(now > user.reset_token_expires) return response.render("user/create-password", {
        user: request.body,
        token,
        error: 'Seu token já foi expirado, solicite uma nova recuperação de senha'
    });

    request.user = user;

    next();
}

module.exports = {
    login,
    forgot,
    reset,
    createPassword
}