import { get, ref } from 'firebase/database';
import { db } from '../../utils/firebase';

export default function getUserID(req, res) {
    const { projectID, email } = req.body;
    let found = false;
    try {
        get(ref(db, 'projects/' + projectID + "/users")).then((snapshot) => {
            console.log(email);
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.val().email == email) {
                        found = true;
                        return res.status(200).json({ id: childSnapshot.key });
                    }
                });
                if (!found) {
                    return res.status(500).json({ message: 'No se encontró el usuario.' });
                }
            }
        })
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        return res.status(500).json({ message: 'Error al obtener los usuarios.', error });
    }
}