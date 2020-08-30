const receitas = document.querySelectorAll('.receita');

for(let receita of receitas){

    receita.addEventListener("click", function() {
 
        const receitaId = receita.id;

        window.location.href = `/recipe/${receitaId}`

    });
}

function addIngredient() {
    const ingredients = document.querySelector("#ingredients");
    const fieldContainer = document.querySelectorAll(".ingredient");
  
    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
  
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;
  
    // Deixa o valor do input vazio
    newField.children[0].value = "";
    ingredients.appendChild(newField);
}

const ingredientes =  document.querySelector(".add-ingredient")
  
if (ingredientes){
    ingredientes.addEventListener("click", addIngredient);
}



// hidecontents.classList.remove("active");
