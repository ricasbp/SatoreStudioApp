import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { DirectorModeComponent } from "./director-mode.component";
import { VrHeadsetsDirectorComponent } from "../vr-headsets-director/vr-headsets-director.component";
import { ToggleExperienceModule } from "../toggle-experience/toggle-experience.module";
import { OSCContainerModule } from "src/app/container/osccontainer/osccontainer.module";


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
        FormsModule,
        ToggleExperienceModule,
        OSCContainerModule
    ]
  })
  export class DirectorModeModule { }
  