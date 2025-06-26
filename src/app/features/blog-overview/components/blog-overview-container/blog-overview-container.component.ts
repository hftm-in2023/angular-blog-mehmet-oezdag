import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, EMPTY } from 'rxjs';
import { map, switchMap, startWith, catchError } from 'rxjs/operators';
import { BlogService, BlogPost } from '../../../../core/services/blog.service';

interface BlogData {
  posts: BlogPost[];
  categories: string[];
  isLoading: boolean;
}

@Component({
  selector: 'app-blog-overview-container',
  templateUrl: './blog-overview-container.component.html',
  styleUrls: ['./blog-overview-container.component.scss'],
})
export class BlogOverviewContainerComponent implements OnInit {
  // Reactive state subjects
  private selectedCategorySubject = new BehaviorSubject<string>('');
  private showOnlyFeaturedSubject = new BehaviorSubject<boolean>(false);
  private refreshTriggerSubject = new BehaviorSubject<void>(undefined);

  // Reactive streams
  selectedCategory$ = this.selectedCategorySubject.asObservable();
  showOnlyFeatured$ = this.showOnlyFeaturedSubject.asObservable();

  // Combined blog data stream
  blogData$: Observable<BlogData> = combineLatest([
    this.selectedCategory$,
    this.showOnlyFeatured$,
    this.refreshTriggerSubject,
  ]).pipe(
    switchMap(([category, featured]) => {
      const postsRequest = this.getPostsRequest(category, featured);
      const categoriesRequest = this.blogService.getCategories().pipe(catchError(() => EMPTY));

      return combineLatest([
        postsRequest.pipe(startWith([])),
        categoriesRequest.pipe(startWith([])),
      ]).pipe(
        map(([posts, categories]) => ({
          posts,
          categories,
          isLoading: false,
        })),
        startWith({ posts: [], categories: [], isLoading: true }),
        catchError(() => [{ posts: [], categories: [], isLoading: false }]),
      );
    }),
  );

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    // Initialize component - data loading is handled by the reactive stream
    console.warn('Blog overview container initialized');
  }

  /**
   * Gets the appropriate posts request based on filters
   */
  private getPostsRequest(category: string, featured: boolean): Observable<BlogPost[]> {
    if (featured) {
      return this.blogService.getFeaturedPosts();
    } else if (category) {
      return this.blogService.getPostsByCategory(category);
    } else {
      return this.blogService.getPosts();
    }
  }

  /**
   * Updates the selected category
   */
  onCategoryChange(category: string): void {
    this.selectedCategorySubject.next(category);
  }

  /**
   * Toggles featured posts filter
   */
  onToggleFeatured(): void {
    const currentValue = this.showOnlyFeaturedSubject.value;
    this.showOnlyFeaturedSubject.next(!currentValue);
  }

  /**
   * Resets all filters
   */
  onResetFilters(): void {
    this.selectedCategorySubject.next('');
    this.showOnlyFeaturedSubject.next(false);
  }

  /**
   * Handles refresh request
   */
  onRefresh(): void {
    this.refreshTriggerSubject.next();
  }
}
