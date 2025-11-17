import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionAnswerComponent } from '../../types/Day';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-question-answer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-answer.component.html',
  styleUrls: ['./question-answer.component.css']
})
export class QuestionAnswer {
  @Input() qa!: QuestionAnswerComponent;
  @Input() baseUrl: string = environment.baseUrl;
  isFlipped = false;

  toggleFlip(): void {
    this.isFlipped = !this.isFlipped;
  }

  getQuestionImageUrl(): string | null {
    if (!this.qa.bildQuestion) return null;
    return this.qa.bildQuestion.formats?.small?.url ?? this.qa.bildQuestion.url ?? null;
  }

  getAnswerImageUrl(): string | null {
    if (!this.qa.bildAnswer) return null;
    return this.qa.bildAnswer.formats?.small?.url ?? this.qa.bildAnswer.url ?? null;
  }

  getFullImageUrl(url: string): string {
      if (!url) return '';
       return url.startsWith('http') ? url : `${this.baseUrl}${url}`;
  }
}
