import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipComponent } from '../../types/Day';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tip.component.html',
  styleUrls: ['./tip.component.css']
})
export class Tip {
  @Input() tip!: TipComponent;
  @Input() baseUrl: string = environment.baseUrl;


  getIconUrl(): string {
    switch (this.tip.icon) {
      case 'Ausrufezeichen': return 'icons/exclamation.png';
      case 'Fragezeichen': return 'icons/question.png';
      case 'Smiley': return 'icons/smiley.png';
      default: return 'icons/smileyBad.png';
    }
  }

    getImageUrl(url: string| undefined): string {
      if (!url) return '';
      return url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    }

}
