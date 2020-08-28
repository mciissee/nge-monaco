# NGE Monaco

ngx-monaco is an [Angular](https://angular.io) library that allow you to use [Monaco Editor](https://microsoft.github.io/monaco-editor/) in your projects.

Demo available at [https://mciissee.github.io/nge-monaco/](https://mciissee.github.io/nge-monaco/)

## Installation

To add ngx-monoaco library to your package.json use the following command.

```shell
npm i --save nge-monaco monaco-editor
```

## Configuration

You must import NgeMonacoModule inside your main application module (usually named AppModule) with forRoot to be able to use ngx-monaco components.

```diff
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
+ import { NgeMonacoModule } from 'nge-monaco';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
+   NgeMonacoModule.forRoot(),  // use forRoot() in main app module only.
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### NgeMonacoConfig

Optionally, nge-monaco can be configured by passing NgeMonacoConfig object to the forRoot method of NgeMonacoModule.

```diff
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
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
+       options: { // default options passed to monaco editor instances
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
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Usage

### ngx-monaco-editor component

Component to display monaco editor instance.

This library is designed in a way that you have a total control of the editor instance so the component
does not expose a ngModel input to bind a variable to the editor content, you must attach a TextModel
to the editor by yourself using by calling `monaco.editor.createModel` by yourself.

This is a design choice since this component is intended to be as simple as possible.

```typescript
import { Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implement OnDestroy {
    private readonly disposables: monaco.IDisposable[] = [];
    private model?: monaco.editor.ITextModel;

    ngOnDestroy() {
        this.disposables.forEach(d => d.dispose()); // DONT FORGET TO DISPOSE THE DISPOABLES
    }

    onCreateEditor(editor: monaco.editor.IStandaloneCodeEditor) {
        editor.updateOptions({
            minimap: {
                side: 'left'
            }
        });

        editor.setModel(
          this.model || monaco.editor.createModel('print("Hello world")', 'python')
        );
        this.model = editor.getModel();

        this.disposables.push(
            this.model.onDidChangeContent(e => {
                console.log(this.model.getValue());
            })
        );

        // tslint:disable-next-line: no-bitwise
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, (e) => {
            console.log('SAVE');
        });
    }

}
```

app.component.html

```html
<nge-monaco-editor
  style="--editor-height: 200px;"
  (ready)="onCreateEditor($event)">
</nge-monaco-editor>
```

### ngx-monaco-diff-editor component

app.component.ts

```typescript
import { Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implement OnDestroy {
    private readonly disposables: monaco.IDisposable[] = [];

    private originalModel?: monaco.editor.ITextModel;
    private modifiedModel?: monaco.editor.ITextModel;

    ngOnDestroy() {
        this.disposables.forEach(d => d.dispose()); // DONT FORGET TO DISPOSE THE DISPOABLES
    }

    onCreateEditor(editor: monaco.editor.IStandaloneDiffEditor) {
        editor.updateOptions({
            renderSideBySide: true
        });

        editor.setModel({
            original: this.originalModel || monaco.editor.createModel('print("Hello world !!!")', 'python'),
            modified: this.modifiedModel || monaco.editor.createModel('print("hello world")', 'python')
        });

        this.originalModel = editor.getOriginalEditor().getModel();
        this.modifiedModel = editor.getModifiedEditor().getModel();
    }

}
```

app.component.html

```html
<nge-monaco-diff-editor
  style="--editor-height: 200px;"
  (ready)="onCreateEditor($event)">
</nge-monaco-diff-editor>
```

### ngx-monaco-viewer component

app.component.ts

```typescript
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implement OnDestroy {
  code = 'print("Hello world !!!")';
}
```

app.component.html

```html
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
