import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { NgeMonacoLoaderService } from '../../services/monaco-loader.service';

@Component({
  selector: 'nge-monaco-viewer',
  templateUrl: './monaco-viewer.component.html',
  styleUrls: ['./monaco-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgeMonacoViewerComponent implements AfterViewInit, OnChanges, OnDestroy {
    @ViewChild('container') container?: ElementRef<HTMLElement>;

    /** code to highlight */
    @Input() code?: string;
    /** target language */
    @Input() language?: string;
    /** show line numbers? */
    @Input() linenums?: string;
    /** space separated list of line numbers to highlight */
    @Input() highlights?: string;

    private detectChanges = false;
    private editor?: monaco.editor.IEditor;

    constructor(
        private readonly loader: NgeMonacoLoaderService,
    ) {}

    async ngAfterViewInit() {
        await this.loader.require();
        this.colorizeElement();
    }

    ngOnChanges(_: SimpleChanges): void {
        if (this.detectChanges) {
            this.colorizeElement();
        }
    }

    ngOnDestroy() {
        this.editor?.dispose();
    }

    private async colorizeElement() {
        this.detectChanges = true;
        if (!this.container) {
            return;
        }

        const element = this.container.nativeElement;

        const linesToHighlight = (this.highlights || '')
            .trim()
            .split(' ')
            .map(e => Number.parseInt(e, 10));

        const lineNumsToShow = (this.linenums || '')
            .trim()
            .split(' ')
            .map(e => Number.parseInt(e, 10));

        const tagsToReplace: any = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };

        function replaceTag(tag: string) {
            return tagsToReplace[tag] || tag;
        }

        element.innerHTML = (this.code || '').replace(/[&<>]/g, replaceTag);
        element.style.padding = '4px';
        element.style.display = 'block';

        await monaco.editor.colorizeElement(element, {
            mimeType: this.language || 'plaintext'
        });

        const childs = element.childNodes;

        let lineCounter = 1;
        let newLine = true;

        childs.forEach((e) => {
            const node = e as HTMLElement;
            if (newLine) {
                const div = document.createElement('div');
                div.style.height = '18px';
                if (linesToHighlight.includes(lineCounter)) {
                    div.style.backgroundColor = 'rgba(96,113,164,.2)';
                }

                element.insertBefore(div, node);
                element.removeChild(node);
                div.appendChild(node);
                newLine = false;
            } else if (node.tagName === 'BR') {
                lineCounter++;
                newLine = true;
            }
        });

        Array.from(element.getElementsByTagName('br')).forEach(node => node.remove());

        if (this.linenums) {
            const lines = ['<div style="padding:0  12px; text-align: right;">'];
            const startingAt = lineNumsToShow.length === 1;
            for (let i = 0; i < lineCounter; i++) {
                let lineNum = '';
                if (lineNumsToShow.includes(i + 1) || (startingAt && (i + 1) >= lineNumsToShow[0])) {
                    lineNum = '' + (i + 1);
                }
                lines.push(`<div style="height: 18px">${lineNum}</div>`);
            }
            lines.push('</div>');
            element.style.display = 'flex';
            element.innerHTML = `
                ${lines.join('')}<div style="flex: 1;">${element.innerHTML}</div>
            `;
        }
    }

}
