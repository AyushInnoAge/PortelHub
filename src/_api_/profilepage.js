const getToken = () => {
  return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};

const updateUserProfile = async (empID, email, phone, address, image) => {
  try {
    const token = getToken();

    
    const patchData = [
      { op: "replace", path: "/Email", value: email },
      { op: "replace", path: "/PhoneNo", value: phone },
      { op: "replace", path: "/Address", value: address }
    ];

  
    const formData = new FormData();
    formData.append("patchDoc", JSON.stringify(patchData));

    if (image) {
      formData.append("imageFile", image);
    }


    const url = `${process.env.NEXT_PUBLIC_API_URL}User/UpdateUserProfile/${empID}`;

    
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });
    const res = await response.json();
    return res;
  } catch (error) {
    throw new Error(error.message);
  }
};
const lockUserProfile = async (empID,image) => {
  try {
    const token = getToken();

   
    const patchData = [
      { op: "replace", path: "/isActive", value: false },
    ];

 
    const formData = new FormData();
    formData.append("patchDoc", JSON.stringify(patchData));

  
    if (image) {
      formData.append("imageFile", image);
    }
  

  
    const url = `${process.env.NEXT_PUBLIC_API_URL}User/UpdateUserProfile/${empID}`;

   
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData,
    });
    const res = await response.json();
    return res;
  } catch (error) {
    throw new Error(error.message);
  }
};

export {
  updateUserProfile,lockUserProfile
};
