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

### Configuration

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
+         paths: [ // custom themes (see theming section for more information)
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

### Theming

This library comes with a set of custom themes for monaco editor taken from 

### Extensions

