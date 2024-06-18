import { getCookie } from "cookies-next";
import { db } from "./firebase";
import { onValue, push, ref, set, get } from "firebase/database";
import toast from "react-hot-toast";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

export const tipologyHeaders = [
  "ID", "Plano", "Tipologia", "Sup. cubierta ", "Sup. Semi Cubierta", 
  "Sup. Amenities", "Sup. No Cubierta", "Sup. Total", "Ambientes", 
  "Q x Piso", "Pisos", "Nucleo", "Vestidor", 
  "Toilette", "Baño Principal", "Baño Secundario", "Cocina", 
  "Extracción en Cocina", "Lavadero", "Espacio Lava/Seca", "Piso Radiante", 
  "A/C VRV",
];

export const tipologyDataKeys = [
  "id", "file", "name", "supCubierta", "supSemiCubierta", 
  "supAmenities", "supNoCubierta", "supTotal", "ambientes", 
  "qxPiso", "pisos", "nucleo", "vestidor", 
  "toilette", "banoPrincipal", "banoSecundario", "cocina", 
  "extraccionEnCocina", "lavadero", "espacioLavaSeca", "pisoRadiante", 
  "acVRV", 
];

export const tipologyData = tipology => tipologyDataKeys.map(k => tipology[k]);

export async function uploadImage(file) {
  const storage = getStorage();
  const storageRefInstance = storageRef(storage, `tipologies/${file.name}`);
  const snapshot = await uploadBytes(storageRefInstance, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
}

export async function addTipology(tipologyByHeader, file) {
  const data = {};
  tipologyDataKeys.forEach((k, index) => {
      data[k] = tipologyByHeader[tipologyHeaders[index]];
  });

  if (file) {
      try {
          const uploadURL = await uploadImage(file);
          data.file = uploadURL;
          console.log("File uploaded successfully. URL:", uploadURL);
      } catch (error) {
          console.error("Error uploading file:", error);
          toast.error("Error al subir el archivo");
          return;
      }
  }

  // Remove undefined properties
  Object.keys(data).forEach(key => {
      if (data[key] === undefined) {
          delete data[key];
      }
  });

  console.log("Final data being pushed to Firebase:", data);

  push(ref(db, `projects/${getCookie("projectID")}/tipologies`), data)
      .then(() => {
          toast.success("Tipología añadida correctamente");
      })
      .catch((error) => {
          toast.error("Error al añadir la tipología");
          console.error("Error adding tipology: ", error);
      });
}

export function getTipologies(setTipologies) {
  const tipologiesRef = ref(db, `projects/${getCookie("projectID")}/tipologies`);
  onValue(tipologiesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const tipologies = Object.keys(data).map((key) => {
        return {
          id: key,
          name: data[key].name,
          supCubierta: data[key].supCubierta,
          supSemiCubierta: data[key].supSemiCubierta,
          supAmenities: data[key].supAmenities,
          supNoCubierta: data[key].supNoCubierta,
          supTotal: data[key].supTotal,
          ambientes: data[key].ambientes,
          qxPiso: data[key].qxPiso,
          pisos: data[key].pisos,
          nucleo: data[key].nucleo,
          vestidor: data[key].vestidor,
          toilette: data[key].toilette,
          banoPrincipal: data[key].banoPrincipal,
          banoSecundario: data[key].banoSecundario,
          cocina: data[key].cocina,
          extraccionEnCocina: data[key].extraccionEnCocina,
          lavadero: data[key].lavadero,
          espacioLavaSeca: data[key].espacioLavaSeca,
          pisoRadiante: data[key].pisoRadiante,
          acVRV: data[key].acVRV,
          file: data[key].file,
        };
      });
      setTipologies(tipologies);
    } else {
      setTipologies([]);
    }
  });
}

export async function updateTipology(tipologyByHeader, file) {
  const data = {};
  tipologyDataKeys.forEach((k, index) => data[k] = tipologyByHeader[tipologyHeaders[index]]);

  if (file) {
      try {
          const imageUrl = await uploadImage(file);
          data.file = imageUrl;
      } catch (error) {
          console.error("Error uploading file:", error);
          toast.error("Error al subir el archivo");
          return;
      }
  }

  // Remove undefined properties
  Object.keys(data).forEach(key => {
      if (data[key] === undefined) {
          delete data[key];
      }
  });

  console.log("updateTipology", data);

  const tipologyRef = ref(db, `projects/${getCookie("projectID")}/tipologies/${data.id}`);
  set(tipologyRef, data)
      .then(() => {
          toast.success("Tipología actualizada correctamente");
      })
      .catch((error) => {
          toast.error("Error al actualizar la tipología");
          console.error("Error updating tipology: ", error);
      });
}

export function deleteTipology(tipologyId) {
  const tipologyRef = ref(
    db,
    `projects/${getCookie("projectID")}/tipologies/${tipologyId}`
  );

  set(tipologyRef, null)
    .then(() => {
      toast.success("Tipología eliminada correctamente");
    })
    .catch((error) => {
      toast.error("Error al eliminar la tipología");
      console.error("Error deleting tipology: ", error);
    });
}


export async function deleteFile(tipologyId) {
  console.log('delete');
  const tipologyRef = ref(db, `projects/${getCookie("projectID")}/tipologies/${tipologyId}`);
  const snapshot = await get(tipologyRef);
  if (snapshot.exists()) {
    const tipologyData = snapshot.val();
    if (tipologyData.file) {
      const storage = getStorage();
      const fileRef = storageRef(storage, `tipologies/${tipologyData.file.split('%2F')[1].split('?')[0]}`);
      await deleteObject(fileRef);
    }
  }
}