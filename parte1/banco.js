const user = {
    name: "Mariana",
    transactions: [],
    balance: 0
};

function createTransaction(transaction){
    user.transactions.push(transaction);
    if(transaction.type == 'credit')
        user.balance += transaction.value;
    else
        user.balance -= transaction.value;
}
function getHigherTransactionByType(type){
    let max = 0;
    for(let transaction of user.transactions){
        if(transaction.type == type && transaction.value > max){
            max = transaction.value;
        }
    }
    return max;
}
function getAverageTransactionValue(){
    let avg = 0;
    for(let transaction of user.transactions){
        avg += transaction.value;
    }
    return avg / user.transactions.length ;
}

function getTransactionsCount(){
    let transactionCont = {
        credit: 0,
        debit: 0,
    }
    for(let transaction of user.transactions){
        if(transaction.type == "credit"){
            transactionCont.credit++;
        }else{
            transactionCont.debit++;
        }
    }
    return transactionCont;
}



createTransaction({ type: "credit", value: 50 });
createTransaction({ type: "credit", value: 120 });
createTransaction({ type: "debit", value: 80 });
createTransaction({ type: "debit", value: 30 });

console.log("Maior transação no valor de R$ " + getHigherTransactionByType("credit"));
console.log("Maior transação no valor de R$ " + getHigherTransactionByType("debit"));
console.log("Media das transações no valor de R$ " + getAverageTransactionValue());
console.log(getTransactionsCount());