import { ref, onValue, push, set, getDatabase, } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getStorage, uploadBytes } from "firebase/storage";
import toast from 'react-hot-toast';

const firebaseConfig = {
    apiKey: "AIzaSyCWcnQoIS9JE49Iw94ZYmj6HA0tAmjdNys",
    authDomain: "nw-app-dashboard.firebaseapp.com",
    databaseURL: "https://nw-app-dashboard-default-rtdb.firebaseio.com",
    projectId: "nw-app-dashboard",
    storageBucket: "nw-app-dashboard.appspot.com",
    messagingSenderId: "989935726924",
    appId: "1:989935726924:web:ab6ad64a823e993913dfe9"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);


export function getProjects(setProjects) {

        const queryProjects = ref(db, "projects");
        onValue(queryProjects, (snapshot) => {
            const projectsData = snapshot.val();
            if (projectsData) {
                const projectIds = Object.keys(projectsData);
                const projects = projectIds.map((projectID) => {
                    const project = projectsData[projectID];
                    const projectData = {
                        id: projectID,
                        name: [],//loaded below
                        version:[],
                        client: [],
                        createdAt: {
                            day: "",
                            month: "",
                            year: "", 
                        },
                        interactions: [], 
                        users: [],
                        experiences: [],
                        projectType:[],
                        uniqueExperiences: []
                    };   

                    if (project.createdAt) {
                        const createdAtTimestamp = parseInt(project.createdAt);
                        const createdAtDate = new Date(createdAtTimestamp);
                        const day = createdAtDate.getDate();
                        const month = createdAtDate.getMonth() + 1;
                        const year = createdAtDate.getFullYear();
                        
                        console.log(`${projectID} createdAt: ${day}/${month}/${year}`);
    
                        projectData.createdAt = {
                            day,
                            month,
                            year,
                        };
                    }
                    //project info
                    const queryInfo = ref(db, `projects/${projectID}/info`);
                    onValue(queryInfo, (snapshot) => {
                        const projectsInfo = snapshot.val();
                        if (projectsInfo) {
                            projectData.name = projectsInfo.name;
                            projectData.projectState = projectsInfo.projectState;
                            projectData.image = projectsInfo.image;
                            projectData.description = projectsInfo.description;
                            projectData.client = projectsInfo.client;
                            projectData.version = projectsInfo.version;
                            projectData.createdAt = projectsInfo.createdAt;
                            projectData.createdAt = projectsInfo.projectType;
                            projectData.projectType = projectsInfo.projectType;
                        }
                    })
                     // interactions data
                    const queryInteractions = ref(db, `projects/${projectID}/interactions`);

                    onValue(queryInteractions, (snapshot) => {
                        const interactionData = snapshot.val();
                        const interactions = Object.values(interactionData || {});
                        const uniqueExperiences = new Set();
                        const experienceCounts = {};

                        interactions.forEach((interaction) => {
                            const experience = interaction.experience;
                            if (experience && !uniqueExperiences.has(experience)) {
                                uniqueExperiences.add(experience); 
                                projectData.experiences.push(experience);
                            }
                            experienceCounts[experience] = (experienceCounts[experience] || 0) + 1; 
                        });

                        projectData.interactions = interactions;
                    });
                     
                      // users data

                    const queryUsers = ref(db, `projects/${projectID}/users`);
                    onValue(queryUsers, (snapshot) => {
                        const userData = snapshot.val();
                        const users = Object.values(userData || {});
                        if (userData) {
                            Object.keys(userData).forEach((user) => {
                                users.push(userData[user]);   
                            });
                        }
                        projectData.users = users;
                    }); 

                    return projectData;
                });

                setProjects(projects);
              
            } else {
                setProjects([]);
            }

    }, [setProjects]);

}


export function addProject(projectData, projectName) {
    const projectsRef = ref(db, "projects");
    const newProjectRef = push(projectsRef);

    set(newProjectRef, {
        info: {
            name: projectData.name || '',
            projectState: projectData.projectState || '',
            image: projectData.image || '',
            description: projectData.description || '',
            client: projectData.client || '',
            createdAt: projectData.createdAt || '',
        },
        interactions: projectData.interactions || [],
        users: projectData.users || [],
        experiences: projectData.experiences || [],
        uniqueExperiences: projectData.uniqueExperiences || [],
    }).then(() => {
        toast.success(`Proyecto "${projectName}" creado exitosamente`); // Display toast notification with project name
        console.log('New project added successfully!');
    }).catch((error) => {
        console.error("Error adding project: ", error);
    });
}

export function editProject(project) {
    const projectRef = ref(db, `projects/${project.id}`);
    set(projectRef, {
        ...project,
    });
}

export function deleteProject(projectId) {
    const projectRef = ref(db, `projects/${projectId}`);
    set(projectRef, null);
}

