import { InjectionToken } from '@angular/core';

/** Definition of a Language */
export interface NgeMonacoLanguage extends monaco.languages.ILanguageExtensionPoint {

    /**
     * Syntax highlighter of the language.
     */
    syntax(): monaco.languages.IMonarchLanguage;

    /**
     * Provides informations when the mouse hover a word inside the editor.
     */
    hoversProviders(): monaco.languages.HoverProvider[];

    /**
     * Detects links inside pl and pltp files.
     */
    linksProviders(): monaco.languages.LinkProvider[];

    /**
     * Provides folding
     */
    foldingsProviders(): monaco.languages.FoldingRangeProvider[];

    /**
     * Provides autocompletion while typing.
     */
    completionsProviders(): monaco.languages.CompletionItemProvider[];
}

export const NGE_MONACO_LANGUAGES = new InjectionToken<NgeMonacoLanguage[]>('NGE_MONACO_LANGUAGES');
