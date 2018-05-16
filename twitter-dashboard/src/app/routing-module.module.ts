import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import {TwitterDashboardComponent} from './twitter-dashboard/twitter-dashboard.component';


const routes: Routes = [
  { path: '', redirectTo: '/collection/cloud', pathMatch: 'full' },
  { path: 'collection/:topic', component: TwitterDashboardComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
