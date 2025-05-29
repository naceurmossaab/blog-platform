import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  standalone: true,
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  imports: [CommonModule, RouterModule, MatCardModule, MatChipsModule],
})
export class ArticleDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private articleService = inject(ArticleService);
  article: any = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.articleService.getOne(id).subscribe({
      next: (res: any) => {
        this.article = res.article;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l’article', err);
      }
    });
  }
}
