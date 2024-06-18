import { get, ref } from 'firebase/database';
import { db } from '../../utils/firebase';

export default function getProjectIdByName(req, res){
    const { name } = req.body;
    try {
        get(ref(db, 'projects/')).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    if(childSnapshot.val().name == name){
                        return res.status(200).json(childSnapshot.key);
                    }
                });
            } else {
                return res.status(200).json([]);
            }
        })
    } catch (error) {
        console.error('Error al obtener el proyecto:', error);
        return res.status(500).json({ message: 'Error al obtener el proyecto.', error });
    }
}