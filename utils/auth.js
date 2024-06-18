import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, signInWithCredential } from "firebase/auth";
import { getDatabase, ref, set, onValue, push } from "firebase/database";
import { db } from "./firebase";
import { getCookie, setCookie } from "cookies-next";
import toast from "react-hot-toast";

export function signUp({name, email, password, project, role, userEmail, userPassword}) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const usersRef = ref(db, 'users/' + userCredential.user.uid);
            set(usersRef, {
                name: name,
                email: email,
                project: project,
                role: role,
                createdAt: new Date().toISOString()
            });
            toast.success('Usuario creado');
            signInWithEmailAndPassword(auth, userEmail, userPassword)
        })
        .catch((error) => {
            toast.error(error.message);
            console.log('error');
        });
}

export function logIn(email, password) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            window.location.href = '/';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            toast.error('Usuario o contraseña incorrecta');
        });
}

export function logOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
        // Sign-out successful.
        // console.log('logged out')
        window.location.href = '/login';
    }).catch((error) => {
        // An error happened.
    });
}

export function updatePasswordUser(currentPassword, newPassword) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, auth.currentUser.email, currentPassword)
        .then((userCredential) => {
            updatePassword(auth.currentUser, newPassword)
                .then(() => {
                    // Update successful.
                    toast.success('Contraseña actualizada correctamente');
                }).catch((error) => {
                    console.log(error);
                    toast.error('Error al actualizar la contraseña');
                });
            // ...
        })
        .catch((error) => {
            toast.error('Contraseña actual incorrecta');
        });
}


export function authState(setUser, route) {
    console.log(route);
    const VIEWER_ROUTES = ["perfil", "inicio", "proyectos", "administrador panel"];
    const ADMIN_ROUTES = ["perfil", "dashboard", "inicio", "administrador", "perfil", "proyectos", "administrador panel"];
    const SUPERADMIN_ROUTES = ["profile", "perfil","dashboard", "proyectos", "users", "interactions", "experiences", "administrador", "", "settings", "inicio", "administrador panel"];
    const EXEPTIONS = ["login", "signup", "error", "administrador panel"]

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const roleQuery = ref(db, "users/" + user.uid + "/role");
            return onValue(roleQuery, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const role = data;
                    let views = [];
                    if (role == "viewer" && VIEWER_ROUTES.includes(route) || EXEPTIONS.includes(route)) {
                        views = VIEWER_ROUTES;
                    } else if (role == "admin" && ADMIN_ROUTES.includes(route) || EXEPTIONS.includes(route)) {
                        views = ADMIN_ROUTES;
                    } else if (role == "superadmin" && SUPERADMIN_ROUTES.includes(route) || EXEPTIONS.includes(route)) {
                        views = SUPERADMIN_ROUTES;
                    } else {
                        window.location.href = '/error';
                    }
                    setUser({
                        email: user.email,
                        role: role,
                        views: views,
                    });
                    setCookie("userId", user.uid);
                } else {
                    setCookie("userId", "");
                    // console.log("No data available");
                }
            });
        } else {
            window.location.href = '/login';
        }
    });
}