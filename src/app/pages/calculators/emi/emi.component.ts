
import { Component, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import Chart from 'chart.js/auto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-emi',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './emi.component.html',
  styleUrl: './emi.component.css'
})
export class EmiComponent implements OnInit, AfterViewInit {

  loanAmount: number = 50000;
  interestRate: number = 1;
  loanTenure: number = 1;

  formattedEMI: string = '';
  formattedInterest: string = '';
  formattedPayment: string = '';

  private chart: Chart | undefined;
  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.calculateEMI();
  }
ngAfterViewInit(): void {
  this.calculateEMI();
  this.cdr.detectChanges(); // ✅ Forces Angular to re-check the view
}


  allowOnlyNumbers(event: KeyboardEvent): void {
    const key = event.key;
    if (!/^\d$/.test(key)) event.preventDefault();
  }

  formatCurrency(amount: number): string {
    return `₹ ${amount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;
  }

  onInputChange(): void {
    this.calculateEMI();
  }

  calculateEMI(): void {
    const P = this.loanAmount;
    const r = this.interestRate / 12 / 100;
    const n = this.loanTenure * 12;

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    this.formattedEMI = this.formatCurrency(Math.round(emi));
    this.formattedInterest = this.formatCurrency(Math.round(totalInterest));
    this.formattedPayment = this.formatCurrency(Math.round(totalPayment));

    this.updateChart(P, totalInterest);
  }

  updateChart(principal: number, interest: number): void {
    if (this.chart) this.chart.destroy();

    const ctx = document.getElementById('emiChart') as HTMLCanvasElement;

    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Principal', 'Interest'],
        datasets: [{
          data: [principal, interest],
          backgroundColor: ['#4e73df', '#e74a3b']
        }]
      },
      options: {
        cutout: '70%',
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
  }
}
