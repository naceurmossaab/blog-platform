import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommentService } from '../../services/comment.service';
import { CommentFormComponent } from '../../components/comment-form/comment-form.component';
import { AuthUser } from '../../models/auth';
import { AuthService } from '../../services/auth.service';

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

  private authService = inject(AuthService);
  private commentService = inject(CommentService);

  authUser?: AuthUser;
  replyingTo: string | null = null;

  ngOnInit() {
    if (!this.authUser)
      this.authService.authUser$.subscribe(user => {
        this.authUser = user
      });
  }

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
    return !!this.authUser && (this.authUser.role === 'admin' || this.authUser.userId === comment.author?._id);
  }

  onDelete(id: string) {
    if (!confirm('Supprimer ce commentaire ?')) return;

    this.commentService.deleteComment(id).subscribe({
      next: () => this.refresh.emit(),
      error: () => alert('Erreur lors de la suppression')
    });
  }
}
