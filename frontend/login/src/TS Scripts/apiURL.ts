export function getBackendURL(): string {
    const backendIP = import.meta.env.VITE_BACKEND_IP;
    const backendPort = import.meta.env.VITE_BACKEND_PORT;

    // Check if the protocol is http
    if (window.location.hostname === "localhost") {
        // Use the backend IP from .env if protocol is http
        return `${window.location.protocol}//${backendIP}:${backendPort}`;
    }

    // Otherwise, use the current hostname
    return `${window.location.protocol}//${window.location.hostname}:${backendPort}`;
}
