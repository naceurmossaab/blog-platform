import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Article, ArticleApiResponse } from '../models/article';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private baseUrl = environment.apiUrl + 'articles';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<ArticleApiResponse>(this.baseUrl, { withCredentials: true });
  }

  getOne(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  create(data: any) {
    return this.http.post(this.baseUrl, data, { withCredentials: true });
  }

  update(id: string, data: any) {
    return this.http.patch(`${this.baseUrl}/${id}`, data, { withCredentials: true });
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`, { withCredentials: true });
  }
}
