import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BfaregistrationService } from '../../core/services/bfaregistration.service';
import { Router,RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';
import { StorageService } from '../../core/storage.service';

@Component({
  selector: 'app-bfaregistration',
  standalone: true,
  imports: [FormsModule,RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './bfaregistration.component.html',
  styleUrls: ['./bfaregistration.component.css']
})
export class BfaregistrationComponent implements OnInit {

  apiPanUrl: string = environment.apiPanUrl;
  fileURL = `${this.apiPanUrl}/uploads/bfaPan/`;
  selectedFile: File | null = null;
  errorMessage = '';
  allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf', 'application/msword'];
  panForm!: FormGroup;
  personalDetailsForm!: FormGroup;
  maxDate!: string;
  submitted = false;
  message = '';
  messagePro='';
  phone: string | null = this.storageService.get('userPhone');
  stepsNumber: any = this.storageService.get('steps');
  pan: any = '';
  activeTab = '2';
  stateList: any[] = [];
  districtList: any[] = [];
  status:any =this.storageService.get('status');
  ifscError: string = '';

  errClass: string = 'text-danger';
  uploadedFileName: string | undefined;
  messageFile: string | undefined;
  loading: boolean | undefined;
  confirm_accountError: string | undefined;
  bank_name: any;
  bank_branch: any;
  messageProf:string | undefined;

  constructor(
    private fb: FormBuilder,
    private bfaregistrationService: BfaregistrationService,private storageService : StorageService,
    private router: Router
  ) {}
  openTab(tabName: any): void {

     this.activeTab = tabName;
  }
  ngOnInit(): void {
   this.getBfaInfo();
    this.maxDate = this.getMaxDateFor18YearsOld();
  if ([2, 3].includes(this.status) || this.stepsNumber > 3) {
    console.log('Redirecting to status page');
    this.router.navigate(['/status']);
  }
//this.termconditionsUrl= this.router.navigate(['/terms_conditions']);
    if (!this.phone || !this.stepsNumber) {
       this.router.navigate(['/otp']);
    }

    if (this.stepsNumber > 1) {
        this.activeTab = '3';
        this.openTab(this.activeTab);
    }
    //console.log(this.stepsNumber);
    this.initPanForm();
    this.initPersonalDetailsForm();
    this.getStates();

  }
 // ✅ Custom Latitude Validator
  latitudeRangeValidator(control: AbstractControl) {
    const value = parseFloat(control.value);
    if (isNaN(value)) return null;
    return value < -90 || value > 90 ? { outOfRange: true } : null;
  }

  // ✅ Custom Longitude Validator
  longitudeRangeValidator(control: AbstractControl) {
    const value = parseFloat(control.value);
    if (isNaN(value)) return null;
    return value < -180 || value > 180 ? { outOfRange: true } : null;
  }



  get latitude() { return this.personalDetailsForm.get('latitude'); }
  get longitude() { return this.personalDetailsForm.get('longitude'); }
  /** ----------------------- FORM INITIALIZATION ---------------------- **/
  private initPanForm(): void {
    this.panForm = this.fb.group({
      pan: ['', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]$')]],
      name: ['', Validators.required],
      father_name: ['', Validators.required],
      dob: ['', Validators.required],
      phone: ['']
    });
  }
 private getMaxDateFor18YearsOld(): string {
  const today = new Date();
  const yyyy = today.getFullYear() - 18; // Subtract 18 years
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
  private initPersonalDetailsForm(): void {
    this.personalDetailsForm = this.fb.group({
      profession: ['', Validators.required],
      email_id: ['', [Validators.required, Validators.email]],
      alternate_mobile: ['', [Validators.pattern('^[0-9]{10}$')]], // not required
      higher_education: ['', Validators.required],
      other_education: [''],
      gender: ['', Validators.required],
      state_name: ['', Validators.required],
      district_name: ['', Validators.required],
      complete_address: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      latitude: ['', [Validators.required, Validators.pattern(/^[-]?\d+(\.\d{1,10})?$/), this.latitudeRangeValidator]],
      longitude: ['', [Validators.required, Validators.pattern(/^[-]?\d+(\.\d{1,10})?$/), this.longitudeRangeValidator]],
      gst_registered: ['', Validators.required],
      gst_no: ['', [ Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)]],
      gst_file: [''],
      account_type: ['', Validators.required],
      bank_name: ['', Validators.required],
      bank_branch: ['', Validators.required],
      account_no: ['', [Validators.required, Validators.pattern('^[0-9]{9,18}$')]],
      ifsc_code: ['', [Validators.required,Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      ref_cscid: [''],
      ref_name: [''],
      state_short: [''],
      state_code: ['', Validators.required],
      district_code: ['', Validators.required],
      ref_mobile: ['', [Validators.pattern('^[0-9]{10}$')]],
      phone: [''],
      profession_doc: [''], // 1MB
      other_profational_work: [''],
      terms: ['', [Validators.required]],
      confirm_account_no:['', [Validators.required]],
      gst_file_name: [''],
      profession_doc_name:['']


    });
 this.personalDetailsForm.get('profession_doc_name')?.valueChanges.subscribe(value => {
      const profession_doc_name = this.personalDetailsForm.get('profession_doc_name');
      if(!profession_doc_name?.value){
         profession_doc_name?.clearValidators();
      }else {
        profession_doc_name?.setValidators([Validators.required]);
      }

      profession_doc_name?.updateValueAndValidity();

 });
 this.personalDetailsForm.get('higher_education')?.valueChanges.subscribe(value => {

  const otherEducation =
    this.personalDetailsForm.get('other_education');

  if (value === 'Other') {

    otherEducation?.setValidators([Validators.required]);

  } else {

    otherEducation?.clearValidators();
    otherEducation?.setValue('');
  }

  otherEducation?.updateValueAndValidity();

});
    // ✅ Dynamically handle GST validation
    this.personalDetailsForm.get('gst_registered')?.valueChanges.subscribe(value => {
      const gstNo = this.personalDetailsForm.get('gst_no');
      const gstFile = this.personalDetailsForm.get('gst_file');
       const gst_file_name = this.personalDetailsForm.get('gst_file_name');
      if(!gst_file_name?.value){
         gstFile?.clearValidators();
      }else
      if (value === 'Yes') {
        gstNo?.setValidators([Validators.required]);
        gstFile?.setValidators([Validators.required]);
      } else {
        gstNo?.clearValidators();
        gstFile?.clearValidators();
      }

      gstNo?.updateValueAndValidity();
      gstFile?.updateValueAndValidity();
    });
    this.personalDetailsForm.get('ref_cscid')?.valueChanges.subscribe((value) => {
  const refName = this.personalDetailsForm.get('ref_name');
  const refMobile = this.personalDetailsForm.get('ref_mobile');

      if (value && value.trim() !== '') {
        // When CSC ID entered → require name and mobile
        refName?.setValidators([Validators.required]);
        refMobile?.setValidators([Validators.required]);
      } else {
        // When CSC ID empty → remove validators
        refName?.clearValidators();
        refMobile?.clearValidators();
      }

      refName?.updateValueAndValidity();
      refMobile?.updateValueAndValidity();
    });
  }

  /** ----------------------- STATE & DISTRICT ---------------------- **/
  getStates(): void {
    this.loading = true;
    this.bfaregistrationService.getStates({}).subscribe({
      next: (response) => {
        this.loading = false;
        this.stateList = response?.data || [];
      },
      error: () => (this.message = 'Error loading state list.', this.errClass='')
    });
  }

  onStateSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedCode = target.value;

    const selectedState = this.stateList.find(s => s.f_state_code === selectedCode);
    if (selectedState) {
      this.personalDetailsForm.patchValue({
        state_code: selectedState.f_state_code,
        state_name: selectedState.state_name,
        state_short: selectedState.state_short
      });
      this.getDistrict(selectedState.f_state_code);

    }
  }

  getDistrict(stateCode: string): void {
    this.loading = true;
    const request = { state: stateCode };
    this.bfaregistrationService.getDistrict(request).subscribe({
      next: (response) => {
        this.loading = false;
        this.districtList = response?.data || [];
      },
      error: () => (this.message = 'Error loading district list.' ,this.errClass='')
    });
  }
 profileStatus(event:Event): void {
    const target = event.target as HTMLSelectElement;
    const data = target.value;
      const request = {csc_id:data};
      if(data.length <= 12){
         this.messageProf = '';
         this.personalDetailsForm.patchValue({
                          ref_name: '',
                          ref_mobile: ''
                        });
      }
    if(data.length >= 12){
          this.loading = true;
          this.bfaregistrationService.profileStatus(request).subscribe({next: (res: any) => {
                    //console.log('Response:', res);
                   this.loading = false;
                    // ✅ Access the nested properties safely
                    if (res.status && res.data) {
                      if(res.data.vle_name){
                         this.messageProf = res.data.res_msg;
                         this.errClass = 'text-success';
                        this.personalDetailsForm.patchValue({
                          ref_name: res.data.vle_name,
                          ref_mobile: res.data.mobile
                        });
                      }


                      // Example: show error message when res_code = 705
                      if (res.data.res_code === '705') {
                        this.messageProf = res.data.res_msg;
                        this.errClass = 'text-danger';
                      }
                    }
                  },
                  error: (err) => {
                    console.error('Error:', err);
                    this.message = 'Something went wrong. Please try again later.';
                  }
          });
    }
  }
  onDistrictSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const districtCode = target.value;
    const selectedDistrict = this.districtList.find(d => d.f_district_code === districtCode);
    if (selectedDistrict) {
      this.personalDetailsForm.patchValue({
        district_name: selectedDistrict.district_name
      });
    }
  }

  /** ----------------------- FORM GETTERS ---------------------- **/
  get p() { return this.panForm.controls; }
  get pd() { return this.personalDetailsForm.controls; }

/** ----------------------- PAN FORM SUBMIT ---------------------- **/
onVerify(): void {
  this.submitted = true;
  this.message = '';

  if (this.panForm.invalid) {
    this.message = 'Please fill all required fields correctly.';
    this.errClass = 'text-danger';
    return;
  }
  this.loading = true;

  const request = {
    ...this.panForm.value,
    phone: this.phone
  };

  this.bfaregistrationService.updatePost(request).subscribe({
    next: (res) => {
      this.loading = false; // ✅ Hide loader
      this.submitted = false;
      //console.log(res);

      // ✅ Handle success or failure based on API response
      if (res.status === true) {

              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'PAN verified successfully!',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.activeTab = '3';
                  this.openTab(this.activeTab);
                  this.stepsNumber = 2;
                  this.personalDetailsForm.patchValue({
                    pan_status: 'Verified'
                  });
                }
              });

      } else {
        // ❌ Backend returned status: false → Show message
        Swal.fire({
          icon: 'error',
          title: 'Validation Error!',
          text: res.message || 'Something went wrong.',
          confirmButtonText: 'OK'
        });

      }
    },
    error: (err) => {
      this.loading = false; // ✅ Hide loader on error
      Swal.fire({
        icon: 'error',
        title: 'Server Error!',
        text: 'Failed to connect to server. Please try again later.',
        confirmButtonText: 'OK'
      });
    }
  });
}


  /** ----------------------- PERSONAL DETAILS SUBMIT ---------------------- **/
  onPersonalDetailsSubmit(): void {
    this.submitted = true;
    this.message = '';
     this.messagePro = '';

    if (this.personalDetailsForm.invalid) {
      this.message = 'Please fill all required fields correctly.';
       this.errClass = 'text-danger';
      return;
    }

  this.loading = true;
    const request = {
      ...this.personalDetailsForm.value,
      stepsNumber: this.stepsNumber,
      phone: this.phone,
      profession: this.personalDetailsForm.value['profession']??this.personalDetailsForm.value['other_profational_work'],
      gst_file: this.personalDetailsForm.value['gst_file_name'],
      profession_doc: this.personalDetailsForm.value['profession_doc_name']
    };
//console.log(request);
   this.bfaregistrationService.updatePost(request).subscribe({
      next: (res) => {
        this.loading = false;
        this.submitted = false;

        // ✅ Check API response status
        if (res.status === true) {
          this.message = 'Personal details submitted successfully!';
          this.errClass = 'text-success';

            this.router.navigate(['/preview']);
        } else {
          // ❌ Server returned status:false → Show message from server
          this.message = res.message || 'Please fill all required fields.';
          this.errClass = 'text-danger';
        }
      },
      error: (err) => {
        this.loading = false;
        this.message = err?.error?.message || 'Error submitting details. Please try again.';
        this.errClass = 'text-danger';
      }
    });


  }

  /** ----------------------- FETCH BFA INFO ---------------------- **/
 private getBfaInfo(): void {
  if (!this.phone) return;

  const request = { phone: this.phone };

  this.bfaregistrationService.getData(request).subscribe({
    next: (response) => {
     // console.log(response);

      const data = response?.data;
      if (!data) return;

      this.stepsNumber = data.steps || 0;

      localStorage.removeItem('steps');
      localStorage.removeItem('status');

      this.storageService.set('steps', String(data.steps));
      this.storageService.set('status', String(data.status));
      this.storageService.set('pan', String(data.pan) || '');
      if (this.stepsNumber > 1) {
        this.activeTab = '3';
        this.openTab(this.activeTab);
      }

      this.panForm.patchValue({
        pan: data.pan || '',
        name: data.name || '',
        father_name: data.father_name || '',
        dob: data.dob || '',
        phone: data.mobile || ''
      });

      ['pan','name','father_name','dob'].forEach(field => {
        if (data[field]) this.panForm.get(field)?.disable();
      });

      if (data.mobile) {
        this.panForm.get('phone')?.disable();
      }
      this.getDistrict(data.state_code);
      this.status=data.status || '';
      this.stepsNumber=data.steps || '';
      this.personalDetailsForm.patchValue({
          account_no: data.account_no || '',
          confirm_account_no: data.account_no || '',
          account_type: data.account_type || '',
          alternate_mobile: data.alternate_mobile || '',
          bank_branch: data.bank_branch || '',
          bank_name: data.bank_name || '',
          complete_address: data.complete_address || '',
          district_code: data.district_code || '',
          district_name: data.district_name || '',
          dob: data.dob || '',
          email_id: data.email_id || '',
          father_name: data.father_name || '',
          gender: data.gender || '',
          terms:data.term_conditions || '',
          gst_no: data.gst_no || '',
          gst_registered: data.gst_registered || '',
          higher_education: data.higher_education || '',
          other_education: data.other_education || '',
          ifsc_code: data.ifsc_code || '',
          profession_doc_name:data.profession_doc||'',
          latitude: data.latitude || '',
          longitude: data.longitude || '',
          mobile: data.mobile || '',
          name: data.name || '',
          pan: data.pan || '',
          pincode: data.pincode || '',
          profession: data.profession || '',
          ref_cscid: data.ref_cscid || '',
          ref_mobile: data.ref_mobile || '',
          ref_name: data.ref_name || '',
          state_code: data.state_code || '',
          state_name: data.state_name || ''
      });
    },
    error: () => {
      this.message = 'Error fetching BFA info.';
      this.errClass = '';
    }
  });
}

  /** ----------------------- INPUT VALIDATION HELPERS ---------------------- **/
  onlyNumberInput(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!allowedKeys.includes(event.key) && !/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  onlyAlphabetsInput(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete', ' '];
    if (!allowedKeys.includes(event.key) && !/^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault();
    }
  }
  convertToUppercase(
  controlName: string
): void {

  // =====================================
  // GET FORM CONTROLS
  // =====================================
  const panControl =
    this.panForm.get(controlName);

  const personalControl =
    this.personalDetailsForm.get(controlName);

  // =====================================
  // GET VALUES
  // =====================================
  const panValue =
    panControl?.value || '';

  const personalValue =
    personalControl?.value || '';

  // =====================================
  // CONVERT TO UPPERCASE
  // =====================================
  if (panValue) {

    panControl?.setValue(

      panValue.toUpperCase(),

      { emitEvent: false }

    );

  }

  if (personalValue) {

    personalControl?.setValue(

      personalValue.toUpperCase(),

      { emitEvent: false }

    );

  }

  // =====================================
  // GST VALIDATION
  // =====================================
  if (

    controlName === 'gst_no' &&

    personalValue

  ) {

    const gstNo =
      personalValue
        .toUpperCase()
        .trim();

    // =====================================
    // GST FORMAT VALIDATION
    // =====================================
    const gstPattern =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (!gstPattern.test(gstNo)) {

      this.messagePro =
        'Invalid GST Number format';

      this.errClass =
        'text-danger';

      return;

    }

    // =====================================
    // API REQUEST
    // =====================================
    const request = {

      gst_no: gstNo

    };

    console.log(
      'GST Request =>',
      request
    );

    this.loading = true;

    // =====================================
    // GST API CALL
    // =====================================
    this.bfaregistrationService
      .gstinStatus(request)
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          console.log(
            'GST Response =>',
            res
          );

          if (res?.status) {

            this.messagePro =
              res?.message ||
              'GST verified successfully';

            this.errClass =
              'text-success';

          } else {

            this.messagePro =
              res?.message ||
              'Invalid GST Number';

            this.errClass =
              'text-danger';

          }

        },

        error: (err: any) => {

          this.loading = false;

          console.error(
            'GST API Error =>',
            err
          );

          this.messagePro =
            'Something went wrong. Please try again later.';

          this.errClass =
            'text-danger';

        }

      });

  }

}
  onFileSelected1(event: any): void {
  const file: File = event.target.files[0];
  this.errorMessage = '';
  this.uploadedFileName = '';

  if (!file) {
    this.errorMessage = 'Please select a file.';
    return;
  }

  const allowedTypes = [
    'image/png', 'image/jpeg', 'image/webp',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!allowedTypes.includes(file.type)) {
    this.errorMessage = 'Only PNG, JPG, JPEG, WEBP, PDF, and DOC files are allowed.';
    return;
  }

  if (file.size > 1 * 1024 * 1024) {
    this.errorMessage = 'File size must be less than 1MB.';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
      const base64File = reader.result as string;

      const payload: { filename: string; filetype: string; content: string } = {
      filename: file.name,
      filetype: file.type,
      content: base64File
    };

  this.loading = true;

    this.bfaregistrationService.uploadFile(payload).subscribe({
      next: (res: any) => {
        if (res.status) {

        this.loading = false;
         this.uploadedFileName = res.file_name;
          this.fileURL = this.fileURL + this.uploadedFileName;
           this.personalDetailsForm.patchValue({
               gst_file_name:res.file_name
            });
            this.changeType();
            this.errClass="text-success";
          this.messageFile = 'File uploaded successfully!';
        } else {
          this.errorMessage = res.message || 'File upload failed.';
        }
      },
      error: () => this.errorMessage = 'Error uploading file.'
    });
  };

  reader.readAsDataURL(file); // Converts file to Base64
}
uploadedFiles: any = {};   // store file names per field
fileErrors: any = {};      // store errors per field
fileLoading: any = {};     // loader per field

