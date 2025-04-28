type Account = {
    name: string
}

export async function getSelf() {
    const token = import.meta.env.VITE_CANVAS_TOKEN; // Load your token

    const url = encodeURIComponent('https://nyit.instructure.com/api/v1/users/self/profile?access_token=' + token + '&per_page=100');

    const res = await fetch(`https://api.allorigins.win/raw?url=${url}`, {
        method: 'GET',
    });

    if (!res.ok) {
        throw new Error("Failed to fetch courses");
    }

    const accountData: Account = await res.json();

    return accountData.name;
}



