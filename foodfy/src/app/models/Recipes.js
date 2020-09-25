const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {

    all(){
        return db.query(`
            SELECT recipes.*, chefs.name as chef_name
            FROM recipes
            LEFT JOIN chefs
            ON (chefs.id = recipes.chef_id)
            `
        );
    },

    create(data, callback){
        const query =  `
            INSERT INTO public.recipes (
                chef_id,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
            `
        const values = [
            data.chef_id,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(data.created_at).iso
        ]

        db.query(query, values, function(err, results){            
            if (err) throw `Erro no banco: ${err}`

            callback(results.rows[0].id);
        });
    },

    find(id){
        return db.query(`
            SELECT recipes.*, chefs.name as chef_name
            FROM recipes
            LEFT JOIN chefs
            ON (chefs.id = recipes.chef_id)
            WHERE recipes.id =  $1
        `, [id]);
    },

    update(data, callback){
        const query = `
            UPDATE recipes SET
                chef_id = ($1),
                title = ($2),
                ingredients = ($3),
                preparation = ($4),
                information = ($5)
            WHERE id = ($6)
        `
        const values = [
            data.chef_id,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
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
        return db.query(`SELECT name, id FROM chefs`);
    },

    paginate(params){

        const { filter, limit, offset } = params;


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
                SELECT recipes.*, ${totalQuery}, chefs.name as chef_name
                FROM recipes
                LEFT JOIN chefs
                ON (chefs.id = recipes.chef_id)
                ${filterQuery}
                LIMIT $1 OFFSET $2`

        return db.query(query, [limit, offset]);

    },
    files(id){
        return db.query(`
            SELECT files.*
            FROM files
            JOIN  recipe_files
            ON (files.id = recipe_files.file_id)
            JOIN  recipes
            ON (recipe_files.recipe_id = recipes.id)
            WHERE recipes.id =  $1
        `, [id]);
    }
      
}