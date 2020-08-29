# Getting started

nge-monaco is an [Angular](https://angular.io) library that allow you to use [Monaco Editor](https://microsoft.github.io/monaco-editor/) in your projects.

***Features(+)***

+ nge-monaco-editor component to display an instance of monaco editor.
+ nge-monaco-diff-editor component to display an instance of monaco diff editor.
+ nge-monaco-viewer to highlight a code block.
+ expose a theming api to easily create new themes and change the editor theme.
+ comes with a set of ready to use themes.
+ contribution system to extends monaco editor api.
+ full control over the monaco editor instances.
+ ability to localize the editor user interface.
+ load from a cdn by default.

## Demonstration

Live demonstration available at [https://mciissee.github.io/nge-monaco/](https://mciissee.github.io/nge-monaco/)

Open a terminal and clone this repository

```shell
git clone https://github.com/mciissee/nge-monaco
```

Go to nge-monaco folder

```shell
cd nge-monaco
```

Install the dependencies from package.json

```shell
npm install
```

Start the development server and open [http://localhost:4200/](http://localhost:4200/)

```shell
npm start
```

## Installation

To add nge-monoaco library to your package.json use the following command.

```shell
npm i --save nge-monaco monaco-editor
```

## Usage

### Module

You must import **NgeMonacoModule** first inside your application main module (usually AppModule) with **forRoot()** to be able to use nge-monaco components.
For the other feature modules, you can must import **NgeMonacoModule** without calling **forRoot**

```diff
// example.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExampleComponent } from './example.component'; // your component
+ import { NgeMonacoModule } from 'nge-monaco';

@NgModule({
  declarations: [
    ExampleComponent
  ],
  imports: [
    CommonModule,
+   NgeMonacoModule.forRoot(),  // use forRoot() in main app module only.
  ],
  providers: [],
})
export class ExampleModule { }
```

### Components

This library is designed in a way that you have a total control of the editor instance so the component
does not expose a [(ngModel)] input to bind a variable to the editor content, you must attach a TextModel
to the editor by yourself  by calling `monaco.editor.createModel` by yourself.
This is a design choice since this component is intended to be as simple as possible.

#### nge-monaco-editor

```typescript
// example.component.ts

import { Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-example',
    templateUrl: './example.component.html',
    styleUrls: ['./example.component.scss'],
})
export class ExampleComponent implement OnDestroy {
    private readonly disposables: monaco.IDisposable[] = [];
    private model?: monaco.editor.ITextModel;

    ngOnDestroy() {
        this.disposables.forEach(d => d.dispose());
    }

    onCreateEditor(editor: monaco.editor.IStandaloneCodeEditor) {
        editor.updateOptions({
            minimap: {
                side: 'left'
            }
        });

        this.model = this.model || monaco.editor.createModel('print("Hello world")', 'python');
  
        editor.setModel(this.model);

        this.disposables.push(
            this.model.onDidChangeContent(e => {
                console.log(this.model.getValue());
            })
        );

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, (e) => {
            console.log('SAVE');
        });
    }

}
```

```html
<!-- example.component.html -->

<nge-monaco-editor
  style="--editor-height: 200px;"
  (ready)="onCreateEditor($event)">
</nge-monaco-editor>
```

#### nge-monaco-diff-editor

```typescript
// example.component.ts

import { Component } from '@angular/core';

@Component({
    selector: 'app-example',
    templateUrl: './example.component.html',
    styleUrls: ['./example.component.scss'],
})
export class ExampleComponent {
    private originalModel?: monaco.editor.ITextModel;
    private modifiedModel?: monaco.editor.ITextModel;

    onCreateEditor(editor: monaco.editor.IStandaloneDiffEditor) {
        editor.updateOptions({
            renderSideBySide: true
        });

        this.originalModel = this.originalModel || monaco.editor.createModel('print("Hello world !!!")', 'python');

        this.modifiedModel = this.modifiedModel || monaco.editor.createModel('print("hello world")', 'python');
  
        editor.setModel({
            original: this.originalModel,
            modified: this.modifiedModel
        });
    }

}
```

```html
<!-- example.component.html -->

<nge-monaco-diff-editor
  style="--editor-height: 200px;"
  (ready)="onCreateEditor($event)">
</nge-monaco-diff-editor>
```

#### nge-monaco-viewer

```typescript
// example.component.ts

import { Component } from '@angular/core';

@Component({
    selector: 'app-example',
    templateUrl: './example.component.html',
    styleUrls: ['./example.component.scss'],
})
export class ExampleComponent implement OnDestroy {
  code = 'print("Hello world !!!")';
}
```

```html
<!-- example.component.html -->

<!-- DYNAMIC CODE -->
<nge-monaco-viewer [language]="python" [code]="code"></nge-monaco-viewer>

<!-- STATIC CODE -->
<nge-monaco-viewer [language]="'markdown'" [lines]="'1 4-7 10'" [highlights]="'2-5'" ngPreserveWhitespaces>
# H1
## H2
### H3
#### H4
##### H5
###### H6

Alternatively, for H1 and H2, an underline-ish style:

Alt-H1
======

Alt-H2
------
</nge-monaco-viewer>
```

## Configuration

Optionally, nge-monaco can be configured by passing **NgeMonacoConfig** object to the forRoot method of **NgeMonacoModule**.

```diff
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
+ import { NgeMonacoModule } from 'nge-monaco';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
+    NgeMonacoModule.forRoot({ // use forRoot() in main app module only.
+       assets: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0' // base path for monaco editor
+       locale: 'fr', // editor ui language
+       options: { // default options passed to monaco editor instances https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
+          scrollBeyondLastLine: false
+       },
+       theming: {
+         themes: [ // custom themes (see theming section for more information)
+           'assets/themes/nord.json',
+           'assets/themes/github.json',
+           'assets/themes/one-dark-pro.json',
+         ],
+         default: 'github' // default theme
+       }
+    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Theming

This library comes with a set of custom themes for monaco editor taken from [https://github.com/brijeshb42/monaco-themes/tree/master/themes](https://github.com/brijeshb42/monaco-themes/tree/master/themes) that can be added to the libray by using `NgeMonacoModule.forRoot()` method.

### Add the glob to assets in angular.json

```diff
{
  "apps": [
    {
      "assets": [
+        { "glob": "**/*", "input": "./node_modules/nge-monaco/assets/themes", "output": "./assets/themes/" }
      ],
      ...
    }
    ...
  ],
  ...
}
```

### Register the themes you want to use

```diff
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
+ import { NgeMonacoModule, NGE_THEMES } from 'nge-monaco';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
+    NgeMonacoModule.forRoot({
+       theming: {
+         /* // use a subset of themes
+         themes: [ // custom themes
+           'assets/themes/nord.json',
+           'assets/themes/github.json',
+           'assets/themes/one-dark-pro.json',
+         ],
+         */
+         themes: NGE_THEMES.map(theme => 'assets/themes/' + theme), // use all themes
+         default: 'github' // default theme
+       }
+    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

#### Use the API to change the theme

```html
<!-- example.component.html -->

<select name="theme" id="theme" (change)="switchTheme($event.target.value)">
  <ng-container *ngFor="let theme of themes|async" >
    <option [value]="theme">{{ theme }}</option>
  </ng-container>
</select>

<nge-monaco-editor
  style="--editor-height: 200px"
  (ready)="onCreateEditor($event)">
</nge-monaco-editor>

```

```typescript
// example.component.ts

import { Component } from '@angular/core';
import { NgeMonacoThemeService } from 'nge-monaco';

@Component({
    selector: 'app-example',
    templateUrl: './example.component.html',
    styleUrls: ['./example.component.scss'],
})
export class ExampleComponent {
    themes = this.theming.themesChanges;

    constructor(
        private readonly theming: NgeMonacoThemeService
    ) {}

    onCreateEditor(editor: monaco.editor.IStandaloneCodeEditor) {
        editor.setModel(monaco.editor.createModel('print("Hello world")', 'python'));
    }

    async switchTheme(theme: string) {
        this.theming.setTheme(theme);
    }
}

```

## Extensions

To extends monaco editor api once the editor is loaded, this library expose the injection token `NGE_MONACO_CONTRIBUTION`.

```diff
import { NgModule, Injectable, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

+ import { NgeMonacoModule, NgeMonacoContribution, NGE_MONACO_CONTRIBUTION } from 'nge-monaco';

@Injectable() // use injectable only if you want to use angular dependency injection.
class MyContribution implements NgeMonacoContribution {

  constructor(
    private readonly injector: Injector,
    // use angular dependency injector to inject whatever you want.
  ) {}

  activate(): void | Promise<void> {
    // use monaco object from window.monaco to extends monaco editor api.

    monaco.languages.register({ id: 'mySpecialLanguage' });

    // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider('mySpecialLanguage', {
      tokenizer: {
        root: [
          [/\[error.*/, "custom-error"],
          [/\[notice.*/, "custom-notice"],
          [/\[info.*/, "custom-info"],
          [/\[[a-zA-Z 0-9:]+\]/, "custom-date"],
        ]
      }
    });
  }

  deactivate(): void | Promise<void> {
    // free the disposables and subscriptions here
  }

}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
+   NgeMonacoModule.forRoot({}),
  ],
  providers: [
+    { provide: NGE_MONACO_CONTRIBUTION, multi: true, useClass: MyContribution },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Load Monaco Editor from your own server

By default the libray load monaco editor from the cdn [https://cdn.jsdelivr.net/npm/monaco-editor@0.20.0](https://cdn.jsdelivr.net/npm/monaco-editor@0.20.0). So if you want to load monaco editor from your serve, you must add monaco editor assets to you assets folder
by using a glob pattern in angular.json and change the value of `assets` property of `NgeMonacoConfig` object inside the `forRoot` method.

### Update angular.json

```diff
{
  "apps": [
    {
      "assets": [
+        { "glob": "**/*", "input": "./node_modules/nge-monaco/assets/monaco", "output": "./assets/monaco/" }
      ],
      ...
    }
    ...
  ],
  ...
}
```

### Change the configuration

```diff
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
+ import { NgeMonacoModule } from 'nge-monaco';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
+    NgeMonacoModule.forRoot({
+       assets: 'assets/monaco'
+    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Links

[Monaco Editor](https://github.com/Microsoft/monaco-editor/)<br/>
[Monaco Editor Options](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html)

## Contribution

Contributions are always welcome. <br/>

Please read our [CONTRIBUTING.md](https://github.com/mciissee/nge-monaco/blob/master/CONTRIBUTING.md) first. You can submit any ideas as [pull requests](https://github.com/mciissee/nge-monaco/pulls) or as [GitHub issues](https://github.com/mciissee/nge-monaco/issues).

Please just make sure that ...

Your code style matches with the rest of the project

Unit tests pass

Linter passes

## Support Development

The use of this library is totally free and no donation is required.

As the owner and primary maintainer of this project, I am putting a lot of time and effort beside my job, my family and my private time to bring the best support I can by answering questions, addressing issues and improving the library to provide more and more features over time.

If this project has been useful, that it helped you or your business to save precious time, don't hesitate to give it a star and to consider a donation to support its maintenance and future development.

## License

MIT © [Mamadou Cisse](https://github.com/mciissee)
