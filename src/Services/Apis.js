import axios from "axios";

const BASE_URL = "http://localhost:5000";
// const BASE_URL = "https://intstaone-backend-1.vercel.app/";


const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common["Authorization"];
    }
};

// GET request
export const getAPI = async (endpoint, data, token) => {
    setAuthToken(token); // Set the token in the headers
    try {
        const response = await axios.get(`${BASE_URL}/${endpoint}`, token);
        return response.data;
    } catch (error) {
        if (error?.response?.data?.statuscode == 401) {
            localStorage.removeItem("loginData");
            localStorage.removeItem("notif-token");
            window.location.pathname = "/";
        }
        if (error.response) {
            const errorMessage = error.response.data.message;
            throw new Error(errorMessage);
        } else {
            throw new Error("Failed to fetch data");
        }
    }
};

// POST request
export const postAPI = async (endpoint, data, token) => {
    setAuthToken(token); // Set the token in the headers
    try {
        const response = await axios.post(`${BASE_URL}/${endpoint}`, data, token);
        return response.data;
    } catch (error) {
        if (error?.response?.data?.statuscode == 401) {
            localStorage.removeItem("loginData");
            localStorage.removeItem("notif-token");
            window.location.pathname = "/";
        }
        if (error.response) {
            const errorMessage = error.response.data.message;
            throw new Error(errorMessage);
        } else {
            throw new Error("Failed to fetch data");
        }
    }
};


// PUT request 
export const putAPI = async (endpoint, data, token) => {
    setAuthToken(token); // Set the token in the headers
    try {
        const response = await axios.put(`${BASE_URL}/${endpoint}`, data, token);
        return response.data;
    } catch (error) {
        if (error?.response?.data?.statuscode == 401) {
            localStorage.removeItem("loginData");
            localStorage.removeItem("notif-token");
            window.location.pathname = "/";
        }
        if (error.response) {
            const errorMessage = error.response.data.message;
            throw new Error(errorMessage);
        } else {
            throw new Error("Failed to fetch data");
        }
    }
};

// DELETE request
export const deleteAPI = async (endpoint, data, token) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` },
            data: data, // Send data in the request body
        });
        return response.data;
    } catch (error) {
        if (error?.response?.data?.statuscode == 401) {
            localStorage.removeItem("loginData");
            localStorage.removeItem("notif-token");
            window.location.pathname = "/";
        }
        if (error.response) {
            const errorMessage = error.response.data.message;
            throw new Error(errorMessage);
        } else {
            throw new Error("Failed to delete data");
        }
    }
};

// UPDATE request (PUT or PATCH depending on your API)
export const updateAPI = async (endpoint, data, token) => {
    try {
        const response = await axios.put(`${BASE_URL}/${endpoint}`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        if (error?.response?.data?.statuscode == 401) {
            localStorage.removeItem("loginData");
            localStorage.removeItem("notif-token");
            window.location.pathname = "/";
        }
        if (error.response) {
            const errorMessage = error.response.data.message;
            throw new Error(errorMessage);
        } else {
            throw new Error("Failed to update data");
        }
    }
};
