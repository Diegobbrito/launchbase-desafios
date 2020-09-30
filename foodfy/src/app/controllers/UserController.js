const User = require("../models/User");

class UserController{
    
    registerForm(request, response){
        return response.render("user/register");
    }

    async post(request, response){
        const userId = await User.create(request.body);

        request.session.userId = userId;
        
        response.redirect('/users');
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
}

module.exports = new UserController();