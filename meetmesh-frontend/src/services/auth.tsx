
const API_ENDPOINT = 'http://localhost:8000'


export const loginUser = () => {

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
        // throw error object instead of a generic error
        throw data; // or throw { status: res.status, ...data }
    }

    return data;
};

export const getUser = () => {

}

