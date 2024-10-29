import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { OperatorModeComponent } from "./operator-mode.component";
import { VrHeadsetsOperatorComponent } from "../vr-headsets-operator/vr-headsets-operator.component";
import { ToggleExperienceModule } from "../toggle-experience/toggle-experience.module";
import { OSCContainerModule } from "src/app/container/osccontainer/osccontainer.module";


@NgModule({
    declarations: [
        OperatorModeComponent,
        VrHeadsetsOperatorComponent
    ],
    exports: [
        OperatorModeComponent,
        VrHeadsetsOperatorComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ToggleExperienceModule,
        OSCContainerModule
    ]
  })
  export class OperatorModeModule { }
  