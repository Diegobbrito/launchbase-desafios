const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {

    all(callback){
        db.query(`
            SELECT * 
            FROM chefs 
            ORDER BY name ASC
            `, function(err, results){
            if (err) throw `Erro no banco: ${err}`
            
            callback(results.rows)
        });
    },

    create(data, callback){
        const query =  `
            INSERT INTO public.chefs (
                name,
                avatar_url,
                created_at
            ) VALUES ($1, $2, $3)
            RETURNING id
            `
        const values = [
            data.name,
            data.avatar_url,
            date(data.created_at).iso
        ]
        console.log(data)

        db.query(query, values, function(err, results){            
            if (err) throw `Erro no banco: ${err}`

            callback(results.rows[0]);
        });
    },

    find(id, callback){
        db.query(`
            SELECT *
            FROM chefs
            WHERE id = $1
        `, [id], function(err, results){
            if(err) throw `Erro no banco: ${err}`

            callback(results.rows[0]);
        });
    },

    update(data, callback){
        const query = `
        UPDATE chefs SET
            name = ($1),
            avatar_url = ($2)
        WHERE id = ($3)
        `
        const values = [
            data.name,
            data.avatar_url, 
            data.id
        ]
        db.query(query, values, function(err, results){
            if (err) throw `Erro no banco: ${err}`

            callback();
        });
    },

    delete(id, callback){
        db.query(`DELETE FROM chefs WHERE id = $1`, [id], function(err, results){
            if (err) throw `Erro no banco: ${err}`
            
            callback();
        });
    },

    teacherSelectOptions(callback){
        db.query(`SELECT name, id FROM recipes`, function(err, results){
            if (err) throw `Erro: ${err}`;

            callback(results.rows);
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
                SELECT *, ${totalQuery}
                FROM chefs
                ${filterQuery}
                LIMIT $1 OFFSET $2`


        db.query(query, [limit, offset], function(err, results){
            if(err) throw `Banco error: ${err}`;

            callback(results.rows);
        });

    }
      
}