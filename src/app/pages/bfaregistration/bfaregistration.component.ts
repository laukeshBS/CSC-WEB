import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BfaregistrationService } from '../../core/services/bfaregistration.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-bfaregistration',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
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
  phone: string | null = localStorage.getItem('userPhone');
  stepsNumber: number = +(localStorage.getItem('steps') || 0);
  activeTab = '2';
  stateList: any[] = [];
  districtList: any[] = [];
  status:any =+(localStorage.getItem('status') || 0);
  ifscError: string = '';
bankList = [
  "Ab Bank Ltd",
  "Abhyudaya Co Operative Bank Ltd.",
  "Abu Dhabi Commercial Bank",
  "Allahabad Bank",
  "Andhra Bank",
  "Antwerp Diamond Bank N.V",
  "Axis Bank Limited",
  "Bajaj Allianz Life Insurance Company Limited",
  "Bank of America N.A.",
  "Bank of Bahrain And Kuwait B.S.C",
  "Bank of Baroda",
  "Bank of Ceylon",
  "Bank of India",
  "Bank of Maharashtra",
  "Barclays Bank Plc",
  "Baroda Pioneer Mutual Fund",
  "Bassein Catholic Cooperative Bank Limited.",
  "Bharti Axa Mutual Fund",
  "Birla Sun Life Insurance Company Limited",
  "Birla Sun Life Mutual Fund",
  "Bnp Paribas",
  "Bnp Paribas Mutual Fund",
  "Calyon Bank",
  "Canara Bank",
  "Canara Robeco Mutual Fund",
  "Central Bank of India",
  "Citibank N.A",
  "Citizen Credit Cooperative Bank Ltd.",
  "City Union Bank Limited",
  "Corporation Bank",
  "Credit Suisse Ag",
  "Dbs Bank Ltd.",
  "Dena Bank",
  "Deposit Insurance And Credit Guarantee Corporation",
  "Deutsche Bank Ag",
  "Deutsche Mutual Fund",
  "Deutsche Securities India Private Limited",
  "Development Credit Bank Ltd.",
  "Dhanlaxmi Bank Limited",
  "Dombivli Nagari Sahakari Bank Ltd.",
  "DSP Blackrock Mutual Fund",
  "EPFO A/C SBI Portfolio Managers",
  "Export Credit Guarantee Corporation of India Ltd.",
  "Export Import Bank of India",
  "Fidelity Mutual Fund",
  "Firstrand Bank Ltd",
  "Franklin Templeton Mutual Fund",
  "General Insurance Corporation of India",
  "Goldman Sachs (India) Capital Markets Private Limited",
  "HDFC Bank Limited",
  "HDFC Mutual Fund",
  "HSBC Mutual Fund",
  "ICICI Bank Limited",
  "ICICI Lombard General Insurance Company Limited",
  "ICICI Prudential Life Insurance Company Limited",
  "ICICI Prudential Mutual Fund",
  "ICICI Securities Primary Dealership Limited",
  "IDBI Bank Limited",
  "IDFC Mutual Fund",
  "Indian Bank",
  "Indian Overseas Bank",
  "Indusind Bank Limited",
  "ING  Mutual Fund",
  "ING Vysya Bank Ltd",
  "J M Financial Mutual Fund",
  "Janakalyan Sahakari Bank Ltd",
  "Janata Sahakari Bank Ltd. Pune",
  "JP Morgan Chase Bank",
  "JP morgan Mutual Fund",
  "Kallappanna Awade Ichalkaranji Janata Sahakari Bank Ltd.",
  "Kotak Mahindra Bank Limited",
  "Kotak Mahindra Mutual Fund",
  "L And T Mutual Fund",
  "LIC Mutual Fund",
  "Life Insurance Corporation of India",
  "Morgan Stanley India Primary Dealer Private Limited",
  "Nagpur Nagarik Sahakari Bank Ltd",
  "National Bank For Agriculture And Rural Development",
  "National Housing Bank",
  "New India Co Operative Bank Ltd.",
  "Nkgsb Co Op Bank Ltd.",
  "Nomura Fixed Income Securities Private Limited",
  "Nutan Nagarik Sahakari Bank Ltd",
  "Oman International Bank S.A.O.G.",
  "Oriental Bank of Commerce",
  "PNB Gilts Limited.",
  "Principal Mutual Fund",
  "Punjab And Maharashtra Co Operative Bank Ltd.",
  "Punjab And Sind Bank",
  "Punjab National Bank",
  "Rajkot Nagarik Sahakari Bank Ltd.",
  "Reliance Life Insurance Company Limited",
  "Reliance Mutual Fund",
  "Religare Mutual Fund",
  "SBI Dfhi Ltd",
  "SBI Life Insurance Company Limited",
  "SBI Mutual Fund",
  "Sicom Ltd.",
  "Small Industries Development Bank of India",
  "Societe Generale",
  "Standard Chartered Bank",
  "State Bank of Bikaner And Jaipur",
  "State Bank of Hyderabad",
  "State Bank of India",
  "State Bank of Mauritius Ltd",
  "State Bank of Mysore",
  "State Bank of Patiala",
  "State Bank of Travancore",
  "Stci Primary Dealer Limited",
  "Syndicate Bank",
  "Tamilnad Mercantile Bank Ltd.",
  "Tata Mutual Fund",
  "Thane Bharat Sahakari Bank Ltd",
  "The Ahmedabad Mercantile Co Operative Bank Ltd",
  "The Bank of Nova Scotia",
  "The Bank of Tokyo Mitsubishi Ufj Ltd.",
  "The Bharat Cooperative Bank Mumbai Ltd.",
  "The Catholic Syrian Bank Ltd.",
  "The Cosmos Cooperative Bank Ltd.",
  "The Federal Bank Limited",
  "The Greater Bombay Cooperative Bank Ltd.",
  "The Gujarat State Cooperative Bank Ltd.",
  "The Hongkong And Shanghai Banking Corporation Limited",
  "The Jammu And Kashmir Bank Ltd.",
  "The Kalupur Commercial Cooperative Bank Limited",
  "The Kalyan Janata Sahakari Bank Ltd.",
  "The Kapol Cooperative Bank Ltd.",
  "The Karad Urban Cooperative Bank Ltd. Karad",
  "The Karnataka Bank Ltd.",
  "The Karur Vysya Bank Ltd.",
  "The Lakshmi Vilas Bank Ltd.",
  "The Mahanagar Co Operative Bank Ltd",
  "The Maharashtra State Co Operative Bank Ltd",
  "The Mumbai District Central Cooperative Bank Ltd.",
  "The New India Assurance Co. Ltd.",
  "The Ratnakar Bank Ltd.",
  "The Royal Bank of Scotland N. V.",
  "The Saraswat Cooperative Bank Ltd",
  "The Shamrao Vithal Co Operative Bank Limited",
  "The South Indian Bank Limited",
  "The Surat Peoples Coop Bank Ltd.",
  "The Tamil Nadu State Apex Coop. Bank Ltd.",
  "The Thane Janata Sahakari Bank Ltd.",
  "The West Bengal State Cooperative Bank Ltd.",
  "UCO Bank",
  "Union Bank of India",
  "United Bank of India",
  "Uti Mutual Fund",
  "Vijaya Bank",
  "Yes Bank Limited"
];
  errClass: string = 'text-danger';
  uploadedFileName: string | undefined;
  messageFile: string | undefined;
  loading: boolean | undefined;

  constructor(
    private fb: FormBuilder,
    private bfaregistrationService: BfaregistrationService,
    private router: Router
  ) {}
  openTab(tabName: any): void {

     this.activeTab = tabName;
  }
  ngOnInit(): void {

    this.maxDate = this.getMaxDateFor18YearsOld();
    if (this.status > 2) {
       this.router.navigate(['/status']);
    }

    if (!this.phone || !this.stepsNumber) {
       this.router.navigate(['/otp']);
    }

    if (this.stepsNumber > 1) {
        this.activeTab = '3';
        this.openTab(this.activeTab);
    }
    console.log(this.stepsNumber);
    this.initPanForm();
    this.initPersonalDetailsForm();
    this.getStates();
    this.getBfaInfo();
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
      gender: ['', Validators.required],
      state_name: ['', Validators.required],
      district_name: ['', Validators.required],
      complete_address: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      latitude: ['', [Validators.required, Validators.pattern(/^[-]?\d+(\.\d{1,10})?$/), this.latitudeRangeValidator]],
      longitude: ['', [Validators.required, Validators.pattern(/^[-]?\d+(\.\d{1,10})?$/), this.longitudeRangeValidator]],
      gst_registered: ['', Validators.required],
      gst_no: [''],
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
      other_profational_work: [''],
      terms: ['', [Validators.required]],
      gst_file_name: ['']

    });

    // ✅ Dynamically handle GST validation
    this.personalDetailsForm.get('gst_registered')?.valueChanges.subscribe(value => {
      const gstNo = this.personalDetailsForm.get('gst_no');
      const gstFile = this.personalDetailsForm.get('gst_file');

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
         this.messagePro = '';
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
                         this.messagePro = res.data.res_msg;
                         this.errClass = 'text-success';
                        this.personalDetailsForm.patchValue({
                          ref_name: res.data.vle_name,
                          ref_mobile: res.data.mobile
                        });
                      }


                      // Example: show error message when res_code = 705
                      if (res.data.res_code === '705') {
                        this.messagePro = res.data.res_msg;
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
      profession: this.personalDetailsForm.value['other_profational_work'],
      gst_file: this.personalDetailsForm.value['gst_file_name']
    };

   this.bfaregistrationService.updatePost(request).subscribe({
      next: (res) => {
        this.loading = false;
        this.submitted = false;

        // ✅ Check API response status
        if (res.status === true) {
          this.message = 'Personal details submitted successfully!';
          this.errClass = 'text-success';
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
        const data = response?.data;
        if (!data) return;

        this.stepsNumber = data.steps || 0;
          localStorage.removeItem('steps');
          localStorage.removeItem('status');
          localStorage.setItem('steps', data.steps);
          if (this.stepsNumber > 1) {
            this.activeTab = '3';
            this.openTab(this.activeTab);
          }
        localStorage.setItem('status', data.status );

        this.panForm.patchValue({
          pan: data.pan || '',
          name: data.name || '',
          father_name: data.father_name || '',
          dob: data.dob || '',
          phone: data.mobile || ''
        });

        // Disable prefilled fields
        ['pan', 'name', 'father_name', 'dob', 'phone'].forEach(field => {
          if (data[field]) this.panForm.get(field)?.disable();
        });
      },
      error: () => (this.message = 'Error fetching BFA info.', this.errClass='')
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
    convertToUppercase(controlName: any): void {
    const value = this.panForm.get(controlName)?.value;
     const value1 = this.personalDetailsForm.get(controlName)?.value;
    if (value || value1) {
      this.panForm.get(controlName)?.setValue(value.toUpperCase(), { emitEvent: false });
      this.personalDetailsForm.get(controlName)?.setValue(value1.toUpperCase(), { emitEvent: false });
    }
  }
  onFileSelected(event: any): void {
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

  if (file.size > 2 * 1024 * 1024) {
    this.errorMessage = 'File size must be less than 2MB.';
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
accountValidation(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const ifsc_code = target.value;
   const account = this.personalDetailsForm.get('account_no')?.value;

   if(ifsc_code.length >= 11){

      const request={
        account:account,
        ifsc:ifsc_code
      }
this.ifscError = '';

    // 1️⃣ Validate IFSC format
    const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (ifsc_code && !ifscPattern.test(ifsc_code)) {
      this.ifscError = 'Invalid IFSC Code format. (e.g. ICIC0001234)';
      return;
    }

    // 2️⃣ Validate account no presence
    if (!account) {
      this.ifscError = 'Enter Account Number first.';
      return;
    }


      this.loading = true;
     console.log(request);
    this.bfaregistrationService.bankStatus(request).subscribe({
      next: (res: any) => {
        if (res.status) {

        this.loading = false;
         this.errClass="text-success";
          this.messageFile = res.message ;
        } else {
          this.errorMessage = res.message || 'Bank account status fetched failed.';
        }
      },
      error: () => this.errorMessage = 'Bank account status fetched.'
    });
   }

}



}
