import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { DirectorModeComponent } from "./director-mode.component";
import { VrHeadsetsDirectorComponent } from "../vr-headsets-director/vr-headsets-director.component";


@NgModule({
    declarations: [
        DirectorModeComponent,
        VrHeadsetsDirectorComponent
    ],
    exports: [
        DirectorModeComponent,
        VrHeadsetsDirectorComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ]
  })
  export class DirectorModeModule { }
  