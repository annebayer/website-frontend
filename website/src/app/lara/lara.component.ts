import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-lara',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lara.component.html',
  styleUrls: ['./lara.component.css']
})
export class LaraEasterEggComponent {
showImage = false;

  openImage() {
    this.showImage = true;
  }

  closeImage() {
    this.showImage = false;
  }
}
