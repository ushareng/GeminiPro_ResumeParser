import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  { path: '', redirectTo: 'upload', pathMatch: 'full' },  
  { path: 'upload', component: UploadComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
