//buscar o modal-overlay e colocar na variavel
const modalOverlay = document.querySelector('.modal-overlay');
//buscar todas as class com nome de curso
const cursos = document.querySelectorAll('.curso');

for(let curso of cursos){
    curso.addEventListener("click", () => {
        //adc ao modal-overlay a class "active"
        modalOverlay.classList.add('active');
        //adc a variavel o id do curso quando clicado
        const cursoId = curso.getAttribute('id');
        //alterar o src do iframe
        modalOverlay.querySelector("iframe").src = `https://rocketseat.com.br/${cursoId}`
    });
}

//busco o elemento close-modal, verifico sempre que ele é clicado e remove
//da clase modal-overlay o "active"

document.querySelector(".close-modal").addEventListener("click", () => {
    modalOverlay.classList.remove("active");
});
