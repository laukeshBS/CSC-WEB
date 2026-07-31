import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AbstractControl, FormBuilder, FormGroup,
  FormsModule, ReactiveFormsModule, ValidationErrors, Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { BfaregistrationService } from '../../core/services/bfaregistration.service';
import { StorageService } from '../../core/storage.service';
import { environment } from '../../environments/environment';
import { CryptoService } from '../../core/services/crypto.service';

@Component({
  selector: 'app-bfaregistration',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './bfaregistration.component.html',
  styleUrls: ['./bfaregistration.component.css']
})
export class BfaregistrationComponent implements OnInit, OnDestroy {

  // =========================================================
  // ✅ PROPERTIES
  // =========================================================
  readonly fileBaseURL = `${environment.apiPanUrl}/uploads/bfaPan/`;

  panForm!: FormGroup;
  personalDetailsForm!: FormGroup;

  activeTab   = '2';
  loading     = false;
  submitted   = false;

  message       = '';
  messagePro    = '';
  messageFile   = '';
  errClass      = 'text-danger';
  ifscError     = '';
  confirm_accountError = '';

  uploadedFiles: Record<string, string>  = {};
  fileErrors:    Record<string, string>  = {};
  fileLoading:   Record<string, boolean> = {};

  stateList:    any[] = [];
  districtList: any[] = [];

  phone        = this.storageService.get('userPhone');
  token        = localStorage.getItem('otpToken');
  stepsNumber  = Number(this.storageService.get('steps')) || 0;
  status       = Number(this.storageService.get('status')) || 0;
  payment_status = '';

  maxDate              = '';
  showProfessionalWork = false;
  inputType             = 'file';
  pan                   = '';

  // ✅ Flags that track if IFSC / Account verification actually succeeded.
  //    Submission is BLOCKED unless both are true.
  private bankVerified = false;

  private destroy$ = new Subject<void>();

