import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreazioneArticoloComponent } from './components/creazione-articolo/creazione-articolo.component';

const routes: Routes = [
  { path: '', component:  CreazioneArticoloComponent},
  { path: '**', component: CreazioneArticoloComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
