class SessionController{

    loginForm(request, response){
        return response.render("session/index");
    }

    login(request, response){
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
}

module.exports = new SessionController();