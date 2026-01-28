import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BfaregistrationService } from '../../core/services/bfaregistration.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bfaregistration',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './bfaregistration.component.html',
  styleUrls: ['./bfaregistration.component.css'] // ✅ Fixed typo
})
export class BfaregistrationComponent implements OnInit {
ifscError: any;
accountValidation($event: Event) {
throw new Error('Method not implemented.');
}
messagePro: any;
profileStatus($event: Event) {
throw new Error('Method not implemented.');
}
loading: any;
onWorkQualificationChange() {
throw new Error('Method not implemented.');
}
errorMessage: any;
uploadedFileName: any;
fileURL: any;
messageFile: any;
termsAccepted: any;
showProfessionalWork: any;
onFileSelected($event: Event) {
throw new Error('Method not implemented.');
}
errClass: any|string;
convertToUppercase(arg0: string) {
throw new Error('Method not implemented.');
}
  panForm!: FormGroup;
  submitted = false;
  message = '';
  phone: string | null = localStorage.getItem('userPhone');
  steps: string | null = localStorage.getItem('steps');
  stepsNumber: number = this.steps ? +this.steps : 0;

  activeTab: string = '2'; // Default active tab
  personalDetailsForm!: FormGroup;
stateList: any;
districtList: any;
bankList: any;
maxDate: any;

