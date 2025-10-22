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
    switch (this.tip.Icon) {
      case 'Ausrufezeichen': return '/assets/icons/exclamation.png';
      case 'Fragezeichen': return '/assets/icons/question.png';
      case 'Smiley': return '/assets/icons/smiley.png';
      default: return '/assets/icons/info.png';
    }
  }

  getImageUrl(): string | null {
    if (!this.tip.Bild) return null;
    return this.tip.Bild.formats?.small?.url ?? this.tip.Bild.url ?? null;
  }

}
