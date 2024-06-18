// utils/units.js
import { getCookie } from "cookies-next";
import { db } from "./firebase";
import { onValue, push, ref, set } from "firebase/database";
import toast from "react-hot-toast";

export function getUnits(setUnits) {
  const unitsRef = ref(db, `projects/${getCookie("projectID")}/units`);
  onValue(unitsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const units = Object.keys(data).map((key) => {
        return {
          id: key,
          unit: data[key].unit,
          state:data[key].state,
          tipology: data[key].tipology, // chequear con que tipologia coincide dentro de tipologies y acceder a la carpeta 
          floor: data[key].floor,
        };
      });
      setUnits(units);
      //console.log(units);
    } else {
      setUnits([]);
    }
  });
}

export function addUnit({Unidad,Estado, Tipologia, Piso }) {
  const unitsRef = ref(db, 'projects/' + getCookie("projectID") + '/units');
  push(unitsRef, {
    unit: Unidad,
    state: Estado,
    tipology: Tipologia,
    floor: Piso,
  })
}



//hacer una funcion que chequee los nombres de las tipologias.

// export function getUnitsWithTipologyData(){

//   const tipologyByID = {} // todo: leer getTypologyes, "A-501" : {"supCubiera" : 60 }
//   const units = getUnits() // todo : parametros

//   units.forEach(thisUnit => {
//     const thisTipology = tipologyByID[thisUnit.tipology]
//     Object.assign(thisUnit, thisTipology)
//   })
//   return units;
// } 


export function deleteUnit(unitId) {
  const unitRef = ref(
    db,
    `projects/${getCookie("projectID")}/units/${unitId}`
  );

  set(unitRef, null)
    .then(() => {
      toast.success("Unidad eliminada correctamente");
    })
    .catch((error) => {
      toast.error("Error al eliminar la unidad");
      console.error("Error deleting unit: ", error);
    });
}

export function updateUnit({ ID, Unidad, Estado, Tipologia, Piso }) {
  const unitRef = ref(db, `projects/${getCookie("projectID")}/units/${ID}`);
  set(unitRef, {
    unit: Unidad,
    state: Estado,
    tipology: Tipologia,
    floor: Piso,
  })

}