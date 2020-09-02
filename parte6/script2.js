//Função base
/*
function printDouble(number, add){
  setTimeout(
    () => {
      console.log((number * 2) + add)
    }, 
    Math.floor(Math.random() * 100) + 1
  )
}

function printAll(){
    printDouble(1, 0)
    printDouble(2, 2)
    printDouble(3, 3)
    printDouble(4, 4)
    printDouble(5, 5)
}

printAll()

*/

//Função utilizando callback
/*
var printDouble = (number, add, callback) => {
    setTimeout(
        () => {
            callback((number * 2) + add);
      }, 
      Math.floor(Math.random() * 100) + 1
    )
}

function printAll(){   
    let result;
    printDouble(5, 1, (number)=>{
        console.log(number)
        result = number;
        printDouble(10, result, (number)=>{
            console.log(number)
            result = number;
            printDouble(20, result, (number)=>{
                console.log(number)
                result = number;
                printDouble(30, result,(number)=>{
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
    return number * 2 ;
}
    
let double = (number, add) => new Promise((resolve, reject) => {
    setTimeout(
        () => {
            return resolve(doubleNumber(number) + add);

        }, Math.floor(Math.random() * 100) + 1
    );
});

function printAll(){

    double(5, 0).then((numero)=>{
        console.log(numero)
        return double(10, numero)
    }).then((numero)=>{
        console.log(numero)
        return double(20, numero)
    }).then((numero)=>{
        console.log(numero)
        return double(30, numero)
    }).then((numero)=>{
        console.log(numero)
        return double(40, numero)
    })

}
  
printAll()

*/
//Função utilizando async/await


function doubleNumberAdd(number, add){
    return (number * 2) + add;
}
    
let double = (number, add) => new Promise((resolve, reject) => {
    setTimeout(
        () => {
            return resolve(doubleNumberAdd(number, add));

        }, Math.floor(Math.random() * 100) + 1
    );
});

async function printAll(){

    let result = await double(5, 0);
    console.log(result)
        
    result = await double(10, result)
    console.log(result)
    result = await double(20, result)
    console.log(result)
    result = await double(30, result)
    console.log(result)
    result = await double(40, result)
    console.log(result)
}
  
printAll()
