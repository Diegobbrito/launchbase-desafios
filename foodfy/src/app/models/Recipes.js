const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {

    all(callback){
        db.query(`
            SELECT recipes.*, chefs.name as chef_name
            FROM recipes
            LEFT JOIN chefs
            ON (chefs.id = recipes.chef_id)
            `, function(err, results){
            if (err) throw `Erro no banco: ${err}`
            callback(results.rows)
        });
    },

    create(data, callback){
        const query =  `
            INSERT INTO public.recipes (
                chef_id,
                image, 
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
            `
        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(data.created_at).iso
        ]

        db.query(query, values, function(err, results){            
            if (err) throw `Erro no banco: ${err}`

            callback(results.rows[0]);
        });
    },

    find(id, callback){
        db.query(`
            SELECT recipes.*, chefs.name as chef_name
            FROM recipes
            LEFT JOIN chefs
            ON (chefs.id = recipes.chef_id)
            WHERE recipes.id = $1
        `, [id], function(err, results){
            if(err) throw `Erro no banco: ${err}`

            callback(results.rows[0]);
        });
    },

    update(data, callback){
        const query = `
        UPDATE recipes SET
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
        db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(err, results){
            if (err) throw `Erro no banco: ${err}`
            
            callback();
        });
    },

    chefsSelectOptions(callback){
        db.query(`SELECT name, id FROM chefs`, function(err, results){
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
                FROM recipes
                ) AS total`;
        
        if( filter ){
            filterQuery = `
            WHERE title ILIKE '%${filter}%'
            `
            totalQuery = `(
                SELECT count(*) 
                FROM recipes 
                ${filterQuery}
                ) AS total`
        }

        query = `
                SELECT recipes.*, ${totalQuery}
                ,chefs.name as chef_name
                FROM recipes
                LEFT JOIN chefs
                ON (chefs.id = recipes.chef_id)
                ${filterQuery}
                LIMIT $1 OFFSET $2`


        db.query(query, [limit, offset], function(err, results){
            if(err) throw `Banco error: ${err}`;

            callback(results.rows);
        });

    }
      
}