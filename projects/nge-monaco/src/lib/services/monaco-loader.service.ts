import { Inject, Injectable, OnDestroy, Optional } from '@angular/core';
import { of, Subject } from 'rxjs';
import { NgeMonacoConfig, NGE_MONACO_CONFIG } from '../models/monaco-config';

/**
 * Loads monaco editor using AMD loader.
 */
@Injectable({providedIn: 'root'})
export class NgeMonacoLoaderService implements OnDestroy {
    private readonly loaded = new Subject<typeof monaco>();
    private readonly disposables: monaco.IDisposable[] = [];

    private loadPromise?: Promise<typeof monaco>;

    constructor(
        @Optional()
        @Inject(NGE_MONACO_CONFIG)
        private readonly config: NgeMonacoConfig
    ) {}

    ngOnDestroy() {
        this.disposables.forEach(e => e.dispose());
        this.disposables.splice(0, this.disposables.length);
    }

    /**
     * Loads monaco editor if it is not loaded.
     */
    loadAsync() {
        if (this.loadPromise) {
            return this.loadPromise;
        }

        const cdn = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.20.0';
        return this.loadPromise = new Promise((resolve) => {
            const WINDOW = window as any;

            let baseUrl = this.config?.assets || cdn;

            // LOAD WEB WORKER FROM CDN IF BASE URL IS NOT DEFINED
            if (baseUrl === cdn) {
                const proxy = URL.createObjectURL(new Blob([`
                    self.MonacoEnvironment = { baseUrl: '${cdn}/min'};
                    importScripts('${cdn}/min/vs/base/worker/workerMain.min.js');
                `], { type: 'text/javascript' }));
                WINDOW.MonacoEnvironment = { getWorkerUrl: () => proxy };
            }

            if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, baseUrl.length - 1);
            }

            const onGotAmdLoader = () => {
                WINDOW.require.config({ paths: { vs: baseUrl + '/min/vs' }});

                // SETUP MONACO EDITOR UI LANGUAGE
                if (this.config?.locale && this.config.locale !== 'en') {
                    WINDOW.require.config({
                        'vs/nls' : {
                            availableLanguages: {
                                '*': this.config?.locale,
                            }
                        }
                    });
                }

                WINDOW.require(['vs/editor/editor.main'], () => {
                    resolve(this.didLoadMonaco());
                });
            };

            if (!WINDOW.require) {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = baseUrl + '/min/vs/loader.js';
                script.addEventListener('load', onGotAmdLoader);
                document.body.appendChild(script);
            } else {
                onGotAmdLoader();
            }
        });
    }

    /**
     * Call the given `observer` function to extend monaco editor functionalities
     * once it will be available in `window.monaco`.
     *
     * The function will be called immediately if monaco api is already loaded.
     * @param observer observer object.
     * @returns A subscription object that should be unsubscribed later.
     */
    onLoadMonaco(observer: (arg: typeof monaco) => void) {
        if (typeof (window as any).monaco === 'undefined') {
            return this.loaded.asObservable().subscribe(observer);
        }
        return of((window as any).monaco as typeof monaco).subscribe(observer);
    }


    private didLoadMonaco() {
        // if monaco.editor.colorizeElement is called when
        // an editor has not already beed created, monaco will not apply
        // any theme to the colorized tokens. So here we just create an editor
        // to force monaco to load the themes then destroy
        // the editor.
        const node = document.createElement('div');
        document.body.appendChild(node);
        const editor = monaco.editor.create(node);
        setTimeout(() => {
            editor.dispose();
            node.remove();
        });

        this.disposables.push(
            monaco.editor.onDidCreateEditor((e) => {
                this.preventSymbolDuplicationOnCompositionEnd(e);
            })
        );

        this.loaded.next(monaco);

        return monaco;
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
