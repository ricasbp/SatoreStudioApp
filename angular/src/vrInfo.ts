export interface vrInfo{
    _id?: string; // MongoDB document ID, optional as it may not be present on new objects
    ipAddress: string;
    port: string;
    name: string;
    status: 'offline' | 'online' | 'ready' | 'error' | 'running experience';
}