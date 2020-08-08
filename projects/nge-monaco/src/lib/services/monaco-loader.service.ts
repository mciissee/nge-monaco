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
        return this.loadPromise = new Promise((resolve) => {
            let baseUrl = this.config?.assets || './assets';
            if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, baseUrl.length - 1);
            }
            const w = window as any;
            const onGotAmdLoader = () => {
                w.require.config({ paths: { vs: baseUrl + '/monaco/min/vs' }});
                if (this.config?.locale && this.config.locale !== 'en') {
                    w.require.config({
                        'vs/nls' : {
                            availableLanguages: {
                                '*': this.config?.locale,
                            }
                        }
                    });
                }
                w.require(['vs/editor/editor.main'], () => {
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
            if (!w.require) {
                const loaderScript = document.createElement('script');
                loaderScript.type = 'text/javascript';
                loaderScript.src = baseUrl + '/monaco/min/vs/loader.js';
                loaderScript.addEventListener('load', onGotAmdLoader);
                document.body.appendChild(loaderScript);
            } else {
                onGotAmdLoader();
            }
        });
    }
}
