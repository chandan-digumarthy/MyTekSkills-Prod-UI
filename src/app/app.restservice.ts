import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class RestService {

  private single_association_endpoint: string = "/hier-barchart";


  baseUrl : string;
  hierBarchart : string = "/hier-barchart";
  forceDirected : string = "/force-directed";
  connectivityStats: string = "/connectivity-stats";
  downloadSpeed = "/download-speed";

  constructor(private http:HttpClient, private router: Router) {
    var hostname = window.location.hostname;
    var portnum = 443;
    var protocol = "https:";//window.location.protocol;

    this.baseUrl = protocol+"//"+hostname+":"+portnum;
  }

  getHierBarchartData(): Observable<any> {
    return this.http.get<any>(this.baseUrl+this.hierBarchart)
    .pipe(
        retry(1), catchError(this.errorHandl)
      )
  }

  getForceDirectedData(): Observable<any> {
    return this.http.get<any>(this.baseUrl+this.forceDirected)
    .pipe(
        retry(1), catchError(this.errorHandl)
      )
  }
  
  getConnectivityStatsData(): Observable<any> {
    return this.http.get<any>(this.baseUrl+this.connectivityStats)
    .pipe(
        retry(1), catchError(this.errorHandl)
      )
  }

  getDownloadSpeedData(): Observable<any> {
    return this.http.get<any>(this.baseUrl+this.downloadSpeed)
    .pipe(
        retry(1), catchError(this.errorHandl)
      )
  }

  getMatchingEntities(body): Observable<any> {

      let headers = { 'Content-Type': 'application/json' }
      
      const url = this.baseUrl;

      return this.http.post(url, body, { headers }).pipe(
        retry(1), catchError(this.errorHandl)
        );
        
  }

  // Error handling
  errorHandl(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(errorMessage);
 }

}