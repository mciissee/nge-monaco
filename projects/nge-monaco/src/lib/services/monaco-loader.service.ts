import { Inject, Injectable, InjectionToken, OnDestroy, Optional } from '@angular/core';
import { of, Subject } from 'rxjs';
import { NgeMonacoConfig, NGE_MONACO_CONFIG } from '../monaco-config';
import { NgeMonacoContribution, NGE_MONACO_CONTRIBUTION } from '../contributions/monaco-contribution';

/** monaco editor cdn url hosted at cdnjs. */
export const MONACO_CDNJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2';

/** monaco editor cdn url hosted at jsdeliver. */
export const MONACO_JS_DELIVER_URL = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2';

/**
 * Loads monaco editor using AMD loader.
 */
@Injectable({providedIn: 'root'})
export class NgeMonacoLoaderService implements OnDestroy {
    private readonly loadEvent = new Subject<typeof monaco>();
    private assets = MONACO_CDNJS_URL;
    private promise?: Promise<typeof monaco>;

    constructor(
        @Optional()
        @Inject(NGE_MONACO_CONFIG)
        private readonly config: NgeMonacoConfig,

        @Optional()
        @Inject(NGE_MONACO_CONTRIBUTION)
        private readonly contributions: NgeMonacoContribution[],
    ) {
        this.contributions = contributions || [];
    }

    async ngOnDestroy() {
        await this.deactivateContributions();
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
            return this.loadEvent.asObservable().subscribe(observer);
        }
        return of((window as any).monaco as typeof monaco).subscribe(observer);
    }

    /**
     * Loads monaco editor if it is not loaded.
     */
    loadAsync() {
        if (this.promise) {
            return this.promise;
        }

        return this.promise = new Promise((resolve) => {
            const interval = setInterval(() => { // https://github.com/microsoft/monaco-editor/issues/662
                if (document.readyState !== 'complete') {
                    return;
                }

                clearInterval(interval);

                this.assets = this.config?.assets || MONACO_CDNJS_URL;
                if (this.assets.endsWith('/')) {
                    this.assets = this.assets.slice(0, this.assets.length - 1);
                }

                this.addWorkers();

                if (!(window as any).require) {
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = this.assets + '/min/vs/loader.js';
                    script.onload = () => {
                        this.onLoad(resolve);
                    };
                    document.body.appendChild(script);
                } else {
                    this.onLoad(resolve);
                }
            }, 30);
        });
    }

    private onLoad(resolve: any) {
        (window as any).require.config({
            paths: { vs: this.assets + '/min/vs' }
        });

        if (this.config?.locale && this.config.locale !== 'en') {
            (window as any).require.config({
                'vs/nls': {
                    availableLanguages: {
                        '*': this.config?.locale,
                    },
                }
            });
        }

        (window as any).require(['vs/editor/editor.main'], async () => {
            await this.activateContributions();
            this.loadEvent.next(monaco);
            resolve(monaco);
        });
    }

    private addWorkers() {
        // https://github.com/microsoft/monaco-editor/blob/master/docs/integrate-amd-cross.md
        if (!this.assets.startsWith('http')) {
            return;
        }

        const proxy = URL.createObjectURL(new Blob([`
            self.MonacoEnvironment = {
                baseUrl: '${this.assets}/min'
            };
            importScripts('${this.assets}/min/vs/base/worker/workerMain.js');
        `], { type: 'text/javascript' }));
        (window as any).MonacoEnvironment = {
            baseUrl: this.assets + '/min',
            getWorkerUrl: () => proxy
        };
    }

    private async activateContributions() {
        await Promise.all(this.contributions.map(e => e.activate()));
    }

    private async deactivateContributions() {
        await Promise.all(this.contributions.map(e => {
            if (e.deactivate) {
                return e.deactivate();
            }
            return Promise.resolve();
        }));
    }
}

