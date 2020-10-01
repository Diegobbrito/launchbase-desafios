const User = require("../models/User");
const crypto = require('crypto');
const mailer = require('../../lib/mailer');


class UserController{
    
    registerForm(request, response){
        return response.render("user/register");
    }

    async post(request, response){
        try {
            
            const userId = await User.create(request.body);

            console.log("userId");
            console.log(userId);

            const token = crypto.randomBytes(20).toString("hex");
            let now = new Date();
            now = now.setHours(now.getHours() + 2);

            await User.update(userId, {
                reset_token: token,
                reset_token_expires: now 
            });

            await mailer.sendMail({
                to: request.body.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Definição de senha',
                html: `
                <h2>Bem vindo ao Foodfy </h2>
                <p>Clique no link abaixo para definir sua senha</p>
                <p>
                <a href="http://localhost:3000/users/create-password?token=${token}" target="_blank">
                DEFINIR SENHA 
                </a>
                </p>
                `
            });

            request.session.userId = userId;
            
            response.redirect('/users');
        } catch (error) {
            console.log(error);
        }
    }

    show(request, response ){
        return response.render('session/login');
    }
    
    async update(request, response){
        try {
            const { user } = request;
            let { name, email} = request.body
            
            await User.update(user.id, {
                name,
                email
            });
            
            return response.render("user/register",{
                success: "Conta atualizada com sucesso"
            })
        } catch (error) {
            console.log(error)
        }
    }

    createPassword(request, response){
        return response.render("user/create-password", {
            token: request.query.token
        });
    }
}

module.exports = new UserController();