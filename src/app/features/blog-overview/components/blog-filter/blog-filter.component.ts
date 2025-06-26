import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-blog-filter',
  templateUrl: './blog-filter.component.html',
  styleUrls: ['./blog-filter.component.scss'],
})
export class BlogFilterComponent {
  @Input() categories: string[] = [];
  @Input() selectedCategory: string | null = '';
  @Input() showOnlyFeatured: boolean | null = false;
  @Input() isLoading = false;

  @Output() categoryChanged = new EventEmitter<string>();
  @Output() featuredToggled = new EventEmitter<void>();
  @Output() filtersReset = new EventEmitter<void>();
  @Output() refreshRequested = new EventEmitter<void>();

  onCategoryChange(event: { value: string }): void {
    this.categoryChanged.emit(event.value);
  }

  onToggleFeatured(): void {
    this.featuredToggled.emit();
  }

  onResetFilters(): void {
    this.filtersReset.emit();
  }

  onRefresh(): void {
    this.refreshRequested.emit();
  }
}
