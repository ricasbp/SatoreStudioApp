import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-operator-mode',
  templateUrl: './operator-mode.component.html',
  styleUrls: ['./operator-mode.component.css']
})
export class OperatorModeComponent {
  
  userInputExpressIP: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.userInputExpressIP = this.route.snapshot.paramMap.get('userInputExpressIP') || 'defaultIP';
  }
}
