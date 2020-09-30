const crypto = require('crypto');
const User = require('../models/User');
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

    resetForm(request, response){
        return response.render("session/reset-password");
    }
    forgot(request, response){
        const token = crypto.randomBytes(20).toString("hex");
        let now = new Date();
        now = now.setHours(now.getHours() + 2);

        await User.update(id, fields)
    }
}

module.exports = new SessionController();