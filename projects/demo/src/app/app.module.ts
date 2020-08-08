import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgeMonacoModule } from 'nge-monaco';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgeMonacoModule.forRoot({
        locale: 'fr',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
