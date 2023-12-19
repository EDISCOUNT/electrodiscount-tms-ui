export function getRandomColor(): string {
    // Generate a random hexadecimal color
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}

export function getStatusColor(status: string | undefined): string {
    // If a status is provided, check if it exists in the mapping
    if (status) {
        const statusColorMap: Record<string, string> = {
            "CANCELLED": "#FF0000", // Red
            "COMPLETED": "#00FF00", // Green
            "INTRANSIT": "#0000FF", // Blue
            // Add more status-color pairs as needed
        };

        if (statusColorMap.hasOwnProperty(status)) {
            return statusColorMap[status];
        }
    }

    // If no status provided or it's not in the mapping, return a random color
    return getRandomColor();
}

// Example usage:
const status1 = "Completed";
const color1 = getStatusColor(status1);
console.log(`Status: ${status1}, Color: ${color1}`);

const color2 = getStatusColor(undefined); // No status provided
console.log(`Status: No status provided, Color: ${color2}`);
