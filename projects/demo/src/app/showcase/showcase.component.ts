import { Component, OnDestroy, OnInit, } from '@angular/core';
import { NgeMonacoTheme, NgeMonacoThemeService } from 'nge-monaco';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-showcase',
    templateUrl: './showcase.component.html',
    styleUrls: ['./showcase.component.scss'],
})
export class ShowcaseComponent implements OnInit, OnDestroy {
    private readonly disposables: monaco.IDisposable[] = [];
    private readonly subscriptions: Subscription[] = [];
    private model?: monaco.editor.ITextModel;
    private originalModel?: monaco.editor.ITextModel;
    private modifiedModel?: monaco.editor.ITextModel;

    themes = this.theming.themesChanges;
    theme?: NgeMonacoTheme;

    constructor(
        private readonly theming: NgeMonacoThemeService
    ) {}

    ngOnInit() {
        this.subscriptions.push(
            this.theming.themeChanges.subscribe(theme => {
                this.theme = theme;
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.disposables.forEach(d => d.dispose());
    }

    onCreateEditor(editor: monaco.editor.IStandaloneCodeEditor) {
        editor.updateOptions({
            scrollbar: {
                horizontalScrollbarSize: 4,
                verticalScrollbarSize: 4
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
