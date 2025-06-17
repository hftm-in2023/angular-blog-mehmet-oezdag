import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  tags: string[];
  featured: boolean;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  /**
   * Lädt alle Blog-Posts oder filtert nach Kategorie/Featured Status
   */
  getPosts(category?: string, featured?: boolean): Observable<BlogPost[]> {
    let params = new HttpParams();
    
    if (category) {
      params = params.set('category', category);
    }
    
    if (featured !== undefined) {
      params = params.set('featured', featured.toString());
    }
    
    return this.http.get<BlogPost[]>(`${this.apiUrl}/posts`, { params });
  }

  /**
   * Lädt einen einzelnen Blog-Post nach ID
   */
  getPost(id: number): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/posts/${id}`);
  }

  /**
   * Lädt alle verfügbaren Kategorien
   */
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }

  /**
   * Lädt nur Featured Posts
   */
  getFeaturedPosts(): Observable<BlogPost[]> {
    return this.getPosts(undefined, true);
  }

  /**
   * Lädt Posts nach Kategorie
   */
  getPostsByCategory(category: string): Observable<BlogPost[]> {
    return this.getPosts(category);
  }
} 