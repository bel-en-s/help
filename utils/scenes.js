import { useEffect } from "react";
import { getCookie } from "cookies-next";
import { db, storage } from "./firebase";
import { onValue, push, ref, set, deleteObject, getDownloadURL, sRef, uploadBytes } from "firebase/database";
import toast from "react-hot-toast";

export function addScene({ Nombre, Descripcion, Estado}) {
    toast.loading('Creando escena...')
    if (!Nombre || !Descripcion || !Estado) {
        toast.dismiss();
        toast.error('Por favor, complete todos los campos');
        return;
    }
    push(ref(db, 'projects/' + getCookie("projectID") + '/scenes'), {
        name: Nombre,
        description: Descripcion,
        status: Estado,
    }).then(() => {
        toast.dismiss();
        toast.success('Escena creada correctamente');
    })
}

export function getScenes(setScenes) {

        const scenesRef = ref(db, 'projects/' + getCookie("projectID") + '/scenes');
        onValue(scenesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const scenes = Object.keys(data).map((key) => {
                    return {
                        id: key,
                        name: data[key].name,
                        description: data[key].description,
                        status: data[key].status,
                    };
                });
                setScenes(scenes);
                console.log(scenes);
            } else {
                setScenes([]);
            }

    } , []); 
}

export function deleteScene(sceneId) {
    const sceneRef = ref(db, `projects/${getCookie("projectID")}/scenes/${sceneId}`);

    set(sceneRef, null)
        .then(() => {
            toast.success('Escena eliminada correctamente');
        })
        .catch((error) => {
            toast.error('Error al eliminar la escena');
            console.error("Error deleting scene: ", error);
        });
}

export function updateScene({ ID, Nombre, Descripcion, Estado }) {
    console.log(ID, Nombre, Descripcion, Estado);

    const sceneRef = ref(db, `projects/${getCookie("projectID")}/scenes/${ID}`);
    set(sceneRef, {
        name: Nombre,
        description: Descripcion,
        status: Estado,
    }).then(() => {
        toast.success('Escena actualizada correctamente');
    }).catch((error) => {
        toast.error('Error al actualizar la escena');
        console.error("Error updating scene: ", error);
    })
}