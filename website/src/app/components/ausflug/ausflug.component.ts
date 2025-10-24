import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AusfluegeComponent, MediaFile } from '../../types/Day';
import { Tip } from '../tip/tip.component';

@Component({
  selector: 'app-ausflug',
  standalone: true,
  imports: [CommonModule, Tip],
  templateUrl: './ausflug.component.html',
  styleUrls: ['./ausflug.component.css']
})
export class Ausflug {
  @Input() ausflug!: AusfluegeComponent;
  @Input() strapiUrl: string = 'http://localhost:1337';

  @Output() imageClick = new EventEmitter<{
    images: MediaFile[];
    index: number;
    description: string;
  }>();

  getImageUrl(url: string): string {
    if (!url) return '';
    return url.startsWith('http') ? url : `${this.strapiUrl}${url}`;
  }

  onImageClick(images: MediaFile[], index: number, description: string = ''): void {
    this.imageClick.emit({ images, index, description });
  }
}
