
const API_ENDPOINT='http://localhost:8000'


export const loginUser = () => {

}

export const signUp = async (username: string, email: string, password: string) => {
    const res = await fetch(`${API_ENDPOINT}/users/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username, email, password})
    })

    if(!res.ok) {
        throw new Error(`${res}`)
    } 
    return await res.json()
}

export const getUser = () => {
    
}

