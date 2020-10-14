// ANGULAR
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// LIBS
import { NGE_DOC_RENDERERS } from 'nge-doc';
import { NgeMonacoModule, NgeMonacoColorizerService, NGE_THEMES } from 'nge-monaco';
import {
    NgeMarkdownTabbedSetProvider,
    NgeMarkdownAdmonitionsProvider,
    NgeMarkdownLinkAnchorProvider,
    NgeMarkdownKatexProvider,
    NgeMarkdownEmojiProvider,
    NgeMarkdownIconsProvider,
    NgeMarkdownHighlighterProvider,
    NgeMarkdownHighlighterMonacoProvider,
} from 'nge-markdown';

// MODULE
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
           themes: NGE_THEMES.map(theme => 'assets/nge-monaco/themes/' + theme),
           default: 'github'
        }
    }),
    BrowserAnimationsModule,
  ],
  providers: [
        NgeMarkdownKatexProvider,
        NgeMarkdownIconsProvider,
        NgeMarkdownEmojiProvider,
        NgeMarkdownTabbedSetProvider,
        NgeMarkdownLinkAnchorProvider,
        NgeMarkdownAdmonitionsProvider,
        NgeMarkdownHighlighterProvider,
        NgeMarkdownHighlighterMonacoProvider(NgeMonacoColorizerService),
        {
            provide: NGE_DOC_RENDERERS,
            useValue: {
                markdown: {
                    component: () => import('nge-markdown').then(m => m.NgeMarkdownComponent)
                }
            }
        },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
