import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { BlogPost } from '../../../../core/schemas/blog.schemas';

@Component({
  selector: 'app-blog-detail-view',
  templateUrl: './blog-detail-view.component.html',
  styleUrls: ['./blog-detail-view.component.scss'],
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MatIconModule, MatChipsModule, MatDividerModule],
})
export class BlogDetailViewComponent {
  @Input() post!: BlogPost;

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Get category color
   */
  getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      Angular: 'primary',
      CSS: 'accent',
      TypeScript: 'warn',
      Azure: 'primary',
    };
    return colors[category] || 'primary';
  }

  /**
   * Get estimated reading time
   */
  getReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}
