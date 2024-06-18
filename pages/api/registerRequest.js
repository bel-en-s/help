import { ref, push, get, set } from "firebase/database";
import { db } from "../../utils/firebase";

export default function registerRequest(req, res) {
    const { projectID, deviceUniqueID } = req.body;

    push(ref(db, 'projects/' + projectID + '/registerRequests/'), {
        deviceUniqueID: deviceUniqueID,
        createdAt: new Date().toISOString(),
    }).then(() => {
        return res.status(200).json({ message: 'Solicitud de registro creada correctamente.' });
    }).catch((error) => {
        return res.status(500).json({ message: 'Error al crear la solicitud de registro:', error });
    });
}