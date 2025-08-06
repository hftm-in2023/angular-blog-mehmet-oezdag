import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest, EMPTY, of } from 'rxjs';
import { map, switchMap, startWith, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BlogService } from '../../../../core/services/blog.service';
import { BlogPost } from '../../../../core/schemas/blog.schemas';
import { BlogFilterComponent } from '../blog-filter/blog-filter.component';
import { BlogListComponent } from '../blog-list/blog-list.component';

interface BlogData {
  posts: BlogPost[];
  categories: string[];
  isLoading: boolean;
}

@Component({
  selector: 'app-blog-overview-container',
  templateUrl: './blog-overview-container.component.html',
  styleUrls: ['./blog-overview-container.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, BlogFilterComponent, BlogListComponent],
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
      // Set loading state immediately
      const loadingState: BlogData = { posts: [], categories: [], isLoading: true };

      const postsRequest = this.getPostsRequest(category, featured);
      const categoriesRequest = this.blogService.getCategories().pipe(catchError(() => of([])));

      return combineLatest([postsRequest, categoriesRequest]).pipe(
        map(([posts, categories]) => ({
          posts,
          categories,
          isLoading: false,
        })),
        startWith(loadingState),
        catchError((error) => {
          console.error('Error loading blog data:', error);
          return of({ posts: [], categories: [], isLoading: false });
        }),
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
