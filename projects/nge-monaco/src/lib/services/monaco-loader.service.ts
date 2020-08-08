import { Inject, Injectable, Optional } from '@angular/core';
import { Subject } from 'rxjs';
import { NgeMonacoConfig, NGE_MONACO_CONFIG } from '../models/monaco-config';

/**
 * Loads monaco editor using AMD loader.
 */
@Injectable({providedIn: 'root'})
export class NgeMonacoLoaderService {
    private readonly loaded = new Subject<typeof monaco>();
    private loadPromise?: Promise<typeof monaco>;

    /**
     * Subscribe to this observable to extend monaco editor functionalities once it will be available in `window.monaco`.
     */
    get onLoadMonaco() {
        return this.loaded.asObservable();
    }

    constructor(
        @Optional()
        @Inject(NGE_MONACO_CONFIG)
        private readonly config: NgeMonacoConfig
    ) {}

    /**
     * Loads monaco editor if it is not loaded.
     */
    require() {
        if (this.loadPromise) {
            return this.loadPromise;
        }
        const cdn = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.20.0';

        return this.loadPromise = new Promise((resolve) => {
            const wind = window as any;

            let baseUrl = this.config?.assets || cdn;

            // LOAD WEB WORKER FROM CDN IF BASE URL IS NOT DEFINED
            if (baseUrl === cdn) {
                const proxy = URL.createObjectURL(new Blob([`
                    self.MonacoEnvironment = { baseUrl: '${cdn}/min'};
                    importScripts('${cdn}/min/vs/base/worker/workerMain.min.js');
                `], { type: 'text/javascript' }));
                wind.MonacoEnvironment = { getWorkerUrl: () => proxy };
            }

            if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, baseUrl.length - 1);
            }

            const onGotAmdLoader = () => {
                wind.require.config({ paths: { vs: baseUrl + '/min/vs' }});

                // SETUP MONACO EDITOR UI LANGUAGE
                if (this.config?.locale && this.config.locale !== 'en') {
                    wind.require.config({
                        'vs/nls' : {
                            availableLanguages: {
                                '*': this.config?.locale,
                            }
                        }
                    });
                }

                wind.require(['vs/editor/editor.main'], () => {
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
                    this.loaded.next();
                    resolve(monaco);
                });
            };

            if (!wind.require) {
                const loaderScript = document.createElement('script');
                loaderScript.type = 'text/javascript';
                loaderScript.src = baseUrl + '/min/vs/loader.js';
                loaderScript.addEventListener('load', onGotAmdLoader);
                document.body.appendChild(loaderScript);
            } else {
                onGotAmdLoader();
            }
        });
    }
}
