import { useTheme } from 'next-themes';

export function useIconStyle() {
    const { theme } = useTheme();

    // Define icon color based on theme
    const colors: Record<string, string> = {
        'purple-dark': '#DD62ED', // Primary color for purple-dark theme
        'dark': '#97F3FD',        // Primary color for dark theme
        'light': '#000000',       // Default color for light theme
    };

    return {
        fontSize: '24px',         // Adjust the size as needed
        color: colors[theme as keyof typeof colors] || '#000000',  // Set color based on theme, default to black
    };
}
