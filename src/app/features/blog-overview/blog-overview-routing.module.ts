import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogOverviewContainerComponent } from './components/blog-overview-container/blog-overview-container.component';

const routes: Routes = [
  {
    path: '',
    component: BlogOverviewContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogOverviewRoutingModule {}
