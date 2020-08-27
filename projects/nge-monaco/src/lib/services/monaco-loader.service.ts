import { Inject, Injectable, InjectionToken, OnDestroy, Optional } from '@angular/core';
import { of, Subject } from 'rxjs';
import { NgeMonacoConfig, NGE_MONACO_CONFIG } from '../monaco-config';
import { NgeMonacoContribution, NGE_MONACO_CONTRIBUTION } from '../contributions/monaco-contribution';

/** monaco editor cdn url hosted at cdnjs. */
export const MONACO_CDNJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0';

/** monaco editor cdn url hosted at jsdeliver. */
export const MONACO_JS_DELIVER_URL = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.20.0';

/**
 * Loads monaco editor using AMD loader.
 */
@Injectable({providedIn: 'root'})
export class NgeMonacoLoaderService implements OnDestroy {
    private readonly loadEvent = new Subject<typeof monaco>();

    private loadPromise?: Promise<typeof monaco>;

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
        if (this.loadPromise) {
            return this.loadPromise;
        }
        return this.loadPromise = new Promise((resolve) => {
            let baseUrl = this.config?.assets || MONACO_CDNJS_URL;
            if (baseUrl.endsWith('/')) {
                baseUrl = baseUrl.slice(0, baseUrl.length - 1);
            }

            this.createWebWorker(baseUrl);

            const onLoad = () => {
                (window as any).require.config({
                    paths: {
                        vs: baseUrl + '/min/vs'
                    }
                });

                this.setupLocalization();

                (window as any).require(['vs/editor/editor.main'], async () => {
                    await this.activateContributions();
                    this.loadEvent.next(monaco);
                    resolve(monaco);
                });
            };

            if (!(window as any).require) {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = baseUrl + '/min/vs/loader.js';
                script.addEventListener('load', onLoad);
                document.body.appendChild(script);
            } else {
                onLoad();
            }
        });
    }

    private async activateContributions() {
        for (const o of this.contributions) {
            await o.activate();
        }
    }

    private async deactivateContributions() {
        for (const o of this.contributions) {
            if (o.deactivate) {
                await o.deactivate();
            }
        }
    }

    private setupLocalization() {
        if (this.config?.locale && this.config.locale !== 'en') {
            (window as any).require.config({
                'vs/nls': {
                    availableLanguages: {
                        '*': this.config?.locale,
                    }
                }
            });
        }
    }

    private createWebWorker(baseUrl: string) {
        const proxy = URL.createObjectURL(new Blob([`
            self.MonacoEnvironment = {
                baseUrl: '${baseUrl}/min'
            };
            importScripts('${baseUrl}/min/vs/base/worker/workerMain.min.js');
        `], { type: 'text/javascript' }));
        (window as any).MonacoEnvironment = {
            baseUrl: baseUrl + '/min',
            getWorkerUrl: () => proxy
        };
    }
}

