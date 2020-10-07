const db = require('../../config/db');
const fs = require('fs');

module.exports = {
    create({filename, path}){
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ( $1, $2 )
            RETURNING id
        `

        const values = [
            filename,
            path
        ]

        return db.query(query, values);
    },
    recipecreate(recipeId, fileId){
        const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ( $1, $2 )
            RETURNING id
        `
        
        const values = [
            recipeId,
            fileId
        ]

        return db.query(query, values);
    },
    async delete(id){ 
        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
            const file = result.rows[0];
            
            fs.unlinkSync(file.path);
            
            return db.query(`DELETE from files WHERE id = $1`, [id])
        } catch (error) {
            console.error(error);
        }
    },
    async deleteRecipe(id){
        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
            const file = result.rows[0];
            
            fs.unlinkSync(file.path);
            
            return db.query(`
                DELETE from files
                USING recipe_files
                WHERE recipe_files.file_id = files.id 
                AND files.id = $1`, [id]);
        } catch (error) {
            console.error(error);
        }
    }
   
}