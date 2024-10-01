import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { vrHeadset } from '../../vrHeadset'; 

@Injectable({
  providedIn: 'root'
})
export class VRHeadsetService {

  expressURL = 'https://3f05-95-94-97-38.ngrok-free.app';

  constructor(private http: HttpClient) {}

  setExpressIp(ip: string): void {
      this.expressURL = `${ip}`;
  }

  getVRHeadsets(): Observable<vrHeadset[]>   {
    return this.getVRHeadsetsfromServer();
    /*
    this.getVRHeadsetsfromServer(); // Este método é assyncrono, entao ele antes de conseguir returnar a lista a tempo.
    return this.headsetsList;
    */ 
  }

  getVRHeadsetsfromServer(): Observable<vrHeadset[]> {
    return this.http.get<vrHeadset[]>(`${this.expressURL}/`, { 
      headers: { // Header to ignore Ngrok warning, and make Angular able to make HTTP request to Express.
        "ngrok-skip-browser-warning": "69420",
      },
    }
    )
    /*
    .subscribe(
      (data: vrHeadset[]) => {
        this.headsetsList = data;  // Assign the server response to the local list
        console.log('VR Headsets in Service:', this.headsetsList);
      },
      (error) => {
        console.error('Error fetching VR headsets from server:', error);
      }
    ); 
    */
  }

  addVRHeadset(vrInfo: vrHeadset): Observable<vrHeadset> {
    return this.http.post<vrHeadset>(`${this.expressURL}/vrheadsets`, vrInfo);
  }
  
  updateVRHeadset(headset: any): Observable<any> {
    return this.http.put<any>(`${this.expressURL}/vrheadsets/${headset._id}`, headset);
  }

  deleteVRHeadset(headsetId: string): Observable<any> {
    console.log("headsetId= " + headsetId);
    return this.http.delete<any>(`${this.expressURL}/vrheadsets/${headsetId}`);
  }

}
