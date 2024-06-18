import toast from 'react-hot-toast';
import { db } from './firebase';
import { onValue, ref, push } from 'firebase/database';
import { getCookie } from 'cookies-next';

export function getPanelUsers(setUsers) {
    let projectID = getCookie('projectID');
    const usersQuery = ref(db, `users`);
    onValue(usersQuery, (snapshot) => {
        const data = snapshot.val();
        let users = [];
        for (let user in data) {
            if(data[user]
                // .project === projectID
                ) {
                users.push({
                    id: user,
                    name: data[user].name,
                    email: data[user].email,
                    project: data[user].project,
                    role: data[user].role,
                    client: data[user].client,
                    createdAt: data[user].createdAt
                });
            }
        }
        setUsers(users);
    });
}