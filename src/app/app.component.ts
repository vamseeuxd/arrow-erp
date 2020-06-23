import {Component} from '@angular/core';
import {
    Event,
    Router,
    NavigationStart,
    NavigationEnd,
    RouterEvent,
} from '@angular/router';
import {PlatformLocation} from '@angular/common';
import {BusyIndicatorService} from './layout/busy-indicator.service';
import { SwUpdate } from '@angular/service-worker';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    currentUrl: string;
    showLoadingIndicator = true;

    constructor(
        public _router: Router,
        public busyIndicator: BusyIndicatorService,
        private swUpdate: SwUpdate,
        location: PlatformLocation
    ) {
        this._router.events.subscribe((routerEvent: Event) => {
            if (routerEvent instanceof NavigationStart) {
                setTimeout(() => {
                    this.showLoadingIndicator = true;
                });
                location.onPopState(() => {
                    window.location.reload();
                });
                this.currentUrl = routerEvent.url.substring(
                    routerEvent.url.lastIndexOf('/') + 1
                );
            }
            if (routerEvent instanceof NavigationEnd) {
                setTimeout(() => {
                    this.showLoadingIndicator = false;
                });
            }
            window.scrollTo(0, 0);
        });

      swUpdate.available.subscribe(event => {
        window.location.reload();
      });
    }
}
