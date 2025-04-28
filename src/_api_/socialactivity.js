const addSocialActivity = async (activityName, description, date, timing, organisers, category, image, ) => {
    try {
        const formData = new FormData();

       
        formData.append("ActivityName", activityName);
        formData.append("Description", description);
        formData.append("Date", new Date(date).toISOString().split("T")[0]); 
        formData.append("Timing", timing);
        formData.append("Category", category);

       


        
        if (image && image instanceof File) {
            formData.append("Image", image);
        } else {
            console.warn("No valid image file provided.");
        }

        organisers.forEach((organiser, index) => {
            formData.append(`Organisers[${index}]`, organiser);
        });

        const response = await fetch( `${process.env.NEXT_PUBLIC_API_URL}api/SocialActivity`, {
            method: "POST",
            body: formData,
            headers: {
            
            }
        });

        if (!response.ok) {
            const errorResponse = await response.text();
            throw new Error(`HTTP Error! Status: ${response.status}, Message: ${errorResponse}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error adding social activity:", error.message);
        throw error;
    }
};
const getSocialActivities = async (pageNumber = 7, category = "ALL", pageSize = 10) => {
    try {
     
        const categoryQuery = category === "All" ? "" : `&category=${category}`;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}api/SocialActivity/activities/page/${pageNumber}?pageSize=${pageSize}${categoryQuery}`,
             
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                   
                },
            }
        );

        if (!response.ok) {
            const errorResponse = await response.text();
            throw new Error(`HTTP Error! Status: ${response.status}, Message: ${errorResponse}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching social activities:", error.message);
        throw error;
    }
};

export { addSocialActivity,  getSocialActivities };




