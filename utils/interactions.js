import { useState, useEffect } from "react";
import { db } from "./firebase";
import { onValue, ref } from "firebase/database";
import { getCookie } from "cookies-next";

export function getInteractions() {
  const projectID = getCookie("projectID");

  const [interactions, setInteractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const query = ref(db, `projects/${projectID}/interactions`);
    return onValue(query, (snapshot) => {
      const data = snapshot.val();
      setIsLoading(false);
        if (snapshot.exists()) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const newInteractions = keys.map((key, index) => {
                const userInteractions = values[index].interactions || {};
                const userId = values[index].userID;
                const experience = values[index].experience;
                const createdAt = new Date(values[index].createdAt);
                const useTime = parseInt(values[index].useTime, 10) || 0;

                const interactionData = {
                    id: key,
                    numInteractions: values[index].numInteractions,
                    OS: values[index].OS,
                    experience: experience,
                    useTime: useTime,
                    createdAt: values[index].createdAt,
                    interactions: userInteractions,
                    userId: userId,
                    experienceCounts: values[index].experienceCounts,
                    totalTimeSpent: useTime,
                };

            return interactionData;
        });

        setInteractions(newInteractions);
         }
            });
            
        }, [projectID, setInteractions]);

  return { interactions, isLoading };
}
