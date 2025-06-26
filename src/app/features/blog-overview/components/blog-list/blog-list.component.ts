import { Component, Input } from '@angular/core';
import { BlogPost } from '../../../../core/services/blog.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent {
  @Input() posts: BlogPost[] = [];
  @Input() isLoading = false;
  @Input() hasFilters = false;

  trackByPost(index: number, post: BlogPost): number {
    return post.id;
  }
}