  private readonly ALLOWED_FILE_TYPES = [
    'image/png', 'image/jpeg', 'image/jpg', 'image/webp',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  private readonly MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
bankList: any;
bankList: any;
bank_list: any;
bank_list: any;
bankVerified: boolean;

  constructor(
    private fb: FormBuilder,
    private bfaregistrationService: BfaregistrationService,
    private storageService: StorageService,private cryptoService: CryptoService,
    private router: Router,
  ) {}

  // =========================================================
  // ✅ LIFECYCLE
  // =========================================================
  ngOnInit(): void {
    this.maxDate = this._getMaxDateFor18YearsOld();
    this._initPanForm();
    this._initPersonalDetailsForm();
    this._checkAuth();
    this.getStates();
    this.getBfaInfo();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================================================
  // ✅ AUTH / REDIRECT CHECK
  // =========================================================
  private _checkAuth(): void {
    if (!this.phone || !this.stepsNumber) {
      this.router.navigate(['/otp']);
      return;
    }
   if (this.payment_status === 'PAID' && this.status ==3) {
      this.router.navigate(['/auth/login']);
      return;
    }
    if (this.payment_status === 'PAID' || this.stepsNumber > 3) {
      this.router.navigate(['/status']);
      return;
    }
   

    if (this.stepsNumber > 1) {
      this.openTab('3');
    }
  }

  openTab(tabName: string): void {
    this.activeTab = tabName;
  }

  // =========================================================
  // ✅ CUSTOM VALIDATORS
  // =========================================================
  private _latitudeValidator(control: AbstractControl): ValidationErrors | null {
    const value = parseFloat(control.value);
    if (isNaN(value)) return null;
    return value < -90 || value > 90 ? { outOfRange: true } : null;
  }

  private _longitudeValidator(control: AbstractControl): ValidationErrors | null {
    const value = parseFloat(control.value);
    if (isNaN(value)) return null;
    return value < -180 || value > 180 ? { outOfRange: true } : null;
  }

  // ✅ Cross-field validator: confirm_account_no must equal account_no
  private _accountMatchValidator = (group: AbstractControl): ValidationErrors | null => {
    const acc     = group.get('account_no')?.value?.trim();
    const confirm = group.get('confirm_account_no')?.value?.trim();
    if (!acc || !confirm) return null;
    return acc === confirm ? null : { accountMismatch: true };
  };

  // =========================================================
  // ✅ FORM GETTERS
  // =========================================================
  get p()  { return this.panForm.controls; }
  get pd() { return this.personalDetailsForm.controls; }
  get latitude()  { return this.personalDetailsForm.get('latitude'); }
  get longitude() { return this.personalDetailsForm.get('longitude'); }

  // =========================================================
  // ✅ INIT PAN FORM
  // =========================================================
  private _initPanForm(): void {
    this.panForm = this.fb.group({
      pan:         ['', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]$')]],
      name:        ['', Validators.required],
      father_name: ['', Validators.required],
      dob:         ['', Validators.required],
      phone:       ['']
    });
  }

  // =========================================================
  // ✅ INIT PERSONAL DETAILS FORM
  // =========================================================
  private _initPersonalDetailsForm(): void {
    this.personalDetailsForm = this.fb.group({
      profession:             ['', Validators.required],
      other_profational_work: [''],
      email_id:               ['', [Validators.required, Validators.email]],
      alternate_mobile:       ['', [Validators.pattern('^[0-9]{10}$')]],
      higher_education:       ['', Validators.required],
      other_education:        [''],
      gender:                 ['', Validators.required],
      state_name:             ['', Validators.required],
      state_code:             ['', Validators.required],
      state_short:            [''],
      district_name:          ['', Validators.required],
      district_code:          ['', Validators.required],
      complete_address:       ['', Validators.required],
      pincode:                ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      latitude:               ['', [Validators.required, Validators.pattern(/^[-]?\d+(\.\d{1,10})?$/), this._latitudeValidator]],
      longitude:              ['', [Validators.required, Validators.pattern(/^[-]?\d+(\.\d{1,10})?$/), this._longitudeValidator]],
      gst_registered:         ['', Validators.required],
      gst_no:                 ['', [Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)]],
      gst_file:                [''],
      gst_file_name:           [''],
      account_type:            ['', Validators.required],
      bank_name:               ['', Validators.required],
      bank_branch:             ['', Validators.required],
      // ✅ IFSC required + must match format. Disabled until API verifies it (see ifscValidation()).
      ifsc_code:               ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      account_no:              ['', [Validators.required, Validators.pattern('^[0-9]{9,18}$')]],
      confirm_account_no:      ['', Validators.required],
      ref_cscid:                [''],
      ref_name:                 [''],
      ref_mobile:               [''],
      phone:                    [''],
      profession_doc:           [''],
      profession_doc_name:      [''],
      terms:                    ['', Validators.required],
    }, { validators: this._accountMatchValidator });

    this._setupFormWatchers();
  }

  // =========================================================
  // ✅ FORM WATCHERS
  // =========================================================
  private _setupFormWatchers(): void {

    this.personalDetailsForm.get('higher_education')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        const ctrl = this.personalDetailsForm.get('other_education');
        if (value === 'Other') {
          ctrl?.setValidators([Validators.required]);
        } else {
          ctrl?.clearValidators();
          ctrl?.setValue('');
        }
        ctrl?.updateValueAndValidity();
      });

    this.personalDetailsForm.get('gst_registered')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        const gstNo       = this.personalDetailsForm.get('gst_no');
        const gstFile     = this.personalDetailsForm.get('gst_file');
        const gstFileName = this.personalDetailsForm.get('gst_file_name');

