import { useEffect } from "react";
import { getCookie } from "cookies-next";
import { db, storage } from "./firebase";
import { ref, push, onValue, set } from "firebase/database";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export function getPopUps(setPopUps) {
    const projectID = getCookie("projectID");
    const query = ref(db, "projects/" + projectID + "/popUps");

    onValue(query, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const popUps = Object.keys(data).map((popUpId) => ({
                id: popUpId,
                title: data[popUpId].Titulo,
                description: data[popUpId].Descripcion,
                footer: data[popUpId].Footer,
                file: data[popUpId].Imagenes,
            }));
            setPopUps(popUps);
        } else {
            setPopUps([]);
        }
    });
}

const uploadImagesToStorage = async (images) => {
    const storage = getStorage();
    const imageUrls = [];

    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageRef = sRef(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        const downloadURL = await getDownloadURL(imageRef);
        imageUrls.push(downloadURL);
    }

    return imageUrls;
};

export const addPopUp = async (popUp) => {
    const popUpData = {
        Titulo: popUp.Titulo,
        Descripcion: popUp.Descripcion,
        Footer: popUp.Footer,
        Imagenes: await uploadImagesToStorage(popUp.Imagenes)
    };

    const popUpsRef = ref(db, 'projects/' + getCookie("projectID") + '/popUps');
    push(popUpsRef, popUpData);
};

export function deletePopUp(popUpId) {
    const popUpRef = ref(db, `projects/${getCookie("projectID")}/popUps/${popUpId}`);
    set(popUpRef, null);

    if (popUpRef.file) {
        deleteObject(sRef(storage, 'projects/' + getCookie("projectID") + '/popUps/' + popUpId + '/image.png'));
    }
}

export function deletePopUpFile(popUpId) {
    const popUpRef = ref(db, `projects/${getCookie("projectID")}/popUps/${popUpId}/file`);
    set(popUpRef, null);
    // deleteObject(sRef(storage, 'projects/' + getCookie("projectID") + '/popUps/' + popUpId + '/image.png'))
}

export function updatePopUp({ ID, title, description, footer, status, file, previewFile }) {
    const popUpRef = ref(db, `projects/${getCookie("projectID")}/popUps/${ID}`);
    if (file) {
        const storageRef = sRef(storage, 'projects/' + getCookie("projectID") + '/popUps/' + ID + '/' + 'image.png');
        uploadBytes(storageRef, file)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    set(popUpRef, {
                        Titulo: title,
                        Descripcion: description,
                        Footer: footer,
                        Imagenes: downloadURL,
                        Status: status
                    });
                });
            });
    } else {
        if (previewFile) {
            set(popUpRef, {
                Titulo: title,
                Descripcion: description,
                Footer: footer,
                Status: status
            });
        } else {
            set(popUpRef, {});
        }
    }
}