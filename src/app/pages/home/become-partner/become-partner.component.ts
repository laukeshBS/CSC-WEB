import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BeComePartnerService } from '../../../core/services/be-come-partner.service';

@Component({
  selector: 'app-become-partner',
  standalone: true,
  imports: [FormsModule,CommonModule, ReactiveFormsModule],
  templateUrl: './become-partner.component.html',
  styleUrl: './become-partner.component.css'
})
export class BecomePartnerComponent {
 ins= "loanbazar@csc.gov.in";
 contactForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient,
    private beComePartnerService:BeComePartnerService) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      designation: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      institution: ['', [Validators.required, Validators.maxLength(100)]],
      message: ['', [Validators.required, Validators.maxLength(500)]],

    });
  }

  // Getter to simplify template access
  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    if (this.contactForm.valid) {

      this.beComePartnerService.createPost(this.contactForm.value)
      .subscribe({
        next: (data) => {
          alert('Form submitted successfully!');
          this.contactForm.reset();
        },
        error: (error) => {
          alert('Error submitting form');
          console.error(error);
        }
      });

    }
  }
}
