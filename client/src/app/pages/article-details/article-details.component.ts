import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { CommentsComponent } from '../comments/comments.component';
import { CommentService } from '../../services/comment.service';
import { CommentFormComponent } from '../../components/comment-form/comment-form.component';

@Component({
  standalone: true,
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  imports: [CommonModule, RouterModule, MatCardModule, MatChipsModule, CommentsComponent, CommentFormComponent],
})
export class ArticleDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private articleService = inject(ArticleService);
  private commentService = inject(CommentService);

  article: any = null;
  comments: any[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.articleService.getOne(id).subscribe({
      next: (res: any) => {
        this.article = res.article;
        this.reloadComments(res.article._id);
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l’article', err);
      }
    });

  }

  reloadComments(id?: string) {
    this.commentService.getCommentsByArticle(this.article._id || id).subscribe((res: any) => {
      this.comments = res.comments;
    });
  }
}
