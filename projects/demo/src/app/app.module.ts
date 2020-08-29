import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgeMonacoModule, NGE_THEMES } from 'nge-monaco';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgeMonacoModule.forRoot({
        locale: 'fr',
        theming: {
           // themes: [
           //     'assets/themes/nord.json',
           //     'assets/themes/github.json',
           //     'assets/themes/one-dark-pro.json',
           // ],
           themes: NGE_THEMES.map(theme => 'assets/themes/' + theme),
           default: 'vs'
        }
    }),
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
