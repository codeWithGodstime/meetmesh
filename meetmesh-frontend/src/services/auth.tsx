
export const API_ENDPOINT = 'http://localhost:8000'


export const loginUser = async (email: string, password: string) => {
    const res = await fetch(`${API_ENDPOINT}/token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
        throw data;
    }

    // Save tokens and user info to localStorage
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
}

export const signUp = async (username: string, email: string, password: string) => {
    const res = await fetch(`${API_ENDPOINT}/users/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
        throw data;
    }

    // Save tokens and user info to localStorage
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
};

export const getCurrentUser = async () => {

}


export const postAPIMethod = async (requestData: any) => {
    const accessToken = localStorage.getItem("accessToken");

    const res = await fetch(`${API_ENDPOINT}/users/complete_onboarding/`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: requestData
    });

    const data = await res.json();

    if (!res.ok) {
        throw data;
    }

    return data;
}
