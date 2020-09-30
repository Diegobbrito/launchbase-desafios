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
}

module.exports = new SessionController();