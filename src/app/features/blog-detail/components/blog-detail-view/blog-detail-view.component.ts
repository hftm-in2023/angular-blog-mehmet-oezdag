import { Component, Input } from '@angular/core';
import { BlogPost } from '../../../../core/services/blog.service';

@Component({
  selector: 'app-blog-detail-view',
  templateUrl: './blog-detail-view.component.html',
  styleUrls: ['./blog-detail-view.component.scss'],
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
