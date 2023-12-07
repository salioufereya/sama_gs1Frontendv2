import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { initFlowbite } from 'flowbite';
import { SidebarComponent } from "./sidebar/sidebar.component";
@NgModule({
    declarations: [AppComponent],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NavComponent,
        ReactiveFormsModule,
        HttpClientModule,
        SidebarComponent
    ]
})
export class AppModule implements OnInit {
  ngOnInit(): void {
    initFlowbite();
  }
}
