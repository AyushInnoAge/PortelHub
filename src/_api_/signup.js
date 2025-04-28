
import axios from "axios";

const getToken = () => {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
};

const FetchAllRole = async () => {
    try {
        const token = getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}fetch_all_roles`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        return response;
    } catch (error) {
        console.error(error);
    }
};

const FetchAllTeam = async () => {
    try {
        const token = getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}teams/fetch_all_teams`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        return response;
    } catch (error) {
        console.error(error);
    }
};

const FetchAllDepartment = async () => {
    try {
        const token = getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}fetch_all_departments`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        return response;
    } catch (error) {
        console.error(error);
    }
};

const SingnUpSubmite = async (formData) => {
    try {
        const token = getToken();
        const response = axios.post(`${process.env.NEXT_PUBLIC_API_URL}signup`, formData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        return response;
    } catch (error) {
        console.error(error);
    }
};

export {
    FetchAllRole,
    FetchAllTeam,
    FetchAllDepartment,
    SingnUpSubmite

}