import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowcaseComponent } from './showcase.component';
import { NgeMonacoModule } from 'nge-monaco';

@NgModule({
  imports: [
    CommonModule,
    NgeMonacoModule,
  ],
  declarations: [ShowcaseComponent]
})
export class ShowcaseModule {
    component = ShowcaseComponent;
}
