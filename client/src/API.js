const API_URL = 'http://localhost:1337';

export async function listReportEntries() {
    const response = await fetch(`${API_URL}/api/reports`);
    return response.json();
}

export async function createReportEntry(entry) {
    const response = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(entry),
    });
    return response.json();
}
//EI TOIMI VIELÄ
export async function deleteReportEntry(data) {
    console.log('API deleting function, with parameter: ', data); 
    const response = await fetch(`${API_URL}/api/reports`, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}
