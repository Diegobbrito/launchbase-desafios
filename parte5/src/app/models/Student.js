const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {

    all(callback){
        db.query(`SELECT * FROM students ORDER BY name ASC`, function(err, results){
            if (err) throw `Erro no banco: ${err}`
            
            callback(results.rows)
        });
    },

    create(data, callback){
        const query =  `
            INSERT INTO public.students (
                name,
                avatar_url,
                birth_date,
                email,
                education_level,
                week_time
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
            `
        const values = [
            data.name,
            data.avatar_url,
            date(data.birth_date).iso,
            data.email,
            data.education_level,
            data.week_time,
        ]

        db.query(query, values, function(err, results){            
            if (err) throw `Erro no banco: ${err}`

            callback(results.rows[0]);
        });
    },

    find(id, callback){
        db.query(`SELECT * FROM students WHERE id = $1`, [id], function(err, results){
            if(err) throw `Erro no banco: ${err}`

            callback(results.rows[0]);
        });
    },

    update(data, callback){
        const query = `
        UPDATE students SET
            name = ($1),
            avatar_url = ($2), 
            birth_date = ($3),
            email = ($4),
            education_level = ($5),
            week_time = ($6)
        WHERE id = ($7)
        `
        const values = [
            data.name,
            data.avatar_url, 
            date(data.birth_date).iso,
            data.email,
            data.education_level,
            data.week_time,
            data.id
        ]
        db.query(query, values, function(err, results){
            if (err) throw `Erro no banco: ${err}`

            callback();
        });
    },

    delete(id, callback){
        db.query(`DELETE FROM students WHERE id = $1`, [id], function(err, results){
            if (err) throw `Erro no banco: ${err}`
            
            callback();
        });
    }
}