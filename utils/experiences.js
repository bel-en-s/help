import React from "react";
import { db } from "./firebase";
import { onValue, ref } from "firebase/database"; 
import { getCookie } from "cookies-next";

export function getExperiences(setExperiences) {
    const projectID = getCookie("projectID");

    const query = ref(db, `projects/${projectID}/interactions`);
    return onValue(query, (snapshot) => {
        const data = snapshot.val();

        if (!data) {
            setExperiences([]);
            return;
        }

        let interactions = Object.values(data);
        let experiences = [];

        interactions.forEach((value) => {
            let useTime = parseInt(value.useTime);
            if (experiences[value.experience]) {
                experiences[value.experience] = [experiences[value.experience][0] + 1, experiences[value.experience][1] + useTime];
                experiences[value.experience][1] += useTime;
            } else {
                experiences[value.experience] = [1, useTime];
            }
        });

        let experiencesList = []

        for (let key in experiences) {
            let parsedTime = experiences[key][1];
            let seconds = parsedTime;
            let minutes = 0;
            let hours = 0;

            let uniqueUsers = []
            for (let i = 0; i < interactions.length; i++) {
                if (interactions[i].experience == key) {
                    if (!uniqueUsers.includes(interactions[i].userID)) {
                        uniqueUsers.push(interactions[i].userID);
                    }
                }
            }

            if (seconds > 60) {
                minutes = Math.floor(seconds / 60);
                seconds = seconds % 60;
            }
            if (minutes > 60) {
                hours = Math.floor(minutes / 60);
                minutes = minutes % 60;
            }

            let parsedTotalTime = `${hours}h ${minutes}m ${seconds}s`;
            if (hours == 0 && minutes == 0 && seconds == 0) {
                parsedTotalTime = "0s";
            }

            let averageTime = hours > 0 ? `${Math.floor(experiences[key][1] / experiences[key][0] / 3600)}h ${Math.floor(experiences[key][1] / experiences[key][0] / 60)}m ${Math.floor(experiences[key][1] / experiences[key][0] % 60)}s` : `${Math.floor(experiences[key][1] / experiences[key][0] / 60)}m ${Math.floor(experiences[key][1] / experiences[key][0] % 60)}s`;
            if (hours == 0 && minutes == 0 && seconds == 0) {
                averageTime = "0s";
            }

            experiencesList.push({
                name: key,
                count: experiences[key][0],
                useTime: parsedTotalTime,
                averageTime: averageTime,
                uniqueUsers: uniqueUsers.length
            });
        }

        setExperiences(experiencesList);
    })
}