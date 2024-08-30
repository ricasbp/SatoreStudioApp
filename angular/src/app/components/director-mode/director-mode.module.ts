import { NgModule } from "@angular/core";
import { ToggleExperienceComponent } from "../toggle-experience/toggle-experience.component";
import { vrHeadsetsComponent } from "../vrHeadsets/vrHeadsets.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DirectorModeComponent } from "./director-mode.component";

@NgModule({
    declarations: [
        DirectorModeComponent,
        ToggleExperienceComponent,
        vrHeadsetsComponent
    ],
    exports: [
        DirectorModeComponent,
        ToggleExperienceComponent,
        vrHeadsetsComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ]
  })
  export class DirectorModeModule { }
  