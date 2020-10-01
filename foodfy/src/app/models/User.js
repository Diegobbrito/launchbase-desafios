const db = require('../../config/db');
const { hash } = require('bcryptjs');

module.exports = {

    all(callback){
        db.query(`
            SELECT users.*
            FROM users
            ORDER BY name ASC
            `, function(err, results){
            if (err) throw `Erro no banco: ${err}`
            
            callback(results.rows)
        });
    },
    
    async findOne(filters){
        let query = "SELECT * FROM users"

        Object.keys(filters).map(key => {
            query = `${query}
            ${key}`

            Object.keys(filters[key]).map(field => {
                query = `${query} ${field} = '${filters[key][field]}'`
            });
        });

        const results = await db.query(query);

        return results.rows[0]; 
    },

    async create(fields){
        try {

            let query =  `
                INSERT INTO public.users (
                `
            Object.keys(fields).map((key, index, array) => {
                if((index + 1) < array.length){
                    query = `${query}
                    ${key},`
                }else{
                    query = `${query}
                    ${key} ) VALUES ( `
                }
            });

            Object.keys(fields).map((key, index, array) => {
                if((index + 1) < array.length){
                    query = `${query}
                    '${fields[key]}',`
                }else{
                    query = `${query}
                    ${fields[key]})
                    RETURNING id
                    `
                }
            });
            const results = await db.query(query);
            return results.rows[0].id;
        } catch (error) {
            console.log(error)
        }
    },

    async update(id, fields){
        try {
            let query = "UPDATE users SET"
            Object.keys(fields).map((key, index, array) => {
                if((index + 1) < array.length){
                    query = `${query}
                    ${key} = '${fields[key]}',`
                }else{
                    query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${ id }
                    `
                }
            });
            await db.query(query);
            return 
        } catch (error) {
            console.log(error) 
        }
    },

    delete(id, callback){
        db.query(`DELETE FROM users WHERE id = $1`, [id], function(err, results){
            if (err) throw `Erro no banco: ${err}`
            
            callback();
        });
    },

    paginate(params){
        const { filter, limit, offset, callback } = params;


        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count(*) 
                FROM chefs
                ) AS total`;
        
        if( filter ){
            filterQuery = `
            WHERE name ILIKE '%${filter}%'
            `
            totalQuery = `(
                SELECT count(*) 
                FROM chefs 
                ${filterQuery}
                ) AS total`
        }

        query = `
                SELECT chefs.*, ${totalQuery}, files.name as image
                FROM chefs
                JOIN files
                on (chefs.file_id = files.id)
                ${filterQuery}
                ORDER BY name ASC
                LIMIT $1 OFFSET $2`


        db.query(query, [limit, offset], function(err, results){
            if(err) throw `Banco error: ${err}`;

            callback(results.rows);
        });

    },
    
      
}   