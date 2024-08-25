import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { vrInfo } from '../../vrInfo'; 

@Injectable({
  providedIn: 'root'
})
export class VRHeadsetService {

  private expressURL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getVRHeadsets(): Observable<any> {
    return this.http.get<any>(`${this.expressURL}/`);
  }

  addVRHeadset(vrInfo: vrInfo): Observable<vrInfo> {
    return this.http.post<vrInfo>(`${this.expressURL}/vrheadsets`, vrInfo);
  }
  
  updateVRHeadset(headset: any): Observable<any> {
    return this.http.put<any>(`${this.expressURL}/vrheadsets/${headset._id}`, headset);
  }

  deleteVRHeadset(headsetId: string): Observable<any> {
    console.log("headsetId= " + headsetId);
    return this.http.delete<any>(`${this.expressURL}/vrheadsets/${headsetId}`);
  }
  

}
