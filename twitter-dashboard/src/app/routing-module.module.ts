import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import {TwitterDashboardComponent} from './twitter-dashboard/twitter-dashboard.component';
import {InstructionComponent} from './instruction/instruction.component';


const routes: Routes = [
  { path: '', component: InstructionComponent },
  { path: 'collection/:topic', component: TwitterDashboardComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
