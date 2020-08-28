import { Component, OnDestroy, } from '@angular/core';
import { NgeMonacoThemeService } from 'nge-monaco';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
    private readonly disposables: monaco.IDisposable[] = [];

    private model?: monaco.editor.ITextModel;
    private originalModel?: monaco.editor.ITextModel;
    private modifiedModel?: monaco.editor.ITextModel;

    themes = this.theming.themesChanges;

    constructor(
        private readonly theming: NgeMonacoThemeService
    ) {}

    ngOnDestroy() {
        this.disposables.forEach(d => d.dispose());
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

    onCreateDiffEditor(editor: monaco.editor.IStandaloneDiffEditor) {
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

    async switchTheme(theme: string) {
        this.theming.setTheme(theme);
    }
}
