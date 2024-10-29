import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { ToggleExperienceComponent } from "../toggle-experience/toggle-experience.component";


@NgModule({
    declarations: [
        ToggleExperienceComponent
    ],
    exports: [
        ToggleExperienceComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ]
  })
  export class ToggleExperienceModule { }
  