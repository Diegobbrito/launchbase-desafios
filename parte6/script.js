//Função base

/*
function printDouble(number){
  setTimeout(
    () => {
      console.log(number * 2)
    }, 
    Math.floor(Math.random() * 100) + 1
  )
}

function printAll(){
    printDouble(1)
    printDouble(2)
    printDouble(3)
    printDouble(4)
    printDouble(5)
}

printAll()

*/

//Função utilizando callback
/*
var printDouble = (number, callback) => {
    setTimeout(
        () => {
            callback(number * 2);
      }, 
      Math.floor(Math.random() * 100) + 1
    )
}

function printAll(){   
    printDouble(5, (number)=>{
        console.log(number)
        printDouble(10, (number)=>{
            console.log(number)
            printDouble(20, (number)=>{
                console.log(number)
                printDouble(30, (number)=>{
                    console.log(number)
                });
            });
        });
    });
}

printAll()

*/

//Função utilizando promise

/*
function doubleNumber(number){
    return number * 2;
}
    
let double = number => new Promise((resolve, reject) => {
    setTimeout(
        () => {
            return resolve(doubleNumber(number));

        }, Math.floor(Math.random() * 100) + 1
    );
});

function printAll(){

    double(5).then((numero)=>{
        console.log(numero)
        return double(10)
    }).then((numero)=>{
        console.log(numero)
        return double(20)
    }).then((numero)=>{
        console.log(numero)
        return double(30)
    }).then((numero)=>{
        console.log(numero)
        return double(40)
    })

}
  
printAll()
*/

//Função utilizando async/await


function doubleNumber(number){
    return number * 2;
}
    
let double = number => new Promise((resolve, reject) => {
    setTimeout(
        () => {
            return resolve(doubleNumber(number));

        }, Math.floor(Math.random() * 100) + 1
    );
});

async function printAll(){

    for (let index = 1; index < 6; index++) {
        let numero = await double(index);
        console.log(numero)
        
    }
    // numero = await double(10)
    // console.log(numero)
    // numero = await double(20)
    // console.log(numero)
    // numero = await double(30)
    // console.log(numero)
    // numero = await double(40)
    // console.log(numero)
}
  
printAll()
