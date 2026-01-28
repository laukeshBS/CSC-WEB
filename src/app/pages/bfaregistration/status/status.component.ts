import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  statusOptions: { id: number, label: string }[] = [];
  status: number  = +(localStorage.getItem('status') || 0);
 constructor(
     private router: Router
   ) {}

  ngOnInit(): void {
  if (
      this.status === null ||
      this.status === undefined ||
      this.status === 0 ||
      isNaN(Number(this.status)) ||
      Number(this.status) <= 0
    ) {
      this.router.navigate(['/bfaregistration']);
      return;
    }


    this.statusOptions = [
      { id: 1, label: 'Pending' },
      { id: 2, label: 'Payment Pending' },
      { id: 3, label: 'Completed' }
    ];

    // If status not set dynamically, set default to first option
    if (!this.status) {
      this.status = this.statusOptions[0].id;
    }
  }

  getStatusLabel(): string {
    const selected = this.statusOptions.find(s => s.id === this.status);
    return selected ? selected.label : 'Unknown';
  }
}
