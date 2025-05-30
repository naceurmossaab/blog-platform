import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private baseUrl = environment.apiUrl + 'comments';

  constructor(private http: HttpClient) { }

  getCommentsByArticle(articleId: string) {
    return this.http.get(`${this.baseUrl}/${articleId}`, { withCredentials: true });
  }

  createComment(articleId: string, data: { content: string, parent?: string }) {
    return this.http.post(`${this.baseUrl}/${articleId}`, data, { withCredentials: true });
  }

  deleteComment(commentId: string) {
    return this.http.delete(`${this.baseUrl}/delete/${commentId}`, { withCredentials: true });
  }
}
