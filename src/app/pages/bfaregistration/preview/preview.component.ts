import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

import { BfaregistrationService } from '../../../core/services/bfaregistration.service';
import { StorageService } from '../../../core/storage.service';
import { CryptoService } from '../../../core/services/crypto.service';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  loading = false;

  message = '';
  errClass = '';

  token = localStorage.getItem('otpToken') || '';

  phone = '';
  pan = '';

  stepsNumber = 0;
  status = 0;

  activeTab = '4';

  panForm!: FormGroup;
  personalDetailsForm!: FormGroup;

  panData: any = {};
  personalData: any = {};

  apiPanUrl = environment.apiPanUrl;
  fileURL = `${this.apiPanUrl}/uploads/bfaPan/`;

  constructor(
    private fb: FormBuilder,
    private bfaService: BfaregistrationService,
    private storage: StorageService,
    private crypto: CryptoService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.phone = this.storage.get('userPhone') || '';
    this.stepsNumber = Number(this.storage.get('steps') || 0);

    if (!this.phone) {
      this.router.navigate(['/otp']);
      return;
    }

    this.initializeForms();

    this.loadPreview();

  }

  /**
   * Initialize Forms
   */
  private initializeForms(): void {

    this.panForm = this.fb.group({
      pan: [''],
      name: [''],
      father_name: [''],
      dob: [''],
      phone: ['']
    });

    this.personalDetailsForm = this.fb.group({

      account_no: [''],
      confirm_account_no: [''],
      account_type: [''],
      alternate_mobile: [''],
      bank_branch: [''],
      bank_name: [''],
      complete_address: [''],
      district_code: [''],
      district_name: [''],
      email_id: [''],
      gender: [''],
      terms: [''],
      gst_no: [''],
      gst_file: [''],
      profession_doc: [''],
      cancelled_cheque: [''],
      gst_registered: [''],
      higher_education: [''],
      other_education: [''],
      ifsc_code: [''],
      latitude: [''],
      longitude: [''],
      mobile: [''],
      name: [''],
      pan: [''],
      pincode: [''],
      profession: [''],
      ref_cscid: [''],
      ref_mobile: [''],
      ref_name: [''],
      state_code: [''],
      state_name: ['']

    });

  }

  /**
   * Load Preview Data
   */
  private loadPreview(): void {

    this.loading = true;

    const payload = this.crypto.encrypt({
      phone: this.phone,
      token: this.token
    });

    this.bfaService.getData(payload).subscribe({

      next: (response: any) => {

        this.loading = false;

        const data = this.crypto.decrypt(response.data);

        if (!data) {
          return;
        }

        this.pan = data.pan;
        this.stepsNumber = Number(data.steps);
        this.status = Number(data.status);

        this.saveStorage(data);

        this.panForm.patchValue({
          pan: data.pan,
          name: data.name,
          father_name: data.father_name,
          dob: data.dob,
          phone: data.mobile
        });

        this.personalDetailsForm.patchValue(data);

        this.panData = this.panForm.getRawValue();
        this.personalData = this.personalDetailsForm.getRawValue();

        this.activeTab = this.stepsNumber > 1 ? '4' : '1';

      },

      error: () => {

        this.loading = false;

        this.message = 'Unable to fetch BFA details.';
        this.errClass = 'text-danger';

      }

    });

  }

  /**
   * Save Required Data
   */
  private saveStorage(data: any): void {

    const storageData = {
      steps: data.steps,
      status: data.status,
      name: data.name,
      user_id: data.user_id,
      email: data.email_id
    };

    Object.entries(storageData).forEach(([key, value]) => {
      this.storage.set(key, String(value ?? ''));
    });

  }

  /**
   * Final Submit
   */
  finalSubmit(): void {

    this.loading = true;

    const payload = this.crypto.encrypt({
      phone: this.phone,
      pan: this.pan,
      token: this.token
    });

    this.bfaService.getWhitelistUser(payload).subscribe({

      next: (response: any) => {

        this.loading = false;

        const result = this.crypto.decrypt(response.data);


        this.message = result.res_msg;
        this.errClass = 'text-success';
///console.log('Whitelist User Result:', result);
        if (response.status==true) {

          this.storage.set('steps', '4');
          this.storage.set('status', '2');
          

          this.router.navigate(['/status']);

        } else {

          this.router.navigate(['/payment']);

        }

      },

      error: () => {

        this.loading = false;

        this.message = 'Something went wrong. Please try again.';
        this.errClass = 'text-danger';

      }

    });

  }

}