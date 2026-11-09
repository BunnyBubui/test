const getStoredUser = () => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
        try {
            return JSON.parse(userDataString);
        } catch (e) {
            console.error("Failed to parse userData:", e);
            localStorage.removeItem("userData");
            return null;
        }
    }
    return null;
};

const clearUserData = () => {
    localStorage.removeItem("userData");
};

export { getStoredUser, clearUserData }