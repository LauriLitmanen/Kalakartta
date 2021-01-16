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