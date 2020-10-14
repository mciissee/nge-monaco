import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgeDocSettings, NgeDocLinAction, NgeDocLink } from 'nge-doc';

const documentation: NgeDocSettings = {
    meta: {
        name: 'nge-monaco',
        root: '',
        logo: 'assets/images/nge.svg',
        repo: {
            name: 'nge-monaco',
            url: 'https://github.com/mciissee/nge-monaco',
        },
    },
    pages: [
        {
            title: 'Getting Started',
            href: 'getting-started',
            renderer: `assets/docs/getting-started.md`,
        },
        {
            title: 'Installation',
            href: 'installation',
            renderer: `assets/docs/installation.md`,
        },
        {
            title: 'Usage',
            href: 'usage',
            renderer: `assets/docs/usage.md`,
        },
        {
            title: 'Showcase',
            href: 'showcase',
            renderer: () => import('./showcase/showcase.module').then(m => m.ShowcaseModule)
        }
    ],
};

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('nge-doc').then(m => m.NgeDocModule),
        data: documentation,
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
@NgModule({
    imports: [RouterModule.forRoot(routes, {
        scrollOffset: [0, 64],
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
        preloadingStrategy: PreloadAllModules
    })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
