const User = require('../models/User');
const crypto = require('crypto');
const mailer = require('../../lib/mailer');
const { hash } = require('bcryptjs');

class SessionController{

    loginForm(request, response){
        return response.render("session/login");
    }

    login(request, response){
        request.session.userId = request.user.id;

        return response.redirect("/users");
    }
    
    logout(request, response){
        request.session.destroy();
        return response.redirect('/');
    }

    forgotForm(request, response){
        return response.render("session/forgot-password");
    }

    async forgot(request, response){

        try {
            const { user } = request;
            const token = crypto.randomBytes(20).toString("hex");
            let now = new Date();
            now = now.setHours(now.getHours() + 2);

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now 
            });

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy.com.br',
                subject: 'Recuperação de senha',
                html: `
                <h2>Perdeu a chave? </h2>
                <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
                <p>
                <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
                RECUPERAR SENHA 
                </a>
                </p>
                `
            });
            
            return response.render("session/forgot-password", {
                success: "Verifique seu email para resetar sua senha"
            }); 
            
        } catch (error) {
            console.error(error);

            return response.render("session/forgot-password", {
                error: "Erro inesperado, tente novamente"
            }); 
        }
    }

    resetForm(request, response){
        return response.render("session/reset-password", {
            token: request.query.token
        });
    }

    async reset(request, response){
        const { user } = request;
        const { password, token } = request.body;

        const newPassword = await hash(password, 8);

        try {

            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: ""
            })

            return response.render("session/login", {
                user: request.body,
                success: "Senha atualizada, faça o seu login"
            });
            
        } catch (error) {
            console.error(error);

            return response.render("session/reset-password", {
                user: request.body,
                token,
                error: "Erro inesperado, tente novamente"
            }); 
        }
    }

    
}

module.exports = new SessionController(); 