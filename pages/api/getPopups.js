import { get, ref } from 'firebase/database';
import { db } from '../../utils/firebase';

export default async function getPopUps(req, res) {
    const { projectID } = req.body;
    try {
        const snapshot = await get(ref(db, `projects/${projectID}/popUps`));
        if (snapshot.exists()) {
            let popUps = [];
            snapshot.forEach((childSnapshot) => {
                const popUpData = childSnapshot.val();
                const imagesArray = Array.isArray(popUpData.Imagenes) ? popUpData.Imagenes : [];
                const imagesObject = {};
                imagesArray.forEach((url, index) => {
                    imagesObject[index + 1] = url;  // start keys from 1
                });

                popUps.push({
                    id: childSnapshot.key,
                    title: popUpData.Titulo,
                    description: popUpData.Descripcion,
                    footer: popUpData.Footer,
                    file: imagesObject
                });
            });
            return res.status(200).json(popUps);
        } else {
            return res.status(200).json([]);
        }
    } catch (error) {
        console.error('Error al obtener los popUps:', error);
        return res.status(500).json({ message: 'Error al obtener los popUps.', error });
    }
}
