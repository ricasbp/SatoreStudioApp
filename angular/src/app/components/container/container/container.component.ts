import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent {

  @Input() current: any;
  title = 'angular-tour-of-heroes';
  random = 1;

  runRandom() {
    this.random = Math.random();
  }
}
