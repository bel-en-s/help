import { get, ref } from 'firebase/database';
import { db } from '../../utils/firebase';
import { width } from '@fortawesome/free-solid-svg-icons/fa0';

export default function getMultimediaGrid(req, res) {
    const { projectID } = req.body;
    try {
        get(ref(db, 'projects/' + projectID + "/mediaGrid")).then((snapshot) => {
            if (snapshot.exists()) {
                let multimediaGrid = []
                snapshot.forEach((childSnapshot) => {
                    multimediaGrid.push({
                        id: childSnapshot.key,
                        title: childSnapshot.val().title,
                        description: childSnapshot.val().description,
                        file: childSnapshot.val().file,
                        type: childSnapshot.val().type,
                        width: childSnapshot.val().width,
                        height: childSnapshot.val().height,
                        fileName: childSnapshot.val().fileName,
                    })
                });
                return res.status(200).json(multimediaGrid);
            } else {
                return res.status(200).json([]);
            }
        })
    } catch (error) {
        console.error('Error al obtener la grilla de multimedia:', error);
        return res.status(500).json({ message: 'Error al obtener la grilla de multimedia.', error });
    }
}