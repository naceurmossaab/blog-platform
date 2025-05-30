import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.scss',
})
export class CommentFormComponent {
  @Input() articleId!: string;
  @Input() parent?: string;
  @Output() submitted = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private commentService = inject(CommentService);

  form = this.fb.group({
    content: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.invalid) return;

    const data: any = {
      content: this.form.value.content,
    };

    if (this.parent) {
      data.parent = this.parent;
    }

    this.commentService.createComment(this.articleId, data).subscribe({
      next: () => {
        this.form.reset();
        this.submitted.emit();
        if (this.parent) this.cancel.emit();
      },
      error: () => {
        alert('Erreur lors de l\'envoi du commentaire');
      }
    });
  }

  cancelReply() {
    this.cancel.emit();
  }
}
