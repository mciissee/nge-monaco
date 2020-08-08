import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnDestroy, Output, ViewChild } from '@angular/core';
import { NgeMonacoLoaderService } from '../../services/monaco-loader.service';
import { NgeMonacoService } from '../../services/monaco.service';

@Component({
  selector: 'nge-monaco-editor',
  templateUrl: './monaco-editor.component.html',
  styleUrls: ['./monaco-editor.component.scss']
})
export class NgeMonacoEditorComponent implements AfterViewInit, OnDestroy {
    @ViewChild('container') container: ElementRef<HTMLElement>;
    @Output() ready = new EventEmitter<monaco.editor.IEditor>();

    private editor?: monaco.editor.IStandaloneCodeEditor;

    constructor(
        private readonly api: NgeMonacoService,
        private readonly loader: NgeMonacoLoaderService,
    ) { }

    @HostListener('window:resize')
    onResizeWindow() {
        this.editor?.layout();
    }

    ngAfterViewInit() {
        this.loader.require().then(() => {
            this.createEditor();
        });
    }

    ngOnDestroy() {
        this.editor?.dispose();
    }

    private createEditor() {
        this.editor = monaco.editor.create(
            this.container.nativeElement,
            this.api.defaultOptions
        );
        this.ready.emit(this.editor);
    }

}
