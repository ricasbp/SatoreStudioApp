import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { vrHeadset } from '../../vrHeadset'; 

@Injectable({
  providedIn: 'root'
})
export class VRHeadsetService {

  private expressURL = 'http://localhost:3000';

  headsetsList: any;

  constructor(private http: HttpClient) { 
  }  

  ngOnInit(){
    this.headsetsList =  this.getVRHeadsetsFromServer();
  }

  getVRHeadsets(): Observable<any> {
    return this.headsetsList;
  }

  getVRHeadsetsFromServer(){ // TOREVIEW: Maybe rename it to Retrieve because this is not exactly a get method.
    this.headsetsList == this.http.get<any>(`${this.expressURL}/`);
  }

  addVRHeadset(headset: vrHeadset): Observable<vrHeadset> {
    return this.http.post<vrHeadset>(`${this.expressURL}/vrheadsets`, headset);;
  }
  
  updateVRHeadset(headset: vrHeadset): Observable<vrHeadset> {
    return this.http.put<vrHeadset>(`${this.expressURL}/vrheadsets/${headset._id}`, headset);
  }

  deleteVRHeadset(headsetId: string): Observable<vrHeadset> {
    console.log("headsetId= " + headsetId);
    return this.http.delete<vrHeadset>(`${this.expressURL}/vrheadsets/${headsetId}`);
  }
  

}
