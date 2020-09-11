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

const PhotoUpload = {
    input: " ",
    preview: document.querySelector("#photos-preview"), 
    files: [],
    handleFileInput(event, limit){
        const { files: fileList} = event.target;
        PhotoUpload.input = event.target;
        
        if(PhotoUpload.hasLimit(event, limit)) return

        Array.from(fileList).forEach(file => {

            PhotoUpload.files.push(file)
           const reader = new FileReader();

           reader.onload = () => {
               const image = new Image();
               image.src = String(reader.result); 

               const div = PhotoUpload.getContainer(image);

               PhotoUpload.preview.appendChild(div);

           }
           reader.readAsDataURL(file)
        });

        PhotoUpload.input.files = PhotoUpload.getAllFiles();
    },
    getContainer(image){
        const div = document.createElement('div')
               div.classList.add('photo')

               div.onclick = PhotoUpload.removePhoto

               div.appendChild(image)

               div.appendChild(PhotoUpload.getRemoveButton());

               return div
    },
    getAllFiles(){
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotoUpload.files.forEach(file => dataTransfer.items.add(file))
        return dataTransfer.files
    },
    hasLimit(event, limit){
        const { input, preview } = PhotoUpload;
        const { files: fileList} = input;
        let uploadLimit = limit;

        if(fileList.length > uploadLimit){
            alert(`Envie no máximo ${uploadLimit} foto(s)`);
            event.prevendDefault();
            return true;
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if(item.classList && item.classList.value == "photo")
                photosDiv.push(item)
        });

        const totalPhotos = fileList.length + photosDiv.length
        if(totalPhotos > uploadLimit){
            alert("Você atingiu o limite máximo de fotos");
            event.prevendDefault();
            return true;
        }

        return false;
    },
    getRemoveButton(){
        const button = document.createElement('i');
        button.classList.add('material-icons');
        button.innerHTML = "close";
        return button;
    },
    removePhoto(event){
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotoUpload.preview.children)
        const index = photosArray.indexOf(photoDiv);
 
        PhotoUpload.files.splice(index, 1); 
        PhotoUpload.input.files = PhotoUpload.getAllFiles();

        photoDiv.remove()
    }
}
