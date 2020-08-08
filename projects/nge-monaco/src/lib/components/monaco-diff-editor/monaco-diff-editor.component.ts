import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnDestroy, Output, ViewChild, Input } from '@angular/core';
import { NgeMonacoLoaderService } from '../../services/monaco-loader.service';
import { NgeMonacoService } from '../../services/monaco.service';

@Component({
  selector: 'nge-monaco-diff-editor',
  templateUrl: './monaco-diff-editor.component.html',
  styleUrls: ['./monaco-diff-editor.component.scss']
})
export class NgeMonacoDiffEditorComponent implements AfterViewInit, OnDestroy {
    @ViewChild('container') container: ElementRef<HTMLElement>;

    @Output() ready = new EventEmitter<monaco.editor.IEditor>();

    private editor?: monaco.editor.IStandaloneDiffEditor;

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
        this.editor = monaco.editor.createDiffEditor(
            this.container.nativeElement,
            this.api.defaultOptions
        );
        this.ready.emit(this.editor);
    }

}
