export interface vrHeadset{
    _id?: string; // MongoDB document ID, optional as it may not be present on new objects
    ipAddress: string;
    port: string;
    name: string;
    status: 'offline' | 'online' | 'ready' | 'error' | 'running experience';
    directingMode: boolean; 
    isInEditMode: boolean;
}