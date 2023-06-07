type callBackFuntionVariadic=(...args:any[])=>void


export const fileFilter=(req:any,file:Express.Multer.File,callback:callBackFuntionVariadic)=>{
    if(!file){return callback(new Error("no file selected"))}
    const fileType = file.mimetype.split("/")[1].toLowerCase();

    const validExtensions=['jpg','jpeg','png','svg','gif']

    //el includes es como el in en python 
    // if(validExtensions.includes(fileType)){
    //     return callback(null,true)
    // }

    //**Esta vez no voy a usar el includes y voy a probar mi propio algoritmo para comprobar si se encuentra ese fileType en el arreglo validExtensions */
    for ( let i=0; i < validExtensions.length;i++){
        if (validExtensions[i] === fileType){
            return callback(null,true)
        }
    }

    req.fileValidationError=`El archivo no es valido debe ser ${validExtensions.join(",")}`
    return callback(null,false)
    
}