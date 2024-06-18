import { ref, push, get, set } from "firebase/database";
import { db } from "../../utils/firebase";

export default function addInteraction(req, res) {
    const { experience, useTime, userID, OS, projectID, deviceUniqueID } = req.body;

    // if (!experience || !useTime || !userID) {
    //     return res.status(500).json({ message: 'Faltan datos obligatorios.' });
    // }

    get(ref(db, "projects/" + projectID + '/users/' + userID)).then((snapshot) => {
        if (!snapshot.exists()) {
            return res.status(500).json({ message: 'No existe un usuario con ese ID.' });
        }
    })

    push(ref(db, 'projects/' + projectID + '/interactions/'), {
        experience: experience,
        useTime: useTime,
        userID: userID,
        deviceUniqueID: deviceUniqueID,
        OS: OS,
        createdAt: new Date().toISOString(),
    }).then(() => {
        return res.status(200).json({ message: 'Interacción creada correctamente.' });
    }).catch((error) => {
        return res.status(500).json({ message: 'Error al crear la interacción:', error });
    });
}