        if (value === 'Yes') {
          gstNo?.setValidators([Validators.required, Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)]);
          if (!gstFileName?.value) {
            gstFile?.setValidators([Validators.required]);
          }
        } else {
          gstNo?.clearValidators();
          gstFile?.clearValidators();
        }

        gstNo?.updateValueAndValidity();
        gstFile?.updateValueAndValidity();
      });

    this.personalDetailsForm.get('ref_cscid')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        const refName   = this.personalDetailsForm.get('ref_name');
        const refMobile = this.personalDetailsForm.get('ref_mobile');

        if (value?.trim()) {
          refName?.setValidators([Validators.required]);
          refMobile?.setValidators([Validators.required]);
        } else {
          refName?.clearValidators();
          refMobile?.clearValidators();
        }

        refName?.updateValueAndValidity();
        refMobile?.updateValueAndValidity();
      });

    // ✅ Any time IFSC or account_no changes, bank verification must be redone
    ['ifsc_code', 'account_no', 'confirm_account_no'].forEach(field => {
      this.personalDetailsForm.get(field)?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.bankVerified = false;
         // this.personalDetailsForm.patchValue({ bank_name: '', bank_branch: '' }, { emitEvent: false });
        });
    });
  }

  // =========================================================
  // ✅ MAX DATE (18 years old)
  // =========================================================
  private _getMaxDateFor18YearsOld(): string {
    const today = new Date();
    const yyyy  = today.getFullYear() - 18;
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const dd    = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // =========================================================
  // ✅ GET STATES
  // =========================================================
  getStates(): void {
    this.loading = true;
    this.bfaregistrationService.getStates({token:this.token})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading   = false;
          this.stateList = this.cryptoService.decrypt(response?.data) || [];
        },
        error: () => {
          this.loading  = false;
          this.message  = 'Error loading state list.';
          this.errClass = 'text-danger';
        }
      });
  }

  onStateSelect(event: Event): void {
    const code  = (event.target as HTMLSelectElement).value;
    const state = this.stateList.find(s => s.f_state_code === code);

    if (state) {
      this.personalDetailsForm.patchValue({
        state_code:  state.f_state_code,
        state_name:  state.state_name,
        state_short: state.state_short
      });
      this.getDistrict(state.f_state_code, this.token);
    }
  }

  getDistrict(stateCode: string, token: any): void {
    if (!stateCode) return;

    this.loading = true;
    this.bfaregistrationService.getDistrict( this.cryptoService.encrypt({ state: stateCode ,token:token}))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading      = false;
          this.districtList = this.cryptoService.decrypt(response?.data) || [];
        },
        error: () => {
          this.loading  = false;
          this.message  = 'Error loading district list.';
          this.errClass = 'text-danger';
        }
      });
  }

  onDistrictSelect(event: Event): void {
    const code     = (event.target as HTMLSelectElement).value;
    const district = this.districtList.find(d => d.f_district_code === code);

    if (this.cryptoService.decrypt(district)) {
      this.personalDetailsForm.patchValue({
        district_code: district.f_district_code,
        district_name: district.district_name
      });
    }
  }

  // =========================================================
  // ✅ PROFILE STATUS (REF CSC ID)
  // =========================================================
  profileStatus(event: Event): void {
    const cscId = (event.target as HTMLSelectElement).value;

    if (cscId.length < 12) {
      this.messagePro = '';
      this.personalDetailsForm.patchValue({ ref_name: '', ref_mobile: '' });
      return;
    }

    this.loading = true;
    // pass the object directly to match the expected parameter type
    this.bfaregistrationService.profileStatus(this.cryptoService.encrypt({ csc_id: cscId, token: this.token }))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.loading = false;

          if (res?.status && res?.data) {
            res.data = this.cryptoService.decrypt(res.data);
            if (res.data.vle_name) {
              this.messagePro = res.data.res_msg;
              this.errClass   = 'text-success';
              this.personalDetailsForm.patchValue({
                ref_name:   res.data.vle_name,
                ref_mobile: res.data.mobile
              });
            }

            if (res.data.res_code === '705') {
              this.messagePro = res.data.res_msg;
              this.errClass   = 'text-danger';
            }
          }
        },
        error: () => {
          this.loading    = false;
          this.messagePro = 'Something went wrong. Please try again.';
          this.errClass   = 'text-danger';
        }
      });
  }

  // =========================================================
  // ✅ PAN FORM SUBMIT
  // =========================================================
  onVerify(): void {
    this.submitted = true;
    this.message   = '';

    // ✅ BLOCK submit on validation failure — nothing saved
    if (this.panForm.invalid) {
      this.panForm.markAllAsTouched();
      this.message  = 'Please fill all required fields correctly.';
      this.errClass = 'text-danger';
      return;
    }

    this.loading = true;

    const request = { ...this.panForm.value, phone: this.phone, token: this.token };

    this.bfaregistrationService.updatePost( this.cryptoService.encrypt(request))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.loading   = false;
          this.submitted = false;

          if (res.status === true) {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'PAN verified successfully!',
              confirmButtonText: 'OK'
            }).then(result => {
              if (result.isConfirmed) {
                this.stepsNumber = 2;
                this.openTab('3');
              }
            });
          } else {
            // ❌ Backend validation failed — do NOT proceed, show reason
            Swal.fire({
              icon: 'error',
              title: 'Validation Error!',
              text: res.message || 'Something went wrong.',
              confirmButtonText: 'OK'
            });
          }
        },
        error: () => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Server Error!',
            text: 'Failed to connect to server. Please try again later.',
            confirmButtonText: 'OK'
          });
        }
      });
  }

  // =========================================================
  // ✅ PERSONAL DETAILS SUBMIT
  // =========================================================
  onPersonalDetailsSubmit(): void {
    this.submitted  = true;
    this.message    = '';
    this.messagePro = '';
console.log(this.personalDetailsForm.value);
    // ✅ 1. Angular-level validation (required fields, patterns, account match)
    if (this.personalDetailsForm.invalid) {
      this.personalDetailsForm.markAllAsTouched();

      if (this.personalDetailsForm.hasError('accountMismatch')) {
        this.confirm_accountError = 'Account numbers do not match.';
      }

      this.message  = 'Please fill all required fields correctly.';
      this.errClass = 'text-danger';
      return; // 🚫 STOP — nothing is sent to the server
    }

    // ✅ 2. Business-level validation — bank account must have been verified via API
    if (!this.bankVerified) {
      this.ifscError = this.ifscError || 'Please verify your bank account before submitting.';
      this.message   = 'Please verify your IFSC / account number before submitting.';
      this.errClass  = 'text-danger';
      return; // 🚫 STOP — nothing is sent to the server
    }

    this.loading = true;
    const formVal = this.personalDetailsForm.value;
    const request = {
      ...formVal,
      stepsNumber:    this.stepsNumber,
      phone:          this.phone,
      token:          this.token,
      profession:     formVal.profession || formVal.other_profational_work,
      gst_file:       formVal.gst_file_name,
      profession_doc: formVal.profession_doc_name,
    };
//console.log(request);
    this.bfaregistrationService.updatePost(this.cryptoService.encrypt(request))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.loading   = false;
          this.submitted = false;

          // ✅ Only navigate / treat as saved if backend explicitly confirms
          if (res.status === true) {
            this.message  = 'Personal details submitted successfully!';
            this.errClass = 'text-success';
            this.router.navigate(['/preview']);
          } else {
            // ❌ Backend rejected the data — show exact reason, stay on page
            this.message  = res.message || 'Please fill all required fields.';
            this.errClass = 'text-danger';
          }
        },
        error: (err) => {
          // ❌ Network / server error — nothing was saved
          this.loading  = false;
          this.message  = err?.error?.message || 'Error submitting details. Please try again.';
          this.errClass = 'text-danger';
        }
      });
  }

  // =========================================================
  // ✅ FETCH BFA INFO
  // =========================================================
  getBfaInfo(): void {
    if (!this.phone) return;
    const rest = { phone: this.phone, token: this.token };
      this.bfaregistrationService.getData(this.cryptoService.encrypt(rest))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          //console.log(response?.data);
          const data = this.cryptoService.decrypt(response?.data);
          if (!data) return;

          this.payment_status = data.payment_status || '';
          this.stepsNumber    = data.steps  || 0;
          this.status         = data.status || 0;

          this.storageService.set('steps',  String(data.steps));
          this.storageService.set('status', String(data.status));
          this.storageService.set('pan',    String(data.pan || ''));

          // ✅ Re-check redirect rules now that fresh data has arrived
          if (this.payment_status === 'PAID' || this.stepsNumber > 3) {
            this.router.navigate(['/status']);
            return;
          }

          if (this.stepsNumber > 1) {
            this.openTab('3');
          }
  
          this.panForm.patchValue({
            pan:         data.pan         || '',
            name:        data.name        || '',
            father_name: data.father_name || '',
            dob:         data.dob         || '',
            phone:       data.mobile      || ''
          });

          ['pan', 'name', 'father_name', 'dob'].forEach(field => {
            if (data[field]) this.panForm.get(field)?.disable();
          });
          if (data.mobile) this.panForm.get('phone')?.disable();

          // ✅ If account/IFSC were already saved & verified previously, treat as verified
          if (data.account_no && data.ifsc_code && data.bank_name) {
            this.bankVerified = true;
          }

          this.personalDetailsForm.patchValue({
            account_no:          data.account_no       || '',
            confirm_account_no:  data.account_no       || '',
            account_type:        data.account_type     || '',
            alternate_mobile:    data.alternate_mobile || '',
            bank_branch:         data.bank_branch      || '',
            bank_name:           data.bank_name        || '',
            complete_address:    data.complete_address || '',
            district_code:       data.district_code    || '',
            district_name:       data.district_name    || '',
            dob:                 data.dob              || '',
            email_id:            data.email_id         || '',
            father_name:         data.father_name      || '',
            gender:              data.gender           || '',
            gst_no:              data.gst_no           || '',
            gst_registered:      data.gst_registered   || '',
            higher_education:    data.higher_education || '',
            other_education:     data.other_education  || '',
            ifsc_code:           data.ifsc_code        || '',
            latitude:            data.latitude         || '',
            longitude:           data.longitude        || '',
            name:                data.name             || '',
            pan:                 data.pan              || '',
            pincode:             data.pincode          || '',
            profession:          data.profession       || '',
            profession_doc_name: data.profession_doc   || '',
            ref_cscid:           data.ref_cscid         || '',
            ref_mobile:          data.ref_mobile        || '',
            ref_name:            data.ref_name          || '',
            state_code:          data.state_code        || '',
            state_name:          data.state_name        || '',
            terms:               data.term_conditions   || '',
          });

          if (data.state_code) {
            this.getDistrict(data.state_code, this.token);
          }
        },
        error: () => {
          this.message  = 'Error fetching BFA info.';
          this.errClass = 'text-danger';
        }
      });
  }

  // =========================================================
  // ✅ FILE UPLOAD (generic — used for all fields)
  // =========================================================
  onFileSelected(event: any, fieldName: string): void {
    const file: File = event.target.files[0];

    this.fileErrors[fieldName]  = '';
    this.fileLoading[fieldName] = false;

    if (!file) {
      this.fileErrors[fieldName] = 'Please select a file.';
      return; // 🚫 nothing patched into form
    }

    if (!this.ALLOWED_FILE_TYPES.includes(file.type)) {
      this.fileErrors[fieldName] = 'Only PNG, JPG, WEBP, PDF, and DOC files are allowed.';
      return; // 🚫 invalid file type never sent to API or form
    }

    if (file.size > this.MAX_FILE_SIZE) {
      this.fileErrors[fieldName] = 'File size must be less than 1MB.';
      return; // 🚫 oversized file never sent
    }

    const reader = new FileReader();
    reader.onload = () => {
      const payload = {
        filename: file.name,
        filetype: file.type,
        content:  reader.result as string
      };

      this.fileLoading[fieldName] = true;

      this.bfaregistrationService.uploadFile(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.fileLoading[fieldName] = false;

            // ✅ Only patch the form if the upload actually succeeded
            if (res.status) {
              this.uploadedFiles[fieldName] = res.file_name;
              this.personalDetailsForm.patchValue(
                { [fieldName]: res.file_name },
                { emitEvent: false }
              );
            } else {
              this.fileErrors[fieldName] = res.message || 'Upload failed.';
              // 🚫 form field left empty — required validator will block submit
            }
          },
          error: () => {
            this.fileLoading[fieldName] = false;
            this.fileErrors[fieldName]  = 'Error uploading file. Please try again.';
            // 🚫 form field left empty on network error too
          }
        });
    };

    reader.readAsDataURL(file);
  }

  // =========================================================
  // ✅ CONVERT TO UPPERCASE + GST VERIFY
  // =========================================================
  convertToUppercase(controlName: string): void {
    const panCtrl      = this.panForm.get(controlName);
    const personalCtrl = this.personalDetailsForm.get(controlName);

    if (panCtrl?.value) {
      panCtrl.setValue(panCtrl.value.toUpperCase(), { emitEvent: false });
    }

    if (personalCtrl?.value) {
      personalCtrl.setValue(personalCtrl.value.toUpperCase(), { emitEvent: false });
    }

    if (controlName === 'gst_no' && personalCtrl?.value) {
      const gstNo      = personalCtrl.value.toUpperCase().trim();
      const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

      if (!gstPattern.test(gstNo)) {
        this.messagePro = 'Invalid GST Number format.';
        this.errClass   = 'text-danger';
        // ✅ Mark control invalid so it can't silently pass form validation
        personalCtrl.setErrors({ invalidGst: true });
        return;
      }

      this.loading = true;
      this.bfaregistrationService.gstinStatus(this.cryptoService.encrypt({ gst_no: gstNo, token: this.token}))
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this.loading    = false;
            const success   = !!res?.status;
            this.messagePro = res?.message || (success ? 'GST verified.' : 'Invalid GST Number.');
            this.errClass   = success ? 'text-success' : 'text-danger';

            // ✅ If GST verification fails, mark the control invalid
            if (!success) {
              personalCtrl.setErrors({ gstNotVerified: true });
            }
          },
          error: () => {
            this.loading    = false;
            this.messagePro = 'Something went wrong. Please try again.';
            this.errClass   = 'text-danger';
            personalCtrl.setErrors({ gstNotVerified: true });
          }
        });
    }
  }

  // =========================================================
  // ✅ ACCOUNT MATCH + BANK VERIFICATION
  //    (combined: confirm match locally, then verify with bank API)
  // =========================================================
  accountMatchValidation(event: Event): void {
    const target         = event.target as HTMLInputElement;
    const confirmAccount = target.value?.trim();
    const accountNo      = this.personalDetailsForm.get('account_no')?.value?.trim();
    const ifscCode       = this.personalDetailsForm.get('ifsc_code')?.value?.trim();

    this.confirm_accountError = '';
    this.bankVerified         = false;

    // ✅ Local match check — block immediately if mismatched
    if (!accountNo || accountNo !== confirmAccount) {
      this.confirm_accountError = 'Account numbers do not match.';
      this.personalDetailsForm.get('confirm_account_no')
        ?.setErrors({ accountMismatch: true });
      return; // 🚫 do not call API with mismatched data
    }

    // ✅ Require a valid IFSC before attempting bank verification
    if (!ifscCode || this.ifscError) {
      this.confirm_accountError = 'Please enter a valid IFSC code first.';
      return;
    }

    const request = { ifsc: ifscCode, account_no: confirmAccount, token: this.token };

    this.loading   = true;
    this.submitted = true;

    this.bfaregistrationService.getBankData(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.loading   = false;
          this.submitted = false;

          if (res?.status && res?.data) {
            // ✅ Verified — allow submission, populate bank name/branch
            this.bankVerified = true;
            this.errClass     = 'text-success';
            this.confirm_accountError = '';
          
          } else {
            // ❌ Verification failed — block submission
            this.bankVerified = false;
            this.confirm_accountError = res?.message || 'Bank verification failed.';
            this.personalDetailsForm.get('confirm_account_no')
              ?.setErrors({ bankNotVerified: true });
          }
        },
        error: () => {
          this.loading   = false;
          this.submitted = false;
          this.bankVerified = false;
          this.confirm_accountError = 'Verification failed. Please try again.';
          this.personalDetailsForm.get('confirm_account_no')
            ?.setErrors({ bankNotVerified: true });
        }
      });
  }

  // =========================================================
  // ✅ IFSC FORMAT VALIDATION
  // =========================================================
  ifscValidation(event: Event): void {
    const target   = event.target as HTMLInputElement;
    const ifscCode = (target.value || '').trim().toUpperCase();

    this.ifscError    = '';
    this.bankVerified  = false;
    //this.personalDetailsForm.patchValue({ bank_name: '', bank_branch: '' }, { emitEvent: false });

    if (!ifscCode) {
      this.personalDetailsForm.get('ifsc_code')?.setErrors({ required: true });
      return;
    }

    if (ifscCode.length < 11) {
      this.ifscError = 'IFSC Code must be 11 characters.';
      this.personalDetailsForm.get('ifsc_code')?.setErrors({ invalidIfsc: true });
      return;
    }

    const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscPattern.test(ifscCode)) {
      this.ifscError = 'Invalid IFSC Code format. Example: ICIC0001234';
      this.personalDetailsForm.get('ifsc_code')?.setErrors({ invalidIfsc: true });
      return;
    }

    // ✅ Format valid — clear control error, but bank still needs verification
    //    via accountMatchValidation() before bankVerified becomes true.
    this.personalDetailsForm.get('ifsc_code')?.setErrors(null);
  }

  // =========================================================
  // ✅ GET CURRENT LOCATION
  // =========================================================
  getCurrentLocation(): void {
    if (!navigator.geolocation) {
      this.message  = 'Geolocation is not supported by your browser.';
      this.errClass = 'text-danger';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.personalDetailsForm.patchValue({
          latitude:  position.coords.latitude,
          longitude: position.coords.longitude
        });
        this.sendSMS();
      },
      () => {
        this.message  = 'Unable to fetch location. Please allow location access.';
        this.errClass = 'text-danger';
      }
    );
  }

  // =========================================================
  // ✅ SEND SMS
  // =========================================================
  sendSMS(): void {
    if (!this.phone || this.phone.length !== 10) {
      this.message  = 'Please enter a valid mobile number.';
      this.errClass = 'text-danger';
      return;
    }

    this.bfaregistrationService.sendSMSBFA(this.phone)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.message  = 'SMS sent successfully.';
          this.errClass = 'text-success';
        },
        error: () => {
        //  this.message  = 'Failed to send SMS. Please try again.';
         // this.errClass = 'text-danger';
        }
      });
  }

  // =========================================================
  // ✅ INPUT HELPERS
  // =========================================================
  onlyNumberInput(event: KeyboardEvent): void {
    const allowed = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!allowed.includes(event.key) && !/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  onlyAlphabetsInput(event: KeyboardEvent): void {
    const allowed = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete', ' '];
    if (!allowed.includes(event.key) && !/^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  onWorkQualificationChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.showProfessionalWork = value === 'Other';
    if (!this.showProfessionalWork) {
      this.personalDetailsForm.patchValue({ other_profational_work: '' });
    }
  }
}