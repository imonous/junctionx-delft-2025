// Function to parse CSV data
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
            row[header.trim()] = values[index].trim();
        });
        data.push(row);
    }
    
    return data;
}

async function loadSurgeByHourData() {
    try {
        const response = await fetch('/uber_data/data/uber_hackathon_v2_mock_data.xlsx - surge_by_hour.csv');
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error('Error loading CSV data:', error);
        return [];
    }
}

const surgeByHourPromise = loadSurgeByHourData();

// surge
async function surge(c, h) {
    const surgeByHour = await surgeByHourPromise;
    
    // Find the row with matching city_id and hour
    const matchingRow = surgeByHour.find(row => 
        row.city_id === c.toString() && row.hour === h.toString()
    );
    
    return matchingRow ? parseFloat(matchingRow.surge_multiplier) : -1.0;
}

// predictor
// gamma is how many hour's the driver's been driving already
export async function hypothesis(c, h, gamma) {
    const s = await surge(c, h)
    if (gamma <= 3) {
        return "no-op";
    }
    if (s > 1.15) {
        return "encourage";
    }
    if (s < 0.99) {
        return "discourage";
    }
    return "no-op";
}