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
  imagePreview: string | ArrayBuffer | null = null;

  form = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    tags: [''],
    published: [false],
    image: [null as File | null]  // Ajout du champ image
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
            // On ne patch pas l'image, car c’est un fichier
          });
        },
        error: err => {
          alert('Erreur lors du chargement de l’article.');
          this.router.navigate(['/articles']);
        }
      });
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.form.patchValue({ image: file });
      this.form.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  onSubmit(): void {
    if (this.form.invalid) return;

    const formData = new FormData();

    formData.append('title', this.form.value.title!);
    formData.append('content', this.form.value.content!);
    formData.append('published', this.form.value.published ? 'true' : 'false');

    if (this.form.value.tags) {
      const tagsArray = this.form.value.tags.split(',').map((tag: string) => tag.trim());
      formData.append('tags', JSON.stringify(tagsArray));
    }

    if (this.form.value.image) {
      formData.append('image', this.form.value.image);
    }

    const req = this.isEdit && this.articleId
      ? this.articleService.update(this.articleId, formData)
      : this.articleService.create(formData);

    req.subscribe({
      next: () => this.router.navigate(['/articles']),
      error: err => alert('Erreur : ' + (err.error?.message || ''))
    });
  }
}
