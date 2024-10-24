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
  //   BehaviorSubject serve para escrever.
  //   Observable para ler.

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
    this.setExpressUrl(localStorageService);
    this.setHeadsetsListSubject()
  }
  
  private setHeadsetsListSubject(): void {  
    this.http.get<vrHeadset[]>(`${this.expressUrl}/`, { 
      headers: { 
        // Header to ignore Ngrok warning
        "ngrok-skip-browser-warning": "69420",
      }
    }).subscribe({
      next: (headsets: vrHeadset[]) => {
        // Update the BehaviorSubject with the received data
        this.headsetsListSubject.next(headsets);
      },
      error: (err) => {
        console.error('Failed to fetch VR headsets', err);
      }
    });
  }

  private setExpressUrl(localStorageService: LocalStorageService){
    this.expressUrl = this.localStorageService.getItem('expressIP') ?? "NoIp";  // Use the nullish coalescing operator (??) to provide a fallback in case of null
    if (this.expressUrl === "NoIp") {
      console.error('No IP Received from LocalStorage');
    }
    console.log("VrHeadset-Services connected to backend at: " + this.expressUrl);
  }

  addVRHeadset(vrInfo: vrHeadset): void {
    this.http.post<vrHeadset[]>(`${this.expressUrl}/vrheadsets`, vrInfo).subscribe({
      next: () => {
        // Re-fetch the updated list of headsets from the server
        this.setHeadsetsListSubject();  
      },
      error: (err) => {
        console.error('Failed to add VR headset', err);
      }
    });
  }
  
  updateVRHeadset(headset: vrHeadset): void {
    console.log("VrHeadsetService is updating VRheadset:", headset)

    console.log("Url: ", `${this.expressUrl}/vrheadsets/${headset._id}`)
    this.http.put<vrHeadset>(`${this.expressUrl}/vrheadsets/${headset._id}`, headset).subscribe({
      next: () => {
        // Re-fetch the updated list of headsets from the server
        this.setHeadsetsListSubject();  
      },
      error: (err) => {
        console.error('Failed to update VR headset', err);
      }
    });    
  }

  deleteVRHeadset(headsetId: string): void {
    console.log("headsetId= " + headsetId);
    this.http.delete<any>(`${this.expressUrl}/vrheadsets/${headsetId}`).subscribe({
      next: () => {
        // Re-fetch the updated list of headsets from the server
        this.setHeadsetsListSubject();  
      },
      error: (err) => {
        console.error('Failed to delete VR headset', err);
      }
    });
  }
}