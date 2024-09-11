import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { OperatorModeComponent } from "./operator-mode.component";
import { VrHeadsetsOperatorComponent } from "../vr-headsets-operator/vr-headsets-operator.component";
import { ToggleExperienceComponent } from "../toggle-experience/toggle-experience.component";
import { OSCContainerComponent } from "src/app/container/osccontainer/osccontainer.component";


@NgModule({
    declarations: [
        OperatorModeComponent,
        ToggleExperienceComponent,
        VrHeadsetsOperatorComponent,
        OSCContainerComponent
    ],
    exports: [
        OperatorModeComponent,
        ToggleExperienceComponent,
        VrHeadsetsOperatorComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ]
  })
  export class OperatorModeModule { }
  