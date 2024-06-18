import { ref, set } from "firebase/database";
import { db } from "../../utils/firebase";

export default function deleteUser(req, res) {
    try {
        const { userID, projectID } = req.body;
        if (!userID || !projectID) {
            return res.status(500).json({ message: 'Faltan datos obligatorios.' });
        }

        const userRef = ref(db, `projects/${projectID}/users/${userID}`);

        set(userRef, null).then(() => {
            return res.status(200).json({ message: 'Usuario eliminado correctamente.' });
        })
        .catch((error) => {
            console.error('Error al eliminar el usuario:', error);
            return res.status(500).json({ message: 'Error al eliminar el usuario.', error });
        });
    } catch (error){
        console.error('Error al eliminar el usuario:', error);
        return res.status(500).json({ message: 'Error al eliminar el usuario.', error });
    }
}