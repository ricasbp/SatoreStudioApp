import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { vrHeadset } from '../../vrHeadset'; 

@Injectable({
  providedIn: 'root'
})
export class VRHeadsetService {

  private expressURL = 'https://33bf-95-94-97-38.ngrok-free.app';
  
  headsetsList: vrHeadset[] = [];

  constructor(private http: HttpClient) { }

  // Review: This should be done in a OnInit method
  getVRHeadsets(): vrHeadset[]  {
    this.getVRHeadsetsfromServer();
    return this.headsetsList;
  }

  getVRHeadsetsfromServer(): void {
    this.http.get<vrHeadset[]>(`${this.expressURL}/`, { // Header to ignore Ngrok warning, and make Angular able to make request to Express.
      headers: {
        "ngrok-skip-browser-warning": "69420",
      },
    }
    ).subscribe(
      (data: vrHeadset[]) => {
        this.headsetsList = data;  // Assign the server response to the local list
        console.log('VR Headsets in Service:', this.headsetsList);
      },
      (error) => {
        console.error('Error fetching VR headsets from server:', error);
      }
    );
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
