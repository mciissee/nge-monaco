import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    code = [
    'from random import randint',
    'print(randint(0, 10))'
    ].join('\n');

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
