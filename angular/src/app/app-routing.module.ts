import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectorModeComponent } from './components/director-mode/director-mode.component';

const routes: Routes = [
  //TODO: Redirct default route ('') to OperatorMode 
  {
    path: 'operator-mode',
    component: DirectorModeComponent
  },
  {
    path: 'director-mode',
    component: DirectorModeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
