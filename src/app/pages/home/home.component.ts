import { Component } from '@angular/core';
import { SliderComponent } from "./slider/slider.component";
import { ProductComponent } from "./product/product.component";
import { BrandComponent } from "./brand/brand.component";
import { TestimonialsComponent } from "./testimonials/testimonials.component";
import { InformationComponent } from "./information/information.component";
import { BecomePartnerComponent } from "./become-partner/become-partner.component";
import { FaqComponent } from "./faq/faq.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SliderComponent, ProductComponent, BrandComponent, TestimonialsComponent, InformationComponent, BecomePartnerComponent, FaqComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
