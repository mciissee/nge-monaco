import { Injectable } from '@angular/core';
import { NgeMonacoLoaderService } from './monaco-loader.service';
import { NgeMonacoThemeService } from './monaco-theme.service';

@Injectable({providedIn: 'root'})
export class NgeMonacoColorizerService {

    constructor(
        private readonly loader: NgeMonacoLoaderService,
        private readonly theming: NgeMonacoThemeService,
    ) {}

    async colorizeElement(options: NgeMonacoColorizeOptions) {
        const { element } = options;
        element.innerHTML = this.escapeHtml(options.code || '');
        element.style.padding = '4px';
        element.style.display = 'block';

        await this.loader.loadAsync();
        await monaco.editor.colorizeElement(element, {
            mimeType: options.language || 'plaintext',
            theme: this.theming.theme?.themeName || 'vs',
        });

        this.highlightLines(options);
        this.showLineNumbers(options);
    }

    private escapeHtml(input: string) {
        const map: any = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;'
        };
        return input.replace(/[&<>]/g, (tag) => map[tag] || tag);
    }

    private highlightLines(options: NgeMonacoColorizeOptions) {
        if (!options.highlights) {
            return;
        }

        const { element } = options;

        const linesToHighlight = this.lineNumbersFromString(options.highlights);

        let newLine = true;
        let lineNumber = 1;
        element.childNodes.forEach((e) => {
            const node = e as HTMLElement;
            if (newLine) {
                const div = document.createElement('div');
                div.style.height = '18px';
                if (linesToHighlight.includes(lineNumber)) {
                    div.classList.add('rangeHighlight');
                    div.classList.add('selected-text');
                }
                element.insertBefore(div, node);
                element.removeChild(node);
                div.appendChild(node);
                newLine = false;
            }
            else if (node.tagName === 'BR') {
                lineNumber++;
                newLine = true;
            }
        });
        Array.from(element.getElementsByTagName('br')).forEach(node => node.remove());
    }

    private showLineNumbers(options: NgeMonacoColorizeOptions) {
        if (!options.lines) {
            return;
        }

        const { element } = options;

        const linesToShow = this.lineNumbersFromString(options.lines || '');

        const linesContainer = ['<div style="padding:0  12px; text-align: right;">'];
        const startingAt = linesToShow.length === 1;
        const linesCount =  (options.code || '').split('\n').length;
        for (let i = 0; i < linesCount - 1; i++) {
            let lineNum = '';
            if (linesToShow.includes(i + 1) || (startingAt && (i + 1) >= linesToShow[0])) {
                lineNum = '' + (i + 1);
            }
            linesContainer.push(`<div class="line-numbers" style="height: 18px">${lineNum}</div>`);
        }
        linesContainer.push('</div>');

        element.style.display = 'flex';
        element.innerHTML = `${linesContainer.join('')}<div style="flex: 1;">${element.innerHTML}</div>`;
    }

    private lineNumbersFromString(input: string): number[] {
        const tokens = (input || '')
            .trim()
            .split(' ');
        const lines: number[] = [];
        for (const token of tokens) {
            if (token.includes('-')) {
                const range = token.split('-');
                const start = Number.parseInt(range[0], 10);
                const end = Number.parseInt(range[1], 10);
                if (start && end) {
                    for (let i = start; i <= end; i++) {
                        if (!lines.includes(i)) {
                            lines.push(i);
                        }
                    }
                }
            } else {
                const n = Number.parseInt(token, 10);
                if (n) {
                    lines.push(n);
                }
            }
        }
        return lines;
    }

}

export interface NgeMonacoColorizeOptions {
    element: HTMLElement;
    /** code to highlight */
    code: string;
    /** target language (default plaintext) */
    language?: string;
    /** show line numbers? */
    lines?: string;
    /** space separated list of line numbers to highlight */
    highlights?: string;
}