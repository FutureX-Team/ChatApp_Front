import axios from "axios";


const api = axios.create({
baseURL: "https://your-domain.com/api",
headers: { "Content-Type": "application/json" },
});


export function setAuthToken(token) {
if (token) {
localStorage.setItem("token", token);
api.defaults.headers.common.Authorization = `Bearer ${token}`;
} else {
localStorage.removeItem("token");
delete api.defaults.headers.common.Authorization;
}
}


export default api;