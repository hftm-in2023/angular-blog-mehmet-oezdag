import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest, EMPTY } from 'rxjs';
import { map, switchMap, startWith, catchError, finalize } from 'rxjs/operators';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';

// Services
import { BlogService, BlogPost } from './services/blog.service';
import { DemoComponent } from './demo/demo.component';

interface BlogData {
  posts: BlogPost[];
  categories: string[];
  isLoading: boolean;
}

interface TestResult {
  success: boolean;
  data?: BlogPost;
  error?: string;
  rawResponse?: string;
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    NgOptimizedImage,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatDialogModule,
    MatTooltipModule,
    MatInputModule,
    DemoComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Angular Blog - Mehmet Oezdag';

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

  // UI State
  isDarkMode = false;
  showDemo = false;
  showSwaggerHelp = false;

  // Live Test State
  isTestLoading = false;
  testPost = {
    title: '',
    content: '',
    author: '',
    category: 'Test',
  };
  testResult: TestResult | null = null;

  // Swagger-UI Help Content
  swaggerExampleJson = `{
  "title": "Mein neuer Blog-Post",
  "content": "Das ist der Inhalt meines Posts...",
  "author": "Mehmet Oezdag",
  "category": "Angular",
  "tags": ["tutorial", "angular"],
  "featured": false
}`;

  constructor(
    private blogService: BlogService,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.loadDarkModePreference();
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
   * Lädt die Dark Mode Einstellung aus dem localStorage
   */
  private loadDarkModePreference(): void {
    const darkModePreference = localStorage.getItem('darkMode');
    this.isDarkMode = darkModePreference === 'true';
    this.applyDarkMode();
  }

  /**
   * Toggles Dark Mode
   */
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.applyDarkMode();
  }

  /**
   * Wendet Dark Mode auf das Dokument an
   */
  private applyDarkMode(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  /**
   * Toggles Swagger-UI Help Popup
   */
  toggleSwaggerHelp(): void {
    this.showSwaggerHelp = !this.showSwaggerHelp;
  }

  /**
   * Schließt das Swagger-UI Help Popup
   */
  closeSwaggerHelp(): void {
    this.showSwaggerHelp = false;
  }

  /**
   * Sendet einen Live-Test POST Request
   */
  sendLiveTestPost(): void {
    if (!this.testPost.title || !this.testPost.content) {
      return;
    }

    this.isTestLoading = true;
    this.testResult = null;

    const postData = {
      title: this.testPost.title,
      content: this.testPost.content,
      author: this.testPost.author || 'Test User',
      category: this.testPost.category,
      tags: ['live-test', 'api-demo'],
      featured: false,
    };

    this.http
      .post<BlogPost>('http://localhost:3000/api/posts', postData)
      .pipe(finalize(() => (this.isTestLoading = false)))
      .subscribe({
        next: (response) => {
          this.testResult = {
            success: true,
            data: response,
            rawResponse: JSON.stringify(response, null, 2),
          };

          // Trigger refresh to show the new post
          this.refreshTriggerSubject.next();
        },
        error: (error) => {
          this.testResult = {
            success: false,
            error: error.error?.error || error.message || 'Unbekannter Fehler',
            rawResponse: JSON.stringify(error, null, 2),
          };
        },
      });
  }

  /**
   * Setzt das Test-Formular zurück
   */
  resetTestForm(): void {
    this.testPost = {
      title: '',
      content: '',
      author: '',
      category: 'Test',
    };
    this.testResult = null;
  }

  /**
   * Filtert Posts nach Kategorie
   */
  onCategoryChange(): void {
    // The observable stream will automatically handle this
  }

  /**
   * Updates the selected category
   */
  updateSelectedCategory(category: string): void {
    this.selectedCategorySubject.next(category);
  }

  /**
   * Toggled Featured Posts Filter
   */
  toggleFeaturedFilter(): void {
    const currentValue = this.showOnlyFeaturedSubject.value;
    this.showOnlyFeaturedSubject.next(!currentValue);
  }

  /**
   * Setzt alle Filter zurück
   */
  resetFilters(): void {
    this.selectedCategorySubject.next('');
    this.showOnlyFeaturedSubject.next(false);
  }

  /**
   * Toggled Demo-Anzeige
   */
  toggleDemo(): void {
    this.showDemo = !this.showDemo;
  }

  /**
   * Formatiert das Datum für die Anzeige
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Kürzt den Content für die Vorschau
   */
  getPreviewContent(content: string, maxLength = 150): string {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  }

  /**
   * Gibt die Farbe für eine Kategorie zurück
   */
  getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      Angular: 'primary',
      CSS: 'accent',
      TypeScript: 'warn',
    };
    return colors[category] || 'primary';
  }

  /**
   * Gibt die Angular Version zurück
   */
  getAngularVersion(): string {
    return '19';
  }
}
