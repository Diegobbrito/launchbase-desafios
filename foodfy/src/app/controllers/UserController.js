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
}

module.exports = new UserController();