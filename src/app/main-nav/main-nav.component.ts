import { Component, Inject } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HomeComponent } from '../home/home.component';
import {Router} from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css'],
})
export class MainNavComponent {
      
    constructor(private router: Router) {
    }

    gotoGithub(){
      window.open(
        'https://github.com/chandan-digumarthy',
        '_blank'
      );
    }

    gotoLinkedin(){
      window.open(
        'https://www.linkedin.com/in/chandan-digumarthy-74b1b3100',
        '_blank'
      );
    }
    
  }