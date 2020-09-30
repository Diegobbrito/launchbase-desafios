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

    async create(data, callback){
        try {
            
            const query =  `
            INSERT INTO public.users (
                name,
                email, 
                password               
                ) VALUES ($1, $2, $3)
                RETURNING id
                `
                //npm install bcryptjs
                const passwordHash = await hash(data.password, 8)
                const values = [
                    data.name,
                    data.email,
                    passwordHash
                ]
                const results = await db.query(query, values);
                
                return results.rows[0].id;
            } catch (error) {
                console.log(error)
            }
    },
            
    find(id){
        return db.query(`
            SELECT *
            FROM users
            WHERE chefs.id = $1
        `, [id]);
    },

    async update(data, callback){
        try {
            
            const query = `
            UPDATE users SET
            name = ($1),
            email = ($2)
            password = ($3)
            WHERE id = ($4)
            `
            
            const passwordHash = await hash(data.password, 8)
            
            const values = [
                data.name,
                data.email,
                passwordHash, 
                data.id
            ]
            db.query(query, values, function(err, results){
                if (err) throw `Erro no banco: ${err}`
                
                callback();
            });
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