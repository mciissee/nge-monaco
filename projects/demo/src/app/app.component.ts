import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgeMonacoThemeService } from 'nge-monaco';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    subscription?: Subscription;

    code = [
    'from random import randint',
    'print(randint(0, 10))'
    ].join('\n');

    T =
`# H1
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
` ;

    themes = this.theming.themesChanges;

    constructor(
        private readonly theming: NgeMonacoThemeService
    ) {}

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }

    onCreateEditor(editor: monaco.editor.IStandaloneCodeEditor) {
        editor.setModel(monaco.editor.createModel('', 'javascript'));
    }

    onCreateDiffEditor(editor: monaco.editor.IStandaloneDiffEditor) {
        editor.updateOptions({
            renderSideBySide: true
        });
        editor.setModel({
            original: monaco.editor.createModel('from random import', 'python'),
            modified: monaco.editor.createModel('from random import randint', 'python')
        });
    }

    async switchTheme(theme: string) {
        this.theming.setTheme(theme);
    }
}
