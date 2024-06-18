import { useEffect } from "react";
import { getCookie } from "cookies-next";
import { db, storage } from "./firebase";
import { onValue, push, ref, set, deleteObject, getDownloadURL, sRef, uploadBytes } from "firebase/database";
import toast from "react-hot-toast";

export function getProfileData(setData){
    useEffect(() => {
        const userRef = ref(db, 'users/' + getCookie("userId"));
        onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setData({
                    name: data.name,
                    lastName: data.lastName,
                    email: data.email,
                    role: data.role,
                    project: data.project,
                    client: data.client,
                });
            } else {
                setData({});
            }
        })
    }, []);
}

export function updateProfileData(data){
    const userRef = ref(db, 'users/' + getCookie("userId"));
    set(userRef, {
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        project: data.project,
        client: data.client,
    });
    toast.success('Perfil actualizado correctamente');
}