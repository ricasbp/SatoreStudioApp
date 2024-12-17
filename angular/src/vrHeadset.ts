export interface vrHeadset{
    _id?: string; // MongoDB document ID, optional as it may not be present on new objects
    ipAddress: string;
    name: string;
    status: 'offline' | 'online' | 'ready (synched)' | 'error' | 'experience running' ;
    synchedMode: boolean;
    isInEditMode: boolean;
}