onFileSelected(event: any, fieldName: string): void {
  const file: File = event.target.files[0];

  this.fileErrors[fieldName] = '';

  if (!file) {
    this.fileErrors[fieldName] = 'Please select a file.';
    return;
  }

  const allowedTypes = [
    'image/png', 'image/jpeg', 'image/webp',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!allowedTypes.includes(file.type)) {
    this.fileErrors[fieldName] = 'Only PNG, JPG, PDF, and DOC files are allowed.';
    return;
  }

  if (file.size > 1 * 1024 * 1024) {
    this.fileErrors[fieldName] = 'File size must be less than 1MB.';
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const payload = {
      filename: file.name,
      filetype: file.type,
      content: reader.result as string
    };

    this.fileLoading[fieldName] = true;

    this.bfaregistrationService.uploadFile(payload).subscribe({
      next: (res: any) => {
        this.fileLoading[fieldName] = false;

        if (res.status) {

          // ✅ ONLY update current field (no reset)
          this.uploadedFiles[fieldName] = res.file_name;

          this.personalDetailsForm.patchValue({
            [fieldName]: res.file_name
          }, { emitEvent: false }); // 🔥 prevent unwanted triggers

        } else {
          this.fileErrors[fieldName] = res.message || 'Upload failed.';
        }
      },
      error: () => {
        this.fileLoading[fieldName] = false;
        this.fileErrors[fieldName] = 'Error uploading file.';
      }
    });
  };

  reader.readAsDataURL(file);
}
inputType: string = 'file';
termsAccepted: boolean = false;

