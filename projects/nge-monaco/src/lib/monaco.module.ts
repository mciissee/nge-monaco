import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgeMonacoDiffEditorComponent } from './components/monaco-diff-editor/monaco-diff-editor.component';
import { NgeMonacoEditorComponent } from './components/monaco-editor/monaco-editor.component';
import { NgeMonacoViewerComponent } from './components/monaco-viewer/monaco-viewer.component';
import { NgeMonacoConfig, NGE_MONACO_CONFIG } from './models/monaco-config';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        NgeMonacoEditorComponent,
        NgeMonacoDiffEditorComponent,
        NgeMonacoViewerComponent],
    declarations: [
        NgeMonacoEditorComponent,
        NgeMonacoDiffEditorComponent,
        NgeMonacoViewerComponent
    ],
})
export class NgeMonacoModule {
    static forRoot(config: NgeMonacoConfig): ModuleWithProviders<NgeMonacoModule> {
        return  {
            ngModule: NgeMonacoModule,
            providers: [
                { provide: NGE_MONACO_CONFIG, useValue: config }
            ]
        };
    }
}
