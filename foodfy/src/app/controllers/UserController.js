class UserController{
    
    registerForm(request, response){
        return response.render("user/register");
    }

    async post(request, response){

        

    }
}

module.exports = new UserController();