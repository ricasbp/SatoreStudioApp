export interface vrInfo{
    ipAddress: string;
    port: string;
    name: string;
    status: 'offline' | 'online' | 'ready' | 'error' | 'running experience';
}