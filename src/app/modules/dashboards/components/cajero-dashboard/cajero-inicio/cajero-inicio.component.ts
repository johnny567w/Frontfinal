import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../../../shared/components/footer/footer.component';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-cajero-inicio',
  standalone: true,
  imports: [RouterModule,FooterComponent,NgIf,NgClass],
  templateUrl: './cajero-inicio.component.html',
  styles: ``
})
export class CajeroInicioComponent {

}
