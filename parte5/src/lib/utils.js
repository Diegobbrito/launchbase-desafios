module.exports ={ 
    age(timestamp){
        const today = new Date();
        const birthDate = new Date(timestamp);

        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();

        if(month <=0 && today.getDate()<= birthDate.getDate()){
            age--;
        }
        return age;
    },
    date(timestamp){
        const date = new Date(timestamp);
        const year = date.getUTCFullYear();
        const month = `0${date.getUTCMonth() + 1}`.slice(-2);
        const day = `0${date.getUTCDate()}`.slice(-2);
        return  {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            format: `${day}/${month}/${year}`,
        }
    },
    graduation(graduation){
        switch(Number(graduation)){
            case 1:
                return 'Ensino Médio Completo';
            case 2:
                return 'Ensino Superior Completo';
            case 3:
                return 'Mestrado';
            case 4:
                return 'Doutorado';
            default:
                return '';
        }

    },
    grade(grade){
        switch(Number(grade)){
            case 1:
                return '5º ano do ensino fundamental'
            case 2:
                return '6º ano do ensino fundamental'
            case 3:
                return '7º ano do ensino fundamental'
            case 4:
                return '8º ano do ensino fundamental'
            case 5:
                return '1º ano do ensino médio'
            case 6:
                return '2º ano do ensino médio'
            case 7:
                return '3º ano do ensino médio'
            default:
                return '';
        }
    }
}

