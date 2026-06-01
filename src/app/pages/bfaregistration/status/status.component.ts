import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BfaregistrationService } from '../../../core/services/bfaregistration.service';
import { StorageService } from '../../../core/storage.service';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  statusForm!: FormGroup;
  submitted = false;
  subFormdisable = true;
  subbuttonDisable=true;
  message = '';
  errClass = 'text-danger';

  statusOptions = [
    { id: 1, label: 'Pending' },
    { id: 2, label: 'Payment Pending' },
    { id: 3, label: 'Approved' }
  ];

  // ✅ State variables
  status = 0;
  stepsNumber = 0;
  phone = '';
  pan = '';

  constructor(
    private fb: FormBuilder,
    private bfaregistrationService: BfaregistrationService,
    private storageService: StorageService, // ✅ FIXED
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initStatusForm();
    this.loadFromStorage();
  }

  // ✅ Load stored values safely
  private loadFromStorage(): void {
    this.status = Number(this.storageService.get('status')) || 0;
    this.stepsNumber = Number(this.storageService.get('steps')) || 0;
    this.phone = this.storageService.get('userPhone') || '';
    this.pan = this.storageService.get('pan') || '';

    if (this.phone && this.pan) {
      this.subFormdisable = false;
    }

    // Patch form after init
    this.statusForm.patchValue({
      phone: this.phone,
      pan: this.pan
    });
  }

  // ✅ Form initialization
  private initStatusForm(): void {
    this.statusForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
      pan: ['', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]$')]]
    });
  }

  // ✅ Getter for template
  get p() {
    return this.statusForm.controls;
  }

  // ✅ Auto uppercase PAN
  convertToUppercase(controlName: string): void {
    const value = this.statusForm.get(controlName)?.value;
    if (value) {
      this.statusForm.get(controlName)?.setValue(value.toUpperCase(), { emitEvent: false });
    }
  }

  // ✅ Submit handler
  onCheckedStatus(): void {
    this.submitted = true;

    if (this.statusForm.invalid) return;

    const request = {
      phone: this.statusForm.value.phone,
      pan: this.statusForm.value.pan
    };

    this.bfaregistrationService.getDataPhonePAN(request).subscribe({
      next: (response: any) => {

        const data = response?.data || response;

        if (!data) {
          this.showMessage('No data found.', 'text-danger');
          return;
        }

        // ✅ Convert safely
        this.stepsNumber = Number(data.steps) || 0;
        this.status = Number(data.status) || 0;

        // ✅ Save in storage
        this.storageService.set('steps', String(this.stepsNumber));
        this.storageService.set('status', String(this.status));
        this.storageService.set('userPhone', data.mobile || '');
        this.storageService.set('pan', data.pan || '');

        // ✅ Patch form
        this.statusForm.patchValue({
          phone: data.mobile || '',
          pan: data.pan || ''
        });

        this.subFormdisable = false;

        this.showMessage('Status fetched successfully.', 'text-success');

        // ✅ Force UI refresh
        this.cdr.detectChanges();
      },
      error: () => {
        this.showMessage('Error fetching BFA info.', 'text-danger');
      }
    });
  }

  // ✅ Status label
  getStatusLabel(): string {
    const selected = this.statusOptions.find(s => s.id === this.status);
    return selected ? selected.label : 'Unknown';
  }

  // ✅ Common message handler
  private showMessage(msg: string, css: string): void {
    this.message = msg;
    this.errClass = css;
  }
}
