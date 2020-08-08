import { Inject, Injectable, OnDestroy, Optional } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgeMonacoLanguage, NGE_MONACO_LANGUAGES } from '../models/monaco-languages';
import { NgeMonacoConfig, NGE_MONACO_CONFIG } from '../models/monaco-config';
import { NgeMonacoTheme, NGE_MONACO_THEMES } from '../models/monaco-themes';
import { NgeMonacoLoaderService } from './monaco-loader.service';

@Injectable({providedIn: 'root'})
export class NgeMonacoService implements OnDestroy {
    private readonly disposables: monaco.IDisposable[] = [];
    private readonly subscriptions: Subscription[] = [];

    /**
     * Gets the default options to pass to and editor during it's creation.
     */
    get defaultOptions() {
        return this.config?.options || {};
    }

    constructor(
        @Optional()
        @Inject(NGE_MONACO_CONFIG)
        private readonly config: NgeMonacoConfig,
        @Optional()
        @Inject(NGE_MONACO_THEMES)
        private readonly themes: NgeMonacoTheme[],
        @Optional()
        @Inject(NGE_MONACO_LANGUAGES)
        private readonly languages: NgeMonacoLanguage[],
        private readonly loader: NgeMonacoLoaderService,
    ) {
        this.themes = themes || [];
        this.languages = languages || [];
        this.subscriptions.push(
            this.loader.onLoadMonaco.subscribe(() => {
                this.onLoadMonaco();
            })
        );
    }

    ngOnDestroy() {
        this.disposables.forEach(e => e.dispose());
        this.disposables.splice(0, this.disposables.length);

        this.subscriptions.forEach(e => e.unsubscribe());
        this.subscriptions.splice(0, this.subscriptions.length);
    }

    private onLoadMonaco() {
        this.registerThemes();
        this.registerLanguages();

        this.disposables.push(
            monaco.editor.onDidCreateEditor((editor) => {
                this.preventSymbolDuplicationOnCompositionEnd(editor);
            })
        );
    }

    private registerThemes() {
        if (this.themes) {
            this.themes.forEach(theme => {
                monaco.editor.defineTheme(theme.id, {
                    base: theme.base,
                    inherit: theme.inherit,
                    rules: theme.rules,
                    colors: theme.colors as any
                });
            });
        }
    }

    private registerLanguages() {
         this.languages.forEach(language => {
            monaco.languages.register({
                id: language.id,
                extensions: language.extensions || [],
                aliases: language.aliases || []
            });
            this.disposables.push(
                monaco.languages.onLanguage(language.id, () => {
                    monaco.languages.setMonarchTokensProvider(language.id, language.syntax());
                })
            );
            language.hoversProviders().forEach(provider => {
                monaco.languages.registerHoverProvider(language.id, provider);
            });
            language.foldingsProviders().forEach(provider => {
                monaco.languages.registerFoldingRangeProvider(language.id, provider);
            });
            language.linksProviders().forEach(provider => {
                monaco.languages.registerLinkProvider(language.id, provider);
            });
            language.completionsProviders().forEach(provider => {
                monaco.languages.registerCompletionItemProvider(language.id, provider);
            });
        });
    }

    /**
     * When a user type a composition key like ^ or \` the editor
     * enter in composition mode, then after the user type any key the editor leave
     * this composition mode an duplicate the character pressed by the user.
     *
     * This bug occurs only on some browsers like firefox and calling this method will prevent this behavior
     * by removing any extra character added by the editor between 2 calls
     * of `onDidCompositionStart` and `onDidCompositionEnd`
     * @param editor editor instance.
     */
    private preventSymbolDuplicationOnCompositionEnd(editor: monaco.editor.ICodeEditor) {
        const positions: monaco.Position[] = [];
        let disposables: monaco.IDisposable[] = [];
        disposables.push(
            editor.onDidCompositionStart(() => {
                positions.push(editor.getPosition());
            })
        );
        disposables.push(
            editor.onDidCompositionEnd(() => {
                setTimeout(() => {
                    if (!positions.length) {
                        return;
                    }

                    const before = positions[0];
                    const after = editor.getPosition();
                    positions.splice(0, 1);
                    const diff = after.column - before.column;
                    if (diff > 1) {
                        // unfocus the editor to leave composition
                        // mode because when the user type ` the editor
                        // leave the composition mode and begin another one
                        (document.activeElement as any)?.blur();

                        // focus the editor to let the user continue to edit the content
                        // of the editor
                        editor.focus();

                        const r = new monaco.Range(
                            after.lineNumber,
                            after.column - (diff - 1),
                            after.lineNumber,
                            after.column
                        );
                        editor.executeEdits('api', [{ range: r, text: '', forceMoveMarkers: false }]);
                    }
                });
            })
        );
        disposables.push(editor.onDidDispose(() => {
            disposables.forEach(e => e.dispose());
            disposables = null;
        }));
    }

}

