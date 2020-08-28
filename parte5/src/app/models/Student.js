const db = require('../../config/db');
const { date } = require('../../lib/utils');

module.exports = {

    all(callback){
        db.query(`
            SELECT * 
            FROM students 
            ORDER BY name ASC
            `, function(err, results){
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
                week_time,
                student_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
            `
        const values = [
            data.name,
            data.avatar_url,
            date(data.birth_date).iso,
            data.email,
            data.education_level,
            data.week_time,
            data.student
        ]

        db.query(query, values, function(err, results){            
            if (err) throw `Erro no banco: ${err}`

            callback(results.rows[0]);
        });
    },

    find(id, callback){
        db.query(`
            SELECT students.*, teachers.name AS teacher_name
            FROM students
            LEFT JOIN teachers
            ON (teachers.id = students.teacher_id)
            WHERE students.id = $1
        `, [id], function(err, results){
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
            week_time = ($6),
            teacher_id = ($7)
        WHERE id = ($8)
        `
        const values = [
            data.name,
            data.avatar_url, 
            date(data.birth_date).iso,
            data.email,
            data.education_level,
            data.week_time,
            data.teacher,
            data.id,

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
    },

    teacherSelectOptions(callback){
        db.query(`SELECT name, id FROM teachers`, function(err, results){
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
                FROM students
                ) AS total`;
        
        if( filter ){
            filterQuery = `
            WHERE name ILIKE '%${filter}%'
            `
            totalQuery = `(
                SELECT count(*) 
                FROM students 
                ${filterQuery}
                ) AS total`
        }

        query = `
                SELECT students.*, ${totalQuery}
                FROM students
                ${filterQuery}
                LIMIT $1 OFFSET $2`


        db.query(query, [limit, offset], function(err, results){
            if(err) throw `Banco error: ${err}`;

            callback(results.rows);
        });

    }
    
    
}