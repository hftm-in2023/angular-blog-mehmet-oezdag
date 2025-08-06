import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BlogDetailRoutingModule } from './blog-detail-routing.module';
import { BlogDetailContainerComponent } from './components/blog-detail-container/blog-detail-container.component';
import { BlogDetailViewComponent } from './components/blog-detail-view/blog-detail-view.component';

@NgModule({
  imports: [
    CommonModule,
    NgOptimizedImage,
    BlogDetailRoutingModule,

    // Components (if they are standalone)
    BlogDetailContainerComponent,
    BlogDetailViewComponent,

    // Angular Material
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
})
export class BlogDetailModule {}
