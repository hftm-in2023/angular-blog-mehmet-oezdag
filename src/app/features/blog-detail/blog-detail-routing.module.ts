import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogDetailContainerComponent } from './components/blog-detail-container/blog-detail-container.component';
import { BlogDetailResolver } from '../../core/resolvers/blog-detail.resolver';

const routes: Routes = [
  {
    path: ':id',
    component: BlogDetailContainerComponent,
    resolve: {
      blogPost: BlogDetailResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogDetailRoutingModule {}
