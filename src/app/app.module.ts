import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatMenu, MatToolbarModule, MatSidenavModule, MatIconModule, 
         MatListModule, MatCardModule, MatGridListModule, MatTooltipModule, MatSnackBarModule, MatTabsModule, MatFormFieldModule, MatInputModule, MatProgressBarModule } from '@angular/material';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { ForceDisjointComponent } from './force-disjoint/force-disjoint.component';
import { HierBarchartComponent } from './hier-barchart/hier-barchart.component';
import { RestService } from './app.restservice';
import { LiveHealthComponent } from './live-health/live-health.component';
import { TekStackComponent } from './tek-stack/tek-stack.component';
import { ConceptsUsedComponent } from './concepts-used/concepts-used.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'tek-stack', component: TekStackComponent},
  {path: 'concepts-used', component: ConceptsUsedComponent},
  {path: 'force-disjoint', component: ForceDisjointComponent},
  {path: 'hier-bar-chart', component: HierBarchartComponent},
  {path: 'live-health', component: LiveHealthComponent},
  {path: '**', redirectTo: 'home', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    HomeComponent,
    ForceDisjointComponent,
    HierBarchartComponent,
    LiveHealthComponent,
    TekStackComponent,
    ConceptsUsedComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatGridListModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTabsModule,
    FormsModule,     MatFormFieldModule, MatInputModule, ReactiveFormsModule, 
    HttpClientModule, MatDialogModule, MatProgressBarModule
  ],
  exports:[
    MatDialogModule
  ],
  providers: [  HomeComponent, MatDialogModule, RestService],
  bootstrap: [AppComponent],
  entryComponents: [
    HomeComponent
  ]
})
export class AppModule { }
