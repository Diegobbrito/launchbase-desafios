class UserController{
    registerForm(request, response){
        return response.render("user/register");
    }
}

module.exports = new UserController();