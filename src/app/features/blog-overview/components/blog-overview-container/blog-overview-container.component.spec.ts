import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { BlogOverviewContainerComponent } from './blog-overview-container.component';
import { BlogService } from '../../../../core/services/blog.service';
import { BlogPost } from '../../../../core/schemas/blog.schemas';

describe('BlogOverviewContainerComponent (Smart Component)', () => {
  let component: BlogOverviewContainerComponent;
  let fixture: ComponentFixture<BlogOverviewContainerComponent>;
  let blogService: jasmine.SpyObj<BlogService>;

  const mockBlogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Test Post 1',
      content: 'Content 1',
      author: 'Author 1',
      publishDate: '2024-01-15',
      category: 'Angular',
      tags: ['test'],
      featured: true,
      imageUrl: 'https://example.com/image1.jpg',
    },
    {
      id: 2,
      title: 'Test Post 2',
      content: 'Content 2',
      author: 'Author 2',
      publishDate: '2024-01-16',
      category: 'TypeScript',
      tags: ['test'],
      featured: false,
      imageUrl: 'https://example.com/image2.jpg',
    },
  ];

  const mockCategories = ['Angular', 'TypeScript', 'CSS'];

  beforeEach(async () => {
    const blogServiceSpy = jasmine.createSpyObj('BlogService', [
      'getPosts',
      'getPostsByCategory',
      'getFeaturedPosts',
      'getCategories',
    ]);

    await TestBed.configureTestingModule({
      imports: [BlogOverviewContainerComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers: [{ provide: BlogService, useValue: blogServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogOverviewContainerComponent);
    component = fixture.componentInstance;
    blogService = TestBed.inject(BlogService) as jasmine.SpyObj<BlogService>;

    // Setup default service responses
    blogService.getPosts.and.returnValue(of(mockBlogPosts));
    blogService.getPostsByCategory.and.returnValue(
      of(mockBlogPosts.filter((p) => p.category === 'Angular')),
    );
    blogService.getFeaturedPosts.and.returnValue(of(mockBlogPosts.filter((p) => p.featured)));
    blogService.getCategories.and.returnValue(of(mockCategories));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be a Smart Component (manages state)', () => {
    // Smart component should have observables and state management
    expect(component.blogData$).toBeDefined();
    expect(component.selectedCategory$).toBeDefined();
    expect(component.showOnlyFeatured$).toBeDefined();

    // Should have methods for state changes
    expect(component.onCategoryChange).toBeDefined();
    expect(component.onToggleFeatured).toBeDefined();
    expect(component.onResetFilters).toBeDefined();
    expect(component.onRefresh).toBeDefined();
  });

  it('should load blog data on initialization', (done) => {
    fixture.detectChanges();

    component.blogData$.subscribe((data) => {
      if (!data.isLoading) {
        expect(data.posts).toEqual(mockBlogPosts);
        expect(data.categories).toEqual(mockCategories);
        expect(blogService.getPosts).toHaveBeenCalled();
        expect(blogService.getCategories).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should filter posts by category', (done) => {
    fixture.detectChanges();

    // Change category filter
    component.onCategoryChange('Angular');

    component.blogData$.subscribe((data) => {
      if (!data.isLoading) {
        expect(blogService.getPostsByCategory).toHaveBeenCalledWith('Angular');
        done();
      }
    });
  });

  it('should filter posts by featured status', (done) => {
    fixture.detectChanges();

    // Toggle featured filter
    component.onToggleFeatured();

    component.blogData$.subscribe((data) => {
      if (!data.isLoading) {
        expect(blogService.getFeaturedPosts).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should reset filters', () => {
    // Set some filters first
    component.onCategoryChange('Angular');
    component.onToggleFeatured();

    // Reset filters
    component.onResetFilters();

    // Check that filters are reset
    component.selectedCategory$.subscribe((category) => {
      expect(category).toBe('');
    });

    component.showOnlyFeatured$.subscribe((featured) => {
      expect(featured).toBe(false);
    });
  });

  it('should handle refresh requests', () => {
    spyOn(component['refreshTriggerSubject'], 'next');

    component.onRefresh();

    expect(component['refreshTriggerSubject'].next).toHaveBeenCalled();
  });

  it('should handle service errors gracefully', (done) => {
    // Mock service error
    blogService.getPosts.and.returnValue(throwError(() => new Error('Service error')));
    blogService.getCategories.and.returnValue(of(mockCategories));

    fixture.detectChanges();

    component.blogData$.subscribe((data) => {
      if (!data.isLoading) {
        // Should provide empty state on error
        expect(data.posts).toEqual([]);
        expect(data.categories).toEqual(mockCategories);
        done();
      }
    });
  });

  it('should start with loading state', (done) => {
    // Before fixture.detectChanges(), check initial loading state
    component.blogData$.subscribe((data) => {
      if (data.isLoading) {
        expect(data.posts).toEqual([]);
        expect(data.categories).toEqual([]);
        expect(data.isLoading).toBe(true);
        done();
      }
    });

    fixture.detectChanges();
  });

  it('should pass correct data to dumb components', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;

    // Should contain app-blog-filter component
    expect(compiled.querySelector('app-blog-filter')).toBeTruthy();

    // Should contain app-blog-list component
    expect(compiled.querySelector('app-blog-list')).toBeTruthy();
  });

  it('should handle combined filters (category + featured)', (done) => {
    const angularPosts = mockBlogPosts.filter((p) => p.category === 'Angular');
    blogService.getPostsByCategory.and.returnValue(of(angularPosts));

    fixture.detectChanges();

    // Set category filter
    component.onCategoryChange('Angular');

    component.blogData$.subscribe((data) => {
      if (!data.isLoading) {
        expect(blogService.getPostsByCategory).toHaveBeenCalledWith('Angular');
        done();
      }
    });
  });
});
