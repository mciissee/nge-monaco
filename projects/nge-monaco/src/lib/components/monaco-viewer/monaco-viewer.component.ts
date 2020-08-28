import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { NgeMonacoColorizerService } from '../../services/monaco-colorizer.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'nge-monaco-viewer',
    templateUrl: 'monaco-viewer.component.html',
    styleUrls: ['monaco-viewer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgeMonacoViewerComponent implements AfterViewInit, OnChanges, OnDestroy {
    @ViewChild('container') container?: ElementRef<HTMLElement>;
    @ViewChild('transclusion') transclusion?: ElementRef<HTMLElement>;

    /** code to highlight */
    @Input() code?: string;
    /** show line numbers? */
    @Input() lines?: string;
    /** target language */
    @Input() language?: string;
    /** space separated list of line numbers to highlight */
    @Input() highlights?: string;

    private editor?: monaco.editor.IEditor;
    private observer?: MutationObserver;
    private subscriptions: Subscription[] = [];
    private currentCode = '';

    constructor(
        private readonly colorizer: NgeMonacoColorizerService,
    ) {}

    ngAfterViewInit() {
        this.observer = new MutationObserver(this.colorize.bind(this));
        this.observer.observe(this.transclusion.nativeElement, {
            subtree: true,
            childList: true,
            characterData: true,
        });
        this.colorize();
    }

    ngOnChanges(): void {
        this.colorize();
    }

    ngOnDestroy() {
        this.editor?.dispose();
        this.observer?.disconnect();
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    private async colorize() {
        if (!this.container || !this.transclusion) {
            return;
        }

        const code = this
            .transclusion
            .nativeElement
            .innerHTML?.trim()
            || this.code;

        if (code === this.currentCode) {
            return;
        }

        this.currentCode = code;

        await this.colorizer.colorizeElement({
            code,
            element: this.container.nativeElement,
            lines: this.lines,
            language: this.language,
            highlights: this.highlights,
        });
    }

}