changeType() {
 // alert("ok");
  this.inputType = 'text';
}

otherProfessionalWork: string = '';
showProfessionalWork: boolean = false;
onWorkQualificationChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const data = target.value;
  this.showProfessionalWork = (data === 'Other');
}
accountMatchValidation(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const confirm_account = target.value;
  const account = this.personalDetailsForm.get('account_no')?.value;
   if (account !== confirm_account) {
      this.confirm_accountError = 'Account do not match';
      return;
    }else{
       this.confirm_accountError ='';
    }

}
accountValidation(event: Event): void {

  const target =
    event.target as HTMLInputElement;

  // =====================================
  // GET VALUES
  // =====================================
  const ifsc_code =
    (target.value || '')
      .trim()
      .toUpperCase();

  const account =
    this.personalDetailsForm
      .get('account_no')
      ?.value || '';

  // =====================================
  // RESET
  // =====================================
  this.ifscError = '';

  this.loading = false;

  // =====================================
  // EMPTY IFSC
  // =====================================
  if (!ifsc_code) {

    this.personalDetailsForm.patchValue({

      bank_name: '',

      bank_branch: ''

    });

    return;

  }

  // =====================================
  // VALIDATE IFSC LENGTH
  // =====================================
  if (ifsc_code.length < 11) {

    this.ifscError =
      'IFSC Code must be 11 characters';

    this.personalDetailsForm.patchValue({

      bank_name: '',

      bank_branch: ''

    });

    return;

  }

  // =====================================
  // VALIDATE IFSC FORMAT
  // =====================================
  const ifscPattern =
    /^[A-Z]{4}0[A-Z0-9]{6}$/;

  if (!ifscPattern.test(ifsc_code)) {

    this.ifscError =
      'Invalid IFSC Code format. Example: ICIC0001234';

    this.personalDetailsForm.patchValue({

      bank_name: '',

      bank_branch: ''

    });

    return;

  }

  // =====================================
  // REQUEST
  // =====================================
  const request = {

    // account: account,

    ifsc: ifsc_code

  };

  console.log(
    'IFSC Request =>',
    request
  );

  // =====================================
  // LOADING
  // =====================================
  this.loading = true;

  // =====================================
  // API CALL
  // =====================================
  this.bfaregistrationService
    .getBankData(request)
    .subscribe({

      next: (res: any) => {

        this.loading = false;

        console.log(
          'Bank Response =>',
          res
        );

        if (
          res &&
          res.status &&
          res.data
        ) {

          this.errClass =
            'text-success';

          this.ifscError = '';

          this.personalDetailsForm
            .patchValue({

              bank_name:
                res.data.bank_name || '',

              bank_branch:
                res.data.branch_name || ''

            });

        } else {

          this.personalDetailsForm
            .patchValue({

              bank_name: '',

              bank_branch: ''

            });

          this.ifscError =
            res?.message ||
            'Bank details not found';

        }

      },

      error: (error: any) => {

        this.loading = false;

        console.error(
          'IFSC API Error =>',
          error
        );

        this.personalDetailsForm
          .patchValue({

            bank_name: '',

            bank_branch: ''

          });

        this.ifscError =
          'Unable to fetch bank details';

      }

    });

}
getCurrentLocation(): void {

  // =========================================
  // Check Browser Support
  // =========================================
  if (!navigator.geolocation) {

    alert(
      'Geolocation is not supported.'
    );

    return;

  }

  // =========================================
  // Get Current Location
  // =========================================
  navigator.geolocation.getCurrentPosition(

    (position) => {

      const latitude =
        position.coords.latitude;

      const longitude =
        position.coords.longitude;

      console.log(
        'Latitude =>',
        latitude
      );

      console.log(
        'Longitude =>',
        longitude
      );

      // =========================================
      // Call SMS API
      // =========================================
      this.sendSMS();

    },

    (error) => {

      console.error(
        'Location Error =>',
        error
      );

      alert(
        'Unable to fetch location.'
      );

    }

  );

}
sendSMS(): void {

  // =========================================
  // Validate Mobile Number
  // =========================================
  if (
    !this.phone ||
    this.phone.length !== 10
  ) {

    alert(
      'Please enter a valid mobile number.'
    );

    return;

  }

  // =========================================
  // Call SMS API
  // =========================================
  //this.phone='8882263385';
  this.bfaregistrationService
    .sendSMSBFA(this.phone)
    .subscribe({

      next: (response: any) => {

        console.log(
          'SMS API Response =>',
          response
        );

        alert(
          'SMS sent successfully.'
        );

      },

      error: (error: any) => {

        console.error(
          'SMS API Error =>',
          error
        );

        alert(
          'Send SMS.'
        );

      }

    });

}



}
