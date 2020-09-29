const User = require('../models/User');
 
async function post(request, response, next){

    const keys = Object.keys(request.body)
    for(key of keys){
        if(request.body[key] == ""){
            return response.render('user/register', {
                user:request.body,
                error: "Por favor, preencher todos os campos"
            });
        }
    }
    
    const { email, password, passwordRepeat } = request.body;
    
    const user = await User.findOne({
        where: {email}
    });
    
    if(user){
        return response.render('user/register', {
            user:request.body,
            error: 'Usuário já cadastrado'
        });
    }
    
    if(password != passwordRepeat){
        return response.render('user/register', {
            user:request.body,
            error: 'Senhas diferentes'
        });
    } 

    next()
     
}

module.exports = {
    post
}