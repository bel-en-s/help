import { get, ref } from 'firebase/database';
import { db } from '../../utils/firebase';
import NextCors from 'nextjs-cors';

async function getTipologiesData() {
    const snapshot = await get(ref(db, 'projects/-NyMYDnK3-S2jOlmuO3O/tipologies'));
    const tipologies = [];
    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            tipologies.push({
                id: childSnapshot.key,
                name: childSnapshot.val().name,
                supCubierta: childSnapshot.val().supCubierta,
                supSemiCubierta: childSnapshot.val().supSemiCubierta,
                supAmenities: childSnapshot.val().supAmenities,
                supNoCubierta: childSnapshot.val().supNoCubierta,
                supTotal: childSnapshot.val().supTotal,
                ambientes: childSnapshot.val().ambientes,
                qxPiso: childSnapshot.val().qxPiso,
                pisos: childSnapshot.val().pisos,
                nucleo: childSnapshot.val().nucleo,
                vestidor: childSnapshot.val().vestidor,
                toilette: childSnapshot.val().toilette,
                banoPrincipal: childSnapshot.val().banoPrincipal,
                banoSecundario: childSnapshot.val().banoSecundario,
                cocina: childSnapshot.val().cocina,
                extraccionEnCocina: childSnapshot.val().extraccionEnCocina,
                lavadero: childSnapshot.val().lavadero,
                espacioLavaSeca: childSnapshot.val().espacioLavaSeca,
                pisoRadiante: childSnapshot.val().pisoRadiante,
                acVRV: childSnapshot.val().acVRV,
                file: childSnapshot.val().file
            });
        });
    }
    return tipologies;
}

async function getUnitsData() {
    const snapshot = await get(ref(db, 'projects/-NyMYDnK3-S2jOlmuO3O/units'));
    const units = [];

    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            units.push({
                id: childSnapshot.key,
                unit: childSnapshot.val().unit,
                tipology: childSnapshot.val().tipology,
                floor: childSnapshot.val().floor,
            });
        });
    }
    return units;
}

export default async function getUnitsAndTipologies(req, res) {
    await NextCors(req, res, {
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    try {
        const tipologies = await getTipologiesData();
        const units = await getUnitsData();

        const tipologyByName = tipologies.reduce((acc, tipology) => { //acc = acumulador
            acc[tipology.name] = tipology;
            return acc;
        }, {});

        const UnitsAndTipologies = units.map(unit => {
            const matchedTipology = tipologyByName[unit.tipology];
            return {
                ...unit,
                ...matchedTipology
            };
        });

        return res.status(200).json( UnitsAndTipologies );
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Error fetching data.', error });
    }
}
