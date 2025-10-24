import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipComponent } from '../../types/Day';

@Component({
  selector: 'app-tip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tip.component.html',
  styleUrls: ['./tip.component.css']
})
export class Tip {
  @Input() tip!: TipComponent;

  getIconUrl(): string {
    switch (this.tip.icon) {
      case 'Ausrufezeichen': return '/icons/exclamation.png';
      case 'Fragezeichen': return '/icons/question.png';
      case 'Smiley': return '/icons/smiley.png';
      default: return '/icons/smileyBad.png';
    }
  }

  getImageUrl(): string | null {
    if (!this.tip.bild) return null;
    return this.tip.bild.formats?.small?.url ?? this.tip.bild.url ?? null;
  }

}
