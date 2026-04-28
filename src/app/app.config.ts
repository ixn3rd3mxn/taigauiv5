import {provideTaiga, tuiValidationErrorsProvider} from '@taiga-ui/core';
import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        provideHttpClient(withFetch()),
        provideTaiga(),
        tuiValidationErrorsProvider({
            required: 'กรุณาเลือกข้อมูล',
        }),
    ],
};