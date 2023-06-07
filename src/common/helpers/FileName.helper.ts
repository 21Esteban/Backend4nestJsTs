import {v4 as uudi} from 'uuid'

type callBackFuntionVariadic=(...args:any[])=>void

export const fileName=(req:any,file:Express.Multer.File,callback:callBackFuntionVariadic)=>{
    if (!file) return callback(new Error("No selecciono un archivo"))

    const fileExtension = file.mimetype.split('/')[1].toLowerCase();

    const fileName = uudi() + "-" + fileExtension

    callback(null,fileName)
}