import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Inject,
    OnDestroy,
    Optional,
    Output,
    ViewChild,
} from '@angular/core';
import { NgeMonacoConfig, NGE_MONACO_CONFIG } from '../../models/monaco-config';
import { NgeMonacoLoaderService } from '../../services/monaco-loader.service';

@Component({
    selector: 'nge-monaco-editor',
    templateUrl: './monaco-editor.component.html',
    styleUrls: ['./monaco-editor.component.scss'],
})
export class NgeMonacoEditorComponent implements AfterViewInit, OnDestroy {
    @ViewChild('container') container: ElementRef<HTMLElement>;
    @Output() ready = new EventEmitter<monaco.editor.IEditor>();

    private editor?: monaco.editor.IStandaloneCodeEditor;

    constructor(
        private readonly loader: NgeMonacoLoaderService,
        @Optional()
        @Inject(NGE_MONACO_CONFIG)
        private readonly config: NgeMonacoConfig
    ) {}

    @HostListener('window:resize')
    onResizeWindow() {
        this.editor?.layout();
    }

    ngAfterViewInit() {
        this.loader.loadAsync().then(() => {
            this.createEditor();
        });
    }

    ngOnDestroy() {
        this.editor?.dispose();
    }

    private createEditor() {
        this.editor = monaco.editor.create(
            this.container.nativeElement,
            this.config.options || {}
        );
        this.ready.emit(this.editor);
    }
}
