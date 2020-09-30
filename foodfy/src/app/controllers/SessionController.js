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
}

module.exports = new SessionController();