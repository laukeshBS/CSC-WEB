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

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent

  implements OnInit {
  loading: boolean | undefined;
  // Message
  message: string = '';

  errClass: string = '';

  // Storage Data
  phone: string = '';

  stepsNumber: any = '';

  status: any = '';

  activeTab: string = '4';

  // Forms
  panForm!: FormGroup;

  personalDetailsForm!: FormGroup;

  // Preview Data
  panData: any = {};

  personalData: any = {};

  // Upload URL
  apiPanUrl: string =
    environment.apiPanUrl;

  fileURL: string =
    `${this.apiPanUrl}/uploads/bfaPan/`;

  constructor(
    private fb: FormBuilder,
    private bfaregistrationService: BfaregistrationService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Get User Data
    this.phone =
      this.storageService.get('userPhone') || '';

    this.stepsNumber =
      this.storageService.get('steps') || '';

    // Redirect if session missing
    if (
      !this.phone ||
      !this.stepsNumber
    ) {

      this.router.navigate(['/otp']);

      return;

    }

    // Initialize Forms
    this.initForms();

    // Load Preview Data
    this.getBfaInfo();
    

  }

  // =========================================
  // Initialize Forms
  // =========================================
  initForms(): void {

    // PAN Form
    this.panForm = this.fb.group({

      pan: [''],

      name: [''],

      father_name: [''],

      dob: [''],

      phone: ['']

    });


    // Personal Form
    this.personalDetailsForm =
      this.fb.group({

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

  // =========================================
  // Get BFA Information
  // =========================================
  private getBfaInfo(): void {

    if (!this.phone) {

      return;

    }

    const request = {

      phone: this.phone

    };

    this.bfaregistrationService
      .getData(request)
      .subscribe({

        next: (response: any) => {

          const data =
            response?.data;

          if (!data) {

            return;

          }

          // Status & Step
          this.stepsNumber =
            data.steps || 0;

          this.status =
            data.status || '';

          // Save Storage Data
          this.storageService.set(
            'steps',
            String(data.steps)
          );

          this.storageService.set(
            'status',
            String(data.status)
          );

          this.storageService.set(
            'name',
            String(data.name)
          );

          this.storageService.set(
            'user_id',
            String(data.user_id)
          );

          this.storageService.set(
            'email',
            String(data.email_id)
          );

          // PAN Form Data
          this.panForm.patchValue({

            pan:
              data.pan || '',

            name:
              data.name || '',

            father_name:
              data.father_name || '',

            dob:
              data.dob || '',

            phone:
              data.mobile || ''

          });

          // Personal Details Data
          this.personalDetailsForm
            .patchValue({

              account_no:
                data.account_no || '',

              confirm_account_no:
                data.account_no || '',

              account_type:
                data.account_type || '',

              alternate_mobile:
                data.alternate_mobile || '',

              bank_branch:
                data.bank_branch || '',

              bank_name:
                data.bank_name || '',

              complete_address:
                data.complete_address || '',

              district_code:
                data.district_code || '',

              district_name:
                data.district_name || '',

              email_id:
                data.email_id || '',

              gender:
                data.gender || '',

              terms:
                data.terms || '',

              gst_no:
                data.gst_no || '',

              gst_file:
                data.gst_file || '',

              profession_doc:
                data.profession_doc || '',

              gst_registered:
                data.gst_registered || '',

              higher_education:
                data.higher_education || '',

              other_education:
                data.other_education || '',

              ifsc_code:
                data.ifsc_code || '',

              latitude:
                data.latitude || '',

              longitude:
                data.longitude || '',

              mobile:
                data.mobile || '',

              name:
                data.name || '',

              pan:
                data.pan || '',

              pincode:
                data.pincode || '',

              profession:
                data.profession || '',

              ref_cscid:
                data.ref_cscid || '',

              ref_mobile:
                data.ref_mobile || '',

              ref_name:
                data.ref_name || '',

              state_code:
                data.state_code || '',

              state_name:
                data.state_name || ''

            });

          // Store Preview Data
          this.panData =
            this.panForm.value;

          this.personalData =
            this.personalDetailsForm.value;

          // Active Tab
          if (this.stepsNumber > 1) {

            this.activeTab = '4';

          }

        },

        error: (error: any) => {

          console.error(
            'API Error:',
            error
          );

          this.message =
            'Error fetching BFA information.';

          this.errClass =
            'text-danger';

        }

      });

  }

  // =========================================
  // Final Submit
  // =========================================
  finalSubmit(): void {

    const finalData = {

      ...this.panData,

      ...this.personalData

    };

    console.log(
      'Final Submit Data:',
      finalData
    );

    // Success Message
    this.message =
      'Redirecting to Payment Gateway...';

    this.errClass =
      'text-success';
this.loading = true;
    // Redirect to Payment Pagesss
  // setTimeout(() => {

      this.router.navigate(['/payment']);

   // }, 1000);

  }

}