  constructor(
    private fb: FormBuilder,
    private bfaregistrationService: BfaregistrationService, private router: Router
  ) {
     if (!this.phone) {
      this.getBfaInfo();
    }else{
          this.router.navigate(['/bfaregistration']);
          return;
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.initPDForm();
    this.getStates();
    //this.getDistrict();
    if (this.phone) {
      this.getBfaInfo();
    }
    //this.activeTab = '';
  }
  getStates() {
     const request=''
    this.bfaregistrationService.getStates(request).subscribe({
      next: (response) => {
        this.message = 'List of states name retrieved.';
        this.stateList = response.data;
      },
      error: (error) => {

        this.message = 'Error. Please try again.';
      }
    });
  }
onStateSelect(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const selectedCode = target.value;
  const selectedState = this.stateList.find(
    (s: any) => s.f_state_code === selectedCode
  );
  if (selectedState) {
    this.personalDetailsForm.patchValue({
      f_state_code: selectedState.f_state_code,
      state_name: selectedState.state_name,
      state_short: selectedState.state_short
    });
    this.getDistrict(selectedState.f_state_code);
  }
}
  getDistrict(stateCode: string) {
    const request={ "state": stateCode }
    this.bfaregistrationService.getDistrict(request).subscribe({
      next: (response) => {
        this.message = 'List of district name retrieved.';
        this.districtList = response.data;
      },
      error: (error) => {

        this.message = 'Error Please try again.';
      }
    });
  }
  onDistrictSelect(event: Event): void {
     const target = event.target as HTMLSelectElement;
      const district_code = target.value;

      const selectedCode = this.districtList.find(
        (s: any) => s.f_district_code === district_code
      );
      if (selectedCode) {
        this.personalDetailsForm.patchValue({
          district_name: selectedCode.district_name,
        });
      }
  }
  // ✅ Initialize form
  private initForm(): void {
    this.panForm = this.fb.group({
      pan: ['', [Validators.required, Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]$')]],
      name: ['', Validators.required],
      father_name: ['', Validators.required],
      dob: ['', Validators.required],
      phone: [''] // optional, can be disabled later
    });
  }
  private initPDForm(): void {
  this.personalDetailsForm = this.fb.group({
    profession: ['', Validators.required],
    email_id: ['', [Validators.required, Validators.email]],
    alternate_mobile: ['', [Validators.pattern('^[0-9]{10}$')]], // not required
    higher_education: ['', Validators.required],
    gender: ['', Validators.required],
    state_name: ['', Validators.required],
    district_name: ['', Validators.required],
    complete_address: ['', Validators.required],
    pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
    latitude: [''],
    longitude: [''],
    gst_registered: ['', Validators.required],
    gst_no: [''],
    gst_file: [''],
    account_type: ['', Validators.required],
    bank_name: ['', Validators.required],
    bank_branch: ['', Validators.required],
    account_no: ['', [Validators.required, Validators.pattern('^[0-9]{9,18}$')]],
    ifsc_code: ['', [Validators.required, Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]],
    ref_cscid: [''],
    ref_name: [''],
    state_short: [''],
    f_state_code: [''],
    district_code: [''],
    ref_mobile: ['', [Validators.pattern('^[0-9]{10}$')]], // not required
    phone: [''] // optional
  });

  // Conditionally make GST fields required when 'gst_registered' is 'Yes'
  this.personalDetailsForm.get('gst_registered')?.valueChanges.subscribe(value => {
    const gstNoControl = this.personalDetailsForm.get('gst_no');
    const gstFileControl = this.personalDetailsForm.get('gst_file');

    if (value === 'Yes') {
      gstNoControl?.setValidators([Validators.required]);
      gstFileControl?.setValidators([Validators.required]);
    } else {
      gstNoControl?.clearValidators();
      gstFileControl?.clearValidators();
    }

    gstNoControl?.updateValueAndValidity();
    gstFileControl?.updateValueAndValidity();
  });

}



  // ✅ Tab switching
  openTab(tabName: string): void {
    this.activeTab = tabName;
  }

  // ✅ Getter for easy access to form controls
  get p() {
    return this.panForm.controls;
  }
  get pd() {
      return this.personalDetailsForm.controls;
    }
  // ✅ PAN Verification Submit
  onVerify(): void {
    this.submitted = true;
    this.message = '';

    if (this.panForm.invalid) {
      this.message = 'Please fill all required fields correctly.';
      return;
    }

    if (!this.phone) {
      this.message = 'User phone number not found in local storage.';
      return;
    }

    const request = {
      pan: this.panForm.value.pan,
      father_name: this.panForm.value.father_name,
      dob: this.panForm.value.dob,
      name: this.panForm.value.name,
      phone: this.phone
    };

    this.bfaregistrationService.updatePost(request).subscribe({
      next: (response) => {
        this.message = 'Form submitted successfully!';
        this.submitted = false;
      },
      error: (error) => {
        console.error('❌ Error submitting form:', error);
        this.message = 'Error submitting form. Please try again.';
      }
    });
  }
// ✅ personal Details Form Submit
  onPersonalDetailsSubmit(): void {
    this.submitted = true;
    this.message = '';

    if (this.personalDetailsForm.invalid) {
      this.message = 'Please fill all required fields correctly.';
      return;
    }

    if (!this.phone) {
      this.message = 'User phone number not found in local storage.';
      return;
    }

    const request = {
        profession: this.personalDetailsForm.value.profession,
        email_id: this.personalDetailsForm.value.email_id,
        alternate_mobile: this.personalDetailsForm.value.alternate_mobile,
        higher_education: this.personalDetailsForm.value.higher_education,
        gender: this.personalDetailsForm.value.gender,
        state_name: this.personalDetailsForm.value.state_name,
        state_code: this.personalDetailsForm.value.state_code,
        state_short: this.personalDetailsForm.value.state_short,
        district_name: this.personalDetailsForm.value.district_name,
        district_code: this.personalDetailsForm.value.district_code,
        complete_address: this.personalDetailsForm.value.complete_address,
        pincode: this.personalDetailsForm.value.pincode,
        latitude: this.personalDetailsForm.value.latitude,
        longitude: this.personalDetailsForm.value.longitude,
        gst_registered: this.personalDetailsForm.value.gst_registered,
        gst_no: this.personalDetailsForm.value.gst_no,
        gst_file: this.personalDetailsForm.value.gst_file,
        account_type: this.personalDetailsForm.value.account_type,
        bank_name: this.personalDetailsForm.value.bank_name,
        bank_branch: this.personalDetailsForm.value.bank_branch,
        account_no: this.personalDetailsForm.value.account_no,
        ifsc_code: this.personalDetailsForm.value.ifsc_code,
        ref_cscid: this.personalDetailsForm.value.ref_cscid,
        ref_name: this.personalDetailsForm.value.ref_name,
        ref_mobile: this.personalDetailsForm.value.ref_mobile,
        phone: this.phone
      };


    this.bfaregistrationService.updatePost(request).subscribe({
      next: (response) => {
        this.message = 'Form submitted successfully!';
        this.submitted = false;
      },
      error: (error) => {
        console.error('❌ Error submitting form:', error);
        this.message = 'Error submitting form. Please try again.';
      }
    });
  }
  // ✅ Get BFA info from API and populate form
  private getBfaInfo(): void {
    const request = { phone: this.phone };

    this.bfaregistrationService.getData(request).subscribe({
      next: (response) => {
        if (response?.data) {
          this.stepsNumber = response.data.steps || 0;

          // Switch to tab 3 if PAN already verified
          if (this.stepsNumber === 2) {
            this.activeTab = '3';
          }
///console.log('activeTab',this.activeTab,'steps',this.stepsNumber);
          // Patch form values
          this.panForm.patchValue({
            pan: response.data.pan || '',
            name: response.data.name || '',
            father_name: response.data.father_name || '',
            dob: response.data.dob || '',
            phone: response.data.mobile || ''
          });

          // Disable fields if already filled
          if (response.data.pan) this.panForm.get('pan')?.disable();
          if (response.data.name) this.panForm.get('name')?.disable();
          if (response.data.father_name) this.panForm.get('father_name')?.disable();
          if (response.data.dob) this.panForm.get('dob')?.disable();
          if (response.data.mobile) this.panForm.get('phone')?.disable();
        }
      },
      error: (error) => {
        console.error('❌ Error fetching BFA info:', error);
      }
    });
  }
 onlyNumberInput(event: KeyboardEvent): void {
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];

  // Allow navigation and editing keys
  if (allowedKeys.includes(event.key)) {
    return;
  }

  // Block non-numeric input
  if (!/^[0-9]$/.test(event.key)) {
    event.preventDefault();
  }
}

onlyAlphabetsInput(event: KeyboardEvent): void {
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete', ' ']; // Allow space & control keys

  if (allowedKeys.includes(event.key)) {
    return;
  }

  // Allow only alphabets (A-Z or a-z)
  if (!/^[a-zA-Z]$/.test(event.key)) {
    event.preventDefault();
  }
}

}
