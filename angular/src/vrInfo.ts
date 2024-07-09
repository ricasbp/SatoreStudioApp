export interface vrInfo{
    id: any;
    ipAddress: string;
    port: string;
    name: string;
    status: 'offline' | 'online' | 'ready' | 'error' | 'running experience';
}