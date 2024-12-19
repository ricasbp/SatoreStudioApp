export interface vrHeadset{
    _id?: string; // MongoDB document ID, optional as it may not be present on new objects
    ipAddress: string;
    name: string;
    status: 
        'offline' | // Grey
        'online' | // Green (Text)
        'uploading...' | // Orange
        'ready (Assets Uploaded)' | // Green
        'all devices ready' | // Green
        'experience running' | // Blue
        'error' ; // Red
        
    isInEditMode: boolean;
}