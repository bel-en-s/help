import { getCookie } from 'cookies-next';
import { db } from './firebase';
import { onValue, ref } from 'firebase/database';

export function getUsers(setUsers) {
    const projectID = getCookie('projectID');
    let interactions = [];
    const query = ref(db, `projects/${projectID}/interactions`);
        onValue(query, (snapshot) => {
            if (snapshot.val()) {
                Object.keys(snapshot.val()).forEach((interaction) => {
                    interactions.push(snapshot.val()[interaction]);
                    //console.log(snapshot.val()[interaction]);
                });
            }
    });

    const usersQuery = ref(db, `users/${projectID}/users`);
    return onValue(usersQuery, (snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            const users = Object.keys(userData).map((userId) => {
                const user = userData[userId];
                let userInteractions = interactions.filter((interaction) => interaction.userID == userId);
                let totalTime = 0;
                userInteractions.forEach((interaction) => {
                    totalTime += parseInt(interaction.useTime);
                });

                let seconds = totalTime
                let minutes = 0
                let hours = 0 
                if (seconds > 60) {
                    minutes = Math.floor(seconds / 60);
                    seconds = seconds % 60;
                }
                if (minutes > 60) {
                    hours = Math.floor(minutes / 60);
                    minutes = minutes % 60;
                }

                let parsedTotalTime = `${hours}h ${minutes}m ${seconds}s`;
                let averageTime = hours > 0 ? `${Math.floor(totalTime / userInteractions.length / 3600)}h ${Math.floor(totalTime / userInteractions.length / 60)}m ${Math.floor(totalTime / userInteractions.length % 60)}s` : `${Math.floor(totalTime / userInteractions.length / 60)}m ${Math.floor(totalTime / userInteractions.length % 60)}s`;
                if(hours == 0 && minutes == 0 && seconds == 0) {
                    averageTime  = "0s";
                }
                
                return {
                    id: userId,
                    email: user.email,
                    name: user.name,
                    interactions: userInteractions,
                    totalTime: parsedTotalTime,
                    averageTime: averageTime,
                };
            });
            setUsers(users);
        } else {
            setUsers([]);
        }
    });
}