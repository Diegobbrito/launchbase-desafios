const User = require('../models/User');
class ProfileController{

    async index(request, response){

        const id = request.session.userId
        const user = await User.findOne({where: {id} })

        return response.render("user/show", {user});
    }

    put(request, response){
        request.session.userId = request.user.id;

        return response.redirect("/admin/recipes");
    }
}

module.exports = new ProfileController(); 