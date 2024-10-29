import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";


import { OSCContainerComponent } from "./osccontainer.component";

@NgModule({
    declarations: [
        OSCContainerComponent
    ],
    exports: [
        OSCContainerComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ]
  })
  export class OSCContainerModule { }
  