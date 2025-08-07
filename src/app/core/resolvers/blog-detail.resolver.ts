import { inject, Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BlogService } from '../services/blog.service';
import { BlogPost } from '../schemas/blog.schemas';

@Injectable({
  providedIn: 'root',
})
export class BlogDetailResolver {
  private blogService = inject(BlogService);
  private router = inject(Router);

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<BlogPost | null> {
    const blogId = route.paramMap.get('id');

    if (!blogId || isNaN(Number(blogId))) {
      console.error('Invalid blog ID provided');
      this.router.navigate(['/blog']);
      return EMPTY;
    }

    return this.blogService.getPost(Number(blogId)).pipe(
      map((post) => {
        if (!post) {
          console.error(`Blog post with ID ${blogId} not found`);
          this.router.navigate(['/blog']);
          return null;
        }
        return post;
      }),
      catchError((error) => {
        console.error('Error loading blog post:', error);
        this.router.navigate(['/blog']);
        return of(null);
      }),
    );
  }
}
