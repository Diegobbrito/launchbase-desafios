const receitas = document.querySelectorAll('.receita');


for(let receita of receitas){

    receita.addEventListener("click", function() {
 
        const receitaId = receita.id;

        window.location.href = `/recipe/${receitaId}`

    });
}

const showcontents = document.querySelectorAll('.show');
const hidecontents = document.querySelectorAll('.hide');
const actives = document.querySelectorAll(".active");


console.log(showcontents)
console.log(hidecontents);




for(let show of showcontents){
    show.addEventListener("click", () => {
        if(show.classList.contains("show")){
            mostrar(show);
        }
        if(show.classList.contains("active")){
            console.log("cheguei");
        }


    });
}
for(let hide of actives){
    hide.addEventListener("click", () => {
        esconder(hide);
    });
}

function esconder(hide){
    hide.innerHTML = "Mostrar";
    hide.classList.remove('active');
    hide.classList.add('show');
    hidecontents[hide.id].classList.add('hide');
}

function mostrar(show){
    show.innerHTML = 'Esconder';
    hidecontents[show.id].classList.remove('hide');
    hidecontents[show.id].classList.remove('active');
    show.classList.add('active');
    show.classList.remove('show');

}





// hidecontents.classList.remove("active");
