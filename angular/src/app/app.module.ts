import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ContainerComponent } from './components/container/container/container.component';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { VrCustomComponent } from './components/vr-custom/vr-custom.component';
import { VRInfoComponent } from './components/vr-info/vr-info.component';
import { ToggleExperienceComponent } from './components/toggle-experience/toggle-experience.component';

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
    JsonPipe
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
