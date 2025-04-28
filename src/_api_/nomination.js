import axios from "axios";

const getToken = () => {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
  };

const fetchAllEmployeesByTeamLeaderId = async (Admin=false)=>{
    try{
        const token = getToken();
        var url = Admin?`${process.env.NEXT_PUBLIC_API_URL}user/fetch_my_employees?UserRole=Admin`:`${process.env.NEXT_PUBLIC_API_URL}user/fetch_my_employees`
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    }catch (error)
    {   
        throw new error.message();
    }

}

const submiteNomination = async(data)=>{
    try {
        const token = getToken();
     const response= await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/shoutout`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          return response;
    } catch (error) {
        throw new error.message();
    }
}


export {fetchAllEmployeesByTeamLeaderId, submiteNomination};
