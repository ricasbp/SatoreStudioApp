import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { DirectorModeModule } from './components/director-mode/director-mode.module';
import { VrHeadsetsDirectorComponent } from './components/vr-headsets-director/vr-headsets-director.component';

import { OperatorModeModule } from './components/operator-mode/operator-mode.module';
import { VrHeadsetsOperatorComponent } from './components/vr-headsets-operator/vr-headsets-operator.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    DirectorModeModule,
    OperatorModeModule,
    
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    AsyncPipe,
    JsonPipe,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
