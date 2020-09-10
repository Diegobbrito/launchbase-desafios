 const multer = require('multer');

 const storage = multer.diskStorage({
     destination:(request, file, callback)=>{
         callback(null, './public/images');
     },
     filename: (resquest, file, callback) => {
         callback(null, `${Date.now().toString()}-${file.originalname}`);
     }
 });

 const fileFilter = (request, file, callback)=>{

    const isAccepted = ['image/png', 'image/jpg', 'image/jpeg']
    .find(acceptedFormat => acceptedFormat == file.mimetype)

    if(!isAccepted){
        return callback(null, false);
    }

    return callback(null, true);

 }

 module.exports = multer({
     storage,
     fileFilter
 });