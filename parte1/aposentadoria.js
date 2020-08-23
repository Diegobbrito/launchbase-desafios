const nome = 'Silvana'
const sexo = 'F';
const idade = 65;
const contribuicao = 23;
const soma = idade + contribuicao;

if(sexo == 'F'){
	if( soma > 84 || contribuicao > 29 ){
		console.log(`${nome}, você pode se aposentar`);
	}else{
		console.log(`${nome}, você não pode se aposentar`);
	}
}else{
	if( soma > 94 || contribuicao > 34 ){
		console.log(`${nome}, você pode se aposentar`);
	}else{
		console.log(`${nome}, você não pode se aposentar`);
	}
}
