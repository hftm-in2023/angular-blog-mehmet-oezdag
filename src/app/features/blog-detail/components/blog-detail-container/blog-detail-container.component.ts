import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlogPost } from '../../../../core/services/blog.service';

@Component({
  selector: 'app-blog-detail-container',
  templateUrl: './blog-detail-container.component.html',
  styleUrls: ['./blog-detail-container.component.scss'],
})
export class BlogDetailContainerComponent implements OnInit {
  blogPost$: Observable<BlogPost | null> = of(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Get the resolved blog post from the route data
    this.blogPost$ = this.route.data.pipe(map((data) => data['blogPost']));
  }

  /**
   * Navigate back to blog overview
   */
  onBackToBlog(): void {
    this.router.navigate(['/blog']);
  }

  /**
   * Share blog post (placeholder implementation)
   */
  onShare(): void {
    // Placeholder for share functionality
    console.warn('Share functionality would be implemented here');
  }

  /**
   * Bookmark blog post (placeholder implementation)
   */
  onBookmark(): void {
    // Placeholder for bookmark functionality
    console.warn('Bookmark functionality would be implemented here');
  }
}
