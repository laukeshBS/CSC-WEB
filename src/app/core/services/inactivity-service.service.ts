import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private timeout: any;
  private readonly INACTIVE_TIME = 5 * 60 * 1000; // 30 minutes

  constructor(private ngZone: NgZone) {
    this.initListener();
    this.resetTimer();
  }

  private initListener() {
    window.addEventListener('mousemove', () => this.resetTimer());
    window.addEventListener('keydown', () => this.resetTimer());
    window.addEventListener('click', () => this.resetTimer());
    window.addEventListener('scroll', () => this.resetTimer());
  }

  private resetTimer() {
    clearTimeout(this.timeout);

    this.ngZone.runOutsideAngular(() => {
      this.timeout = setTimeout(() => {
        this.handleLogout();
      }, this.INACTIVE_TIME);
    });
  }

  private handleLogout() {
    console.log('User inactive for 5 minutes');

    localStorage.clear();   // clear storage
    sessionStorage.clear(); // optional

    location.reload(); // reload page
  }
}
