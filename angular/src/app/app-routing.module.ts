import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { DirectorModeComponent } from './components/director-mode/director-mode.component';
import { OperatorModeComponent } from './components/operator-mode/operator-mode.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'operator-mode',
    pathMatch: 'full'  // Ensure it only redirects on an exact match of the path
  },
  {
    path: 'operator-mode',
    component: OperatorModeComponent
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
