import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ContainerComponent } from './components/container/container/container.component';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { VrCustomComponent } from './components/vr-custom/vr-custom.component';
import { VRInfoComponent } from './components/vr-info/vr-info.component';
import { ToggleExperienceComponent } from './components/toggle-experience/toggle-experience.component';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    VrCustomComponent,
    VRInfoComponent,
    ToggleExperienceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AsyncPipe,
    JsonPipe,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
