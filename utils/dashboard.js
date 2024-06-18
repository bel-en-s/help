import { useState, useEffect } from "react";
import { db } from "./firebase";
import { onValue, ref } from "firebase/database"; 
import { getCookie } from "cookies-next";

function generateLabels(days) {
    let today = new Date()
    let labels = []
    for (let i = days - 1; i >= 0; i--) {
        let date = new Date(today);
        date.setDate(today.getDate() - i);
        let parsedDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
        labels.push(parsedDate)
    }
    return labels
}

export default function getDashboardData(setDashboardData, selectedFilter) {
    let labels = []
    if(selectedFilter == "7 dias"){
        labels = generateLabels(7)
    } else if(selectedFilter == "30 dias"){
        labels = generateLabels(30)
    }

    const query = ref(db, "projects/" + getCookie("projectID"));
    return onValue(query, (snapshot) => {
        const data = snapshot.val();
        if (snapshot.exists() && data && data.interactions) {
            let interactionsByDate = []
            let interacionsByExperience = []
            let uniqueUsersByOS = {};
            let interactions = Object.values(data.interactions)
            let usersInteracted = {};
            let interactionsByOS = {};

            interactions.forEach((value) => {
                let date = new Date(value.createdAt)
                const device = value.OS || "Desconocido";
                const userId = value.userID;
                let parsedDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()

                labels.forEach((label) => {
                    if (parsedDate == label) {
                        interactionsByDate[label] += 1;
                        interactionsByOS[device] += 1;
                        interacionsByExperience[value.experience] += 1;
                        if (!usersInteracted[userId]) {
                            if (uniqueUsersByOS[device]) {
                                uniqueUsersByOS[device] += 1;
                            } else {
                                uniqueUsersByOS[device] = 1;
                            }
                        }
                    } else {
                        if (!interactionsByDate[label]) {
                            interactionsByDate[label] = 0;
                        }
                        if (!interactionsByOS[device]) {
                            interactionsByOS[device] = 0;
                        }
                        if (!interacionsByExperience[value.experience]) {
                            interacionsByExperience[value.experience] = 0;
                        }
                        if (!uniqueUsersByOS[device]) {
                            uniqueUsersByOS[device] = 0;
                        }
                    } 
                })
            })

            let users = Object.values(data.users)
            let usersByDate = []
            let usersByCountry = []

            users.forEach((value) => {
                let date = new Date(value.createdAt)
                let parsedDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
                labels.forEach((label) => {
                    if (label == parsedDate) {
                        if(usersByDate[label]){
                            usersByDate[label] += 1
                            usersByCountry[value.country] += 1
                        } else{
                            usersByCountry[value.country] = 1
                            usersByDate[label] = 1
                        }
                    } else {
                        if (!usersByDate[label]) {
                            usersByDate[label] = 0;
                        }
                        if (!usersByCountry[value.country]) {
                            usersByCountry[value.country] = 0;
                        }
                    }
                })
            })

            let registerRequests = Object.values(data.registerRequests)
            let dropRequests = []

            registerRequests.forEach((value) => {
                let date = new Date(value.createdAt)
                let parsedDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
                labels.forEach((label) => {
                    console.log(parsedDate + " " + label)
                    if (label == parsedDate) {
                        if(dropRequests[label]){
                            dropRequests[label] += 1
                        } else{
                            dropRequests[label] = 1
                        }
                    } else {
                        if (!dropRequests[label]) {
                            dropRequests[label] = 0;
                        }
                    }
                })
            })

            setDashboardData({
                interactionsByDate: {
                    labels: labels, 
                    quantity: Object.values(interactionsByDate)
                }, interacionsByExperience: {
                    labels: Object.keys(interacionsByExperience),
                    quantity: Object.values(interacionsByExperience)
                }, usersByDate: {
                    labels: labels,
                    quantity: Object.values(usersByDate)
                }, usersByCountry: {
                    labels: Object.keys(usersByCountry),
                    quantity: Object.values(usersByCountry)
                },interactionsByOS: {
                    labels: Object.keys(interactionsByOS),
                    quantity: Object.values(interactionsByOS)
                }, uniqueUsersByOS: {
                    labels: Object.keys(uniqueUsersByOS),
                    quantity: Object.values(uniqueUsersByOS)
                }, dropRequests: {
                    labels: labels,
                    quantity: Object.values(dropRequests)
                }
            });
        } else {
            setDashboardData({});
        }
    });
}
