import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ContainerComponent } from './components/container/container/container.component';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { vrHeadsetsComponent } from './components/vrHeadsets/vrHeadsets.component';
import { ToggleExperienceComponent } from './components/toggle-experience/toggle-experience.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http';
import { DirectorModeComponent } from './components/director-mode/director-mode.component';
import { DirectorModeModule } from './components/director-mode/director-mode.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent
  ],
  imports: [
    DirectorModeModule,
    
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
