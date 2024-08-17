import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { vrInfo } from '../../vrInfo'; 

@Injectable({
  providedIn: 'root'
})
export class VRHeadsetService {

  // Services are Singletons
  private apiUrl = 'http://localhost:3000'; // Your Express server URL

  constructor(private http: HttpClient) { }

  getVRHeadsets(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/`);
  }

  addVRHeadset(vrInfo: vrInfo): Observable<vrInfo> {
    return this.http.post<vrInfo>(`${this.apiUrl}/vrheadsets`, vrInfo);
  }
  
  updateVRHeadset(headset: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/vrheadsets/${headset._id}`, headset);
  }

  deleteVRHeadset(headsetId: string): Observable<any> {
    console.log("headsetId= " + headsetId);
    return this.http.delete<any>(`${this.apiUrl}/vrheadsets/${headsetId}`);
  }
  

}
