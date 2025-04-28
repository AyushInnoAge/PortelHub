const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const API_ENDPOINTS = {
    LOGIN_API:`${API_BASE_URL}login`,
    RESET_PASSWORD_PAGE_API:`${API_BASE_URL}request-password-reset`,
    RESET_PASSWORD_API:`${API_BASE_URL}reset-password`,
    FETCH_NOMINATED_EMPLOYEES: `${API_BASE_URL}users/fetch_nominated_employees`,
    FETCH_ALL_TEAMS: `${API_BASE_URL}teams/fetch_all_teams`,
    FETCH_ALL_TEAM_LEADERS: `${API_BASE_URL}user/fetch_all_TeamLeaders`,
    FETCH_MY_EMPLOYEES: `${API_BASE_URL}user/fetch_my_employees`,
    SHOUTOUT_API: `${API_BASE_URL}api/shoutout`,
};

export default API_ENDPOINTS;
