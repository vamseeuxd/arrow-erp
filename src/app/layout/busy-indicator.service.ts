import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class BusyIndicatorService {
    private busyIndicatorsList: number[] = [];

    show(): number {
        const indicatorId = new Date().getTime();
        this.busyIndicatorsList.push(indicatorId);
        return indicatorId;
    }

    hide(busyIndicatorId: number) {
        this.busyIndicatorsList = this.busyIndicatorsList.filter(id => id !== busyIndicatorId);
    }

    isBusyIndicator(): boolean {
        return this.busyIndicatorsList.length > 0;
    }
}
