import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Article } from '../../models/article';

@Component({
  standalone: true,
  selector: 'app-articles',
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './articles.component.html',
})
export class ArticlesComponent implements OnInit {
  private articleService = inject(ArticleService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  articles: Article[] = [];
  displayedColumns: string[] = ['title', 'author', 'date', 'actions'];

  ngOnInit(): void {
    this.articleService.getAll().subscribe({
      next: (res) => {
        this.articles = res.articles;
      },
      error: (err) => {
        console.error('Error loading articles:', err);
      }
    });
  }

  view(id: string) {
    this.router.navigate(['/articles', id]);
  }

  edit(id: string) {
    this.router.navigate(['/articles/edit', id]);
  }

  delete(id: string) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

    this.articleService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Article supprimé avec succès', 'Fermer', { duration: 3000 });
        this.articles = this.articles.filter(a => a._id !== id);
      },
      error: () => {
        this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
      }
    });
  }
}
