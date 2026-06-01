import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router,
  RouterLink
} from '@angular/router';
import { StorageService } from '../../../../core/storage.service';



@Component({
  selector: 'app-failure',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './failure.component.html',
  styleUrls: ['./failure.component.css']
})
export class FailureComponent implements OnInit {

  // =====================================
  // Variables
  // =====================================

  phone: string = '';

  stepsNumber: string = '';

  // =====================================
  // Constructor
  // =====================================

  constructor(

    private storageService: StorageService,

    private router: Router

  ) {}

  // =====================================
  // Init
  // =====================================

  ngOnInit(): void {

    // Get Storage Data
    this.phone =
      this.storageService.get('userPhone') || '';

    this.stepsNumber =
      this.storageService.get('steps') || '';
    // =========================================
    // Redirect if Session Missing
    // =========================================

    if (
      !this.phone ||
      !this.stepsNumber
    ) {

      this.router.navigate(['/otp']);

      return;
    }

  }

}
