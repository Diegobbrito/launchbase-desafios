//buscar todas as class com nome de curso
const cursos = document.querySelectorAll('.curso');
for(let curso of cursos){
    curso.addEventListener("click", () => {
        //adc ao modal-overlay a class "active"
        //adc a variavel o id do curso quando clicado
        const cursoId = curso.getAttribute('id');
        //alterar o src do iframe
        window.location.href = `/course/${cursoId}`
    });
}