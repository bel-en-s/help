import { useEffect } from "react";
import { getCookie } from "cookies-next";
import { db, storage } from "./firebase";
import { ref as sRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { ref, push, onValue, set } from "firebase/database";
import toast from "react-hot-toast";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";

export function addFile(file) {
    const loadingToast = toast.loading('Subiendo archivo...');
    if(file) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const aspectRatio = img.width / img.height;
            if (![1, 16 / 9, 4 / 3].includes(aspectRatio)) {
                toast.error('El archivo debe tener una relación de aspecto de 1:1, 16:9 o 4:3');
                toast.dismiss(loadingToast);
                return;
            }

       let mediaGridQtyItemsQuery = ref(db, 'projects/' + getCookie("projectID") + '/mediaGrid');
            let qtyItems = 0;
            onValue(mediaGridQtyItemsQuery, (snapshot) => {
                const data = snapshot.val();
                if (snapshot.exists()) {
                    qtyItems = Object.keys(data).length;
                }
            });
        if (qtyItems >= 10) {
            toast.dismiss();
            toast.error('No se pueden subir más de 10 archivos');
            return;
        }

        const storageRef = sRef(storage, 'projects/' + getCookie("projectID") + '/mediaGrid/' + file.name);
        uploadBytes(storageRef, file)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    push(ref(db, 'projects/' + getCookie("projectID") + '/mediaGrid'), {
                        file: downloadURL,
                        fileName: file.name,
                        createdAt: Date.now(),
                        position: qtyItems,
                        type: file.type,
                        width: img.width,
                        height: img.height,
                    });
                    toast.dismiss();
                    toast.success('Archivo subido correctamente');
                });
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
                toast.dismiss();
                toast.error('Error al subir el archivo');
            });
    };
    } else {
        toast.dismiss();
        toast.error('No se seleccionó ningún archivo');
    }
}

export function getFiles(setFiles) {
    useEffect(() => {
        const query = ref(db, "projects/" + getCookie("projectID") + "/mediaGrid");
        return onValue(query, (snapshot) => {
            const data = snapshot.val();
            if (snapshot.exists()) {
                const files = Object.keys(data).map((fileId) => ({
                    id: fileId,
                    file: data[fileId].file,
                    fileName: data[fileId].fileName,
                    position: data[fileId].position,
                    createdAt: data[fileId].createdAt,
                    type: data[fileId].type,
                    width: data[fileId].width,
                    height: data[fileId].height,
                }));

                files.sort((a, b) => a.position - b.position);
                setFiles(files);
            }
        });
    }, [setFiles]);
}

export function changePosition(fileId, position, setFiles) {
    const mediaGridsRef = ref(db, 'projects/' + getCookie("projectID") + '/mediaGrid/');
    let files

    onValue(mediaGridsRef, (snapshot) => {
        const data = snapshot.val();
        if (snapshot.exists()) {
            files = Object.keys(data).map((fileId) => ({
                id: fileId,
                position: data[fileId].position,
                file: data[fileId].file,
                fileName: data[fileId].fileName,
                createdAt: data[fileId].createdAt,
                type: data[fileId].type,
                width: data[fileId].width,
                height: data[fileId].height,
            }));

            files.forEach((file, index) => {
                if (file.id == fileId) {
                    if (position == "left") {
                        if(file.position != 0) {
                            file.position = file.position - 1;
                            files.forEach((file, index) => {
                                if(file.position + 1 == file.position) {
                                    file.position = file.position + 1;
                                } 
                            });
                        }
                    } else {
                        if(file.position != files.length - 1) {
                            file.position = file.position + 1;
                        }
                        files.forEach((file, index) => {
                            if(file.position - 1 == file.position) {
                                file.position = file.position - 1;
                            } 
                        });
                    }
                }
            });
        }
    });
    set(mediaGridsRef, files);
}

export async function deleteFile(tipologyId) {
    try {
      const tipologyRef = ref(db, `projects/${getCookie("projectID")}/tipologies/${tipologyId}`);
      const snapshot = await get(tipologyRef);
  
      if (snapshot.exists()) {
        const tipologyData = snapshot.val();
  
        if (tipologyData.file) {
          const storage = getStorage();
          const filePath = decodeURIComponent(tipologyData.file.split('/').pop().split('?')[0]);
          const fileStorageRef = storageRef(storage, `tipologies/${filePath}`);
  
          await deleteObject(fileStorageRef);
          toast.success('Archivo eliminado correctamente');
        }
      }
  
      // Delete the tipology entry from the database
      await set(tipologyRef, null);
    } catch (error) {
      toast.error('Error al eliminar el archivo');
      console.error('Error deleting file: ', error);
    }
  }