const users = [
    { nome: "Carlos", tecnologias: ["HTML", "CSS"]},
    { nome: "Jarmine", tecnologias: ["HTML"]},
    { nome: "Tuane", tecnologias: ["CSS"]},
    { nome: "Maria", tecnologias: ["Javascript", "CSS"]},
    { nome: "Diego", tecnologias: ["Java", "Javascript", "C#"]}
]



function imprimeUsers(){
    for(let i = 0; i < users.length; i++){
        console.log(`${users[i].nome} trabalha com ${users[i].tecnologias.join(', ')}`)
    }
}
// for (let usuario of usuarios) {
//     console.log(`${usuario.nome} trabalha com ${usuario.tecnologias.join(', ')}`)
// }



function checaSeUsuarioUsaCSS(usuario){
    for(let i = 0; i < usuario.tecnologias.length; i++){
        if(usuario.tecnologias[i] == 'CSS'){
            return true;
        }
    }
}

function buscaTecnologia(){
    for (let i = 0; i < users.length; i++) {
        const usuarioTrabalhaComCSS = checaSeUsuarioUsaCSS(users[i]);
    
        if (usuarioTrabalhaComCSS) {
        console.log(`O usuário ${users[i].nome} trabalha com CSS`);
        }
    }   
}


imprimeUsers();

buscaTecnologia();