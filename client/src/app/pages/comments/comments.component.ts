import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommentService } from '../../services/comment.service';
import { CommentFormComponent } from '../../components/comment-form/comment-form.component';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    CommentFormComponent
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent {
  @Input() comments: any[] = [];
  @Input() articleId!: string;
  @Output() refresh = new EventEmitter<void>();

  replyingTo: string | null = null;

  constructor(private commentService: CommentService) { }

  showReplyForm(commentId: string) {
    this.replyingTo = commentId;
  }

  hideReplyForm() {
    this.replyingTo = null;
  }

  onReplySubmitted() {
    this.replyingTo = null;
    this.refresh.emit();
  }

  canDelete(comment: any): boolean {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user && (user.role === 'admin' || user._id === comment.author?._id);
  }

  onDelete(id: string) {
    if (!confirm('Supprimer ce commentaire ?')) return;

    this.commentService.deleteComment(id).subscribe({
      next: () => this.refresh.emit(),
      error: () => alert('Erreur lors de la suppression')
    });
  }
}
