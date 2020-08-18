import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgeMonacoLoaderService } from 'nge-monaco';
import { Subscription } from 'rxjs';

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

    constructor(
        private readonly monacoLoader: NgeMonacoLoaderService
    ) {}

    ngOnInit() {
        this.subscription = this.monacoLoader.onLoadMonaco((monaco) => {
            console.log('onLoadMonaco', monaco);
        });
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
}
