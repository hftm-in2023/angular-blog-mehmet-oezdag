import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
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
    DemoComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Angular Blog - Mehmet Oezdag';
  
  // Blog-Daten
  blogPosts: BlogPost[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  isLoading = false;
  showDemo = false;
  
  // Filter-Optionen
  showOnlyFeatured = false;
  
  // UI State
  isDarkMode = false;
  showSwaggerHelp = false;
  
  // Live Test State
  isTestLoading = false;
  testPost = {
    title: '',
    content: '',
    author: '',
    category: 'Test'
  };
  testResult: {
    success: boolean;
    data?: any;
    error?: string;
    rawResponse?: string;
  } | null = null;
  
  // Swagger-UI Help Content
  swaggerExampleJson = `{
  "title": "Mein neuer Blog-Post",
  "content": "Das ist der Inhalt meines Posts...",
  "author": "Mehmet Oezdag",
  "category": "Angular",
  "tags": ["tutorial", "angular"],
  "featured": false
}`;
  
  constructor(private blogService: BlogService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBlogData();
    this.loadDarkModePreference();
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
      featured: false
    };

    this.http.post<any>('http://localhost:3000/api/posts', postData)
      .subscribe({
        next: (response) => {
          this.testResult = {
            success: true,
            data: response,
            rawResponse: JSON.stringify(response, null, 2)
          };
          this.isTestLoading = false;
          
          // Refresh blog posts to show the new post
          this.loadBlogData();
        },
        error: (error) => {
          this.testResult = {
            success: false,
            error: error.error?.error || error.message || 'Unbekannter Fehler',
            rawResponse: JSON.stringify(error, null, 2)
          };
          this.isTestLoading = false;
        }
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
      category: 'Test'
    };
    this.testResult = null;
  }

  /**
   * Lädt alle Blog-Daten vom Backend
   */
  loadBlogData(): void {
    this.isLoading = true;
    
    // Lade Posts und Kategorien parallel
    this.blogService.getPosts().subscribe({
      next: (posts) => {
        this.blogPosts = posts;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Fehler beim Laden der Blog-Posts:', error);
        this.isLoading = false;
      }
    });
    
    this.blogService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Fehler beim Laden der Kategorien:', error);
      }
    });
  }

  /**
   * Filtert Posts nach Kategorie
   */
  onCategoryChange(): void {
    this.isLoading = true;
    
    const request = this.selectedCategory 
      ? this.blogService.getPostsByCategory(this.selectedCategory)
      : this.blogService.getPosts();
    
    request.subscribe({
      next: (posts) => {
        this.blogPosts = posts;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Fehler beim Filtern der Posts:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Toggled Featured Posts Filter
   */
  toggleFeaturedFilter(): void {
    this.showOnlyFeatured = !this.showOnlyFeatured;
    this.filterPosts();
  }

  /**
   * Filtert Posts basierend auf aktuellen Einstellungen
   */
  private filterPosts(): void {
    this.isLoading = true;
    
    let request;
    if (this.showOnlyFeatured) {
      request = this.blogService.getFeaturedPosts();
    } else if (this.selectedCategory) {
      request = this.blogService.getPostsByCategory(this.selectedCategory);
    } else {
      request = this.blogService.getPosts();
    }
    
    request.subscribe({
      next: (posts) => {
        this.blogPosts = posts;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Fehler beim Filtern der Posts:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Setzt alle Filter zurück
   */
  resetFilters(): void {
    this.selectedCategory = '';
    this.showOnlyFeatured = false;
    this.loadBlogData();
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
      day: 'numeric'
    });
  }

  /**
   * Kürzt den Content für die Vorschau
   */
  getPreviewContent(content: string, maxLength: number = 150): string {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  }

  /**
   * Gibt die Farbe für eine Kategorie zurück
   */
  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Angular': 'primary',
      'CSS': 'accent',
      'TypeScript': 'warn'
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
