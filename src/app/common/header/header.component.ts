import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  lastUrl: string = ''; // Stores the last navigation URL
  previousUrl: string = ''; // Stores the previous navigation URL

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const navEnd = event as NavigationEnd;

      this.previousUrl = this.lastUrl;
      this.lastUrl = navEnd.urlAfterRedirects;

      if (this.previousUrl === '/emi') {

        localStorage.setItem('scrollToId', '');

        this.router.navigate(['/about-us']).then(() => {
          window.location.reload();  // Reload after navigation
        });
      }
    });
  }

  ngAfterViewInit(): void {
    // After page reload, scroll to stored element if available
    const id = localStorage.getItem('scrollToId');
    if (id) {
      localStorage.removeItem('scrollToId'); // Clean up
      setTimeout(() => this.scrollTo(id), 300); // Give DOM time to load
    }
  }

  scrollTo(id: string): void {
    const element = document.getElementById(id);

    if (element) {
      this.scrollToElement(element);
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const target = document.getElementById(id);
          if (target) {
            this.scrollToElement(target);
          }
        }, 100);
      });
    }
  }

  private scrollToElement(element: HTMLElement): void {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }




}
