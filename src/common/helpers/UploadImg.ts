import { unlinkSync } from 'fs';
import { v2 as cloudinary } from 'cloudinary';

//Configuramos el cloudinary
const configCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || '',
    api_key: process.env.API_KEY || '',
    api_secret: process.env.API_SECRET || '',
  });
  console.log(cloudinary)
  return cloudinary;
};

//Funcion para subir cosas a cloudinary
export const subirImagenACloudinary = async (file: any) => {
  try {
    const cloudinary = configCloudinary();
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
    );
    //Eliminamos la imagen de nuestro backend una vez se suba al cloudinary
        unlinkSync(file.path)
    return {
      secure_url,
      public_id,
    };
  } catch (error:any) {

  }
};


//Funcion para eliminar una imagen de cloudinary

export const eliminarImagenCloudinary= async(public_id:string)=>{
    try {
      const cloudinary = configCloudinary()
      await cloudinary.uploader.destroy(public_id);  
    } catch (error:any) {
        console.log("Error en la funcion eliminarImagenCloudinary :" , error.message);
    }

}