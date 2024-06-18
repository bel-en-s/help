import { get, ref } from 'firebase/database';
import { db } from '../../utils/firebase';

export default function getScenes(req, res) {
    const { projectID } = req.body;
    try {
        get(ref(db, 'projects/' + projectID + "/scenes")).then((snapshot) => {
            if (snapshot.exists()) {
                let scenes = [];
                snapshot.forEach((childSnapshot) => {
                    scenes.push({
                        id: childSnapshot.key,
                        description: childSnapshot.val().description,
                        name: childSnapshot.val().name,
                        status: childSnapshot.val().status,
                    });
                });
                return res.status(200).json(scenes);
            }
        })
    } catch (error) {
        console.error('Error al obtener las escenas:', error);
        return res.status(500).json({ message: 'Error al obtener las escenas.', error });
    }
}