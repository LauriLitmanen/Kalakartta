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

export async function updateReportEntry(id, updatedEntry) {
    const response = await fetch(`${API_URL}/api/reports/updateReport/${id}`, {
       method: 'PUT',
       headers: {
            'content-type': 'application/json',
       },
       body: JSON.stringify(updatedEntry)  
    });
    return response.json();
}

export async function deleteReportEntry(data) {
    const response = await fetch(`${API_URL}/api/reports`, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}

export async function fetchEntryById(id) {
    const response = await fetch(`${API_URL}/api/reports/report/${id}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        },
    });
    return response.json();
}
