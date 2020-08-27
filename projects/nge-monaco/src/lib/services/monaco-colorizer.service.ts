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

        const tokens = (options.highlights || '')
            .trim()
            .split(' ');

        const linesToHighlight: number[] = [];
        for (const tok of tokens) {
            if (tok.includes('-')) {
                const arr = tok.split('-');
                const start = Number.parseInt(arr[0], 10);
                const end = Number.parseInt(arr[1], 10);
                if (start && end) {
                    for (let i = start; i <= end; i++) {
                        if (!linesToHighlight.includes(i)) {
                            linesToHighlight.push(i);
                        }
                    }
                }
            } else {
                const n = Number.parseInt(tok, 10);
                if (n) {
                    linesToHighlight.push(n);
                }
            }
        }


        const lineNumsToShow = (options.linenums || '')
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

        element.innerHTML = (options.code || '').replace(/[&<>]/g, replaceTag);

        element.style.padding = '4px';
        element.style.display = 'block';

        await this.loader.loadAsync();

        await monaco.editor.colorizeElement(element, {
            mimeType: options.language || 'plaintext',
            theme: this.theming.theme?.themeName || 'vs',
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
                    div.classList.add('rangeHighlight');
                    div.classList.add('selected-text');
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

        if (options.linenums) {
            const lines = ['<div style="padding:0  12px; text-align: right;">'];
            const startingAt = lineNumsToShow.length === 1;
            for (let i = 0; i < lineCounter - 1; i++) {
                let lineNum = '';
                if (lineNumsToShow.includes(i + 1) || (startingAt && (i + 1) >= lineNumsToShow[0])) {
                    lineNum = '' + (i + 1);
                }
                lines.push(`<div class="line-numbers" style="height: 18px">${lineNum}</div>`);
            }
            lines.push('</div>');
            element.style.display = 'flex';
            element.innerHTML = `${lines.join('')}<div style="flex: 1;">${element.innerHTML}</div>`;
        }
    }
}

export interface NgeMonacoColorizeOptions {
    element: HTMLElement;
    /** code to highlight */
    code: string;
    /** target language (default plaintext) */
    language?: string;
    /** show line numbers? */
    linenums?: string;
    /** space separated list of line numbers to highlight */
    highlights?: string;
}
