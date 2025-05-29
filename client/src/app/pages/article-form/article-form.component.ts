import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-article-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss'],
})
export class ArticleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private articleService = inject(ArticleService);

  isEdit = false;
  articleId: string | null = null;

  form = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    tags: [''],
    published: [false]
  });

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.articleId;

    if (this.isEdit && this.articleId) {
      this.articleService.getOne(this.articleId).subscribe({
        next: (res: any) => {
          this.form.patchValue({
            title: res.article.title,
            content: res.article.content,
            tags: res.article.tags?.join(', ') || '',
            published: res.article.published
          });
        },
        error: err => {
          alert('Erreur lors du chargement de l’article.');
          this.router.navigate(['/articles']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const data = {
      ...this.form.value,
      tags: this.form.value.tags?.split(',').map(tag => tag.trim())
    };

    const req = this.isEdit && this.articleId
      ? this.articleService.update(this.articleId, data)
      : this.articleService.create(data);

    req.subscribe({
      next: () => this.router.navigate(['/articles']),
      error: err => alert('Erreur : ' + (err.error?.message || ''))
    });
  }
}
