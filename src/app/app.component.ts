import { Component, Input } from '@angular/core';
import { InicioComponent } from "./shared/components/inicio/inicio.component";
import { RouterModule, RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule,RouterOutlet,FooterComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'parqueadero-publico-final';
  @Input() isFixed: boolean = false;

}
