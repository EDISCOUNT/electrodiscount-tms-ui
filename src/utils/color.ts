import { computed } from 'vue';
import { useDisplay, useTheme } from 'vuetify';

export function getRandomColor(): string {
    // Generate a random hexadecimal color
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export function getStatusColor(status: string | undefined): string {
    // If a status is provided, check if it exists in the mapping
    status = (status ?? '').toUpperCase();
    if (status) {
        const statusColorMap: Record<string, string> = {
            "OPEN":"orange",
            "PENDING": "yellow", // Orange
            "CANCELLED": "red", // Red
            "COMPLETED": "green", // Green
            "CREATED": "teal", // Blue	
            "DELIVERED": "teal", // Green
            "PROCESSING": "blue", // Orange
            "PICKED_UP": "cyan", // Green
            "INTRANSIT": "green", // Blue
            "HANDLED":'green',
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



// 
// 



export function useColorScheme() {
    const { xs } = useDisplay();
    const theme = useTheme();
    console.log("THEME:", theme);
    const inlineBg = computed(() => theme.current.value.dark ? 'black' : 'grey-lighten-4');
    const secondaryBg = computed(() => xs.value ? '' : 'secondary-bg');
    return { secondaryBg, inlineBg }
}