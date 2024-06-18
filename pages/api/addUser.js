import { ref, push, get, set } from "firebase/database";
import { db } from "../../utils/firebase";

export default function addUser(req, res) {
    try {
        const { name, email, country, phone, company, projectID, deviceUniqueID } = req.body;
        if (!name || !email) {
            return res.status(500).json({ message: 'Faltan datos obligatorios.' });
        }

        get(ref(db, "/projects/" + projectID + 'users/')).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.val().email == email) {
                        return res.status(500).json({ message: 'Ya existe un usuario con ese email.', user: childSnapshot.val() });
                    }
                });
            }
        })

        push(ref(db, "/projects/" + projectID + '/users/'), {
            name: name,
            email: email,
            country: country,
            phone: phone,
            company: company,
            deviceUniqueID: deviceUniqueID,
            createdAt: new Date().toISOString(),
        }).then(() => {
            return res.status(200).json({ user: { name, email, country, phone, company, deviceUniqueID }, message: 'Usuario creado correctamente.' });
        })
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        return res.status(500).json({ message: 'Error al crear el usuario.', error });
    }
}