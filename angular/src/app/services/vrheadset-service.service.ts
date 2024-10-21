import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { vrHeadset } from '../../vrHeadset'; 
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class VRHeadsetService {

  expressUrl = '';

  
  private headsetsListSubject = new BehaviorSubject<vrHeadset[]>([]) // guardar estado de forma assincrona
  headsetsList$ : Observable<vrHeadset[]> = this.headsetsListSubject.asObservable(); 
  
  // Converter o nosso subject para observable.
  // BehaviorSubject serve para escrever.
  // Observable para ler.

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
    this.setExpressUrl(localStorageService);
  }

  private setExpressUrl(localStorageService: LocalStorageService){
    this.expressUrl = this.localStorageService.getItem('expressIP') ?? "NoIp";  // Use the nullish coalescing operator (??) to provide a fallback in case of null
    if (this.expressUrl === "NoIp") {
      console.error('No IP Received from LocalStorage');
    }

    console.log("VrHeadset-Services connected to backend at: " + this.expressUrl);

  }

  getVRHeadsets(): Observable<vrHeadset[]>   {
    return this.getVRHeadsetsfromServer();
    /*
    this.getVRHeadsetsfromServer(); // Este método é assyncrono, entao ele antes de conseguir returnar a lista a tempo.
    return this.headsetsList;
    */ 
  }

  getVRHeadsetsfromServer(): Observable<vrHeadset[]> {
    return this.http.get<vrHeadset[]>(`${this.expressUrl}/`, { 
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

  addVRHeadset(vrInfo: vrHeadset): Observable<vrHeadset[]> { // TO_FIX: Devolve Void
    return this.http.post<vrHeadset[]>(`${this.expressUrl}/vrheadsets`, vrInfo);
  }
  
  updateVRHeadset(headset: vrHeadset): Observable<vrHeadset> {
    console.log("VrHeadsetService is updating VRheadset:", headset)
    // console.log("VrHeadsetService: VRheadset type is:", typeof headset);

    console.log("Url: ", `${this.expressUrl}/vrheadsets/${headset._id}`)
    return this.http.put<vrHeadset>(`${this.expressUrl}/vrheadsets/${headset._id}`, headset);
  }

  deleteVRHeadset(headsetId: string): Observable<any> {
    console.log("headsetId= " + headsetId);
    return this.http.delete<any>(`${this.expressUrl}/vrheadsets/${headsetId}`);
  }

}
