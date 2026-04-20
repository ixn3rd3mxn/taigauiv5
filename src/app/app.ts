import {isPlatformBrowser, KeyValuePipe, NgTemplateOutlet} from '@angular/common';
import {TuiHovered, TuiPlatform, tuiSum} from '@taiga-ui/cdk';
import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    OnDestroy,
    PLATFORM_ID,
    signal,
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {TuiDay} from '@taiga-ui/cdk';
import {
    TuiButton,
    TuiCell,
    TuiDataList,
    TuiDropdown,
    TuiIcon,
    TuiRoot,
    TuiTextfield,
    TuiTitle,
    TuiInput,
    TuiLink,
    TUI_MONTHS,
    TUI_SHORT_WEEK_DAYS,
} from '@taiga-ui/core';
import {
    TuiAvatar,
    TuiBadge,
    TuiChevron,
    TuiDataListDropdownManager,
    TuiDataListWrapper,
    TuiFade,
    TuiInputDate,
    TuiSelect,
    TuiSwitch,
    TuiTabs,
    TuiBreadcrumbs,
} from '@taiga-ui/kit';
import {TuiCardLarge, TuiForm, TuiHeader, TuiNavigation} from '@taiga-ui/layout';
import {SettingsComponent} from './settings/settings.component';
import {TuiLegendItem, TuiRingChart} from '@taiga-ui/addon-charts';
import {TuiAmountPipe} from '@taiga-ui/addon-commerce';

const ICON =
    "data:image/svg+xml,%0A%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='32' height='32' rx='8' fill='url(%23paint0_linear_2036_35276)'/%3E%3Cmask id='mask0_2036_35276' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='6' y='5' width='20' height='21'%3E%3Cpath d='M18.2399 9.36607C21.1347 10.1198 24.1992 9.8808 26 7.4922C26 7.4922 21.5645 5 16.4267 5C11.2888 5 5.36726 8.69838 6.05472 16.6053C6.38707 20.4279 6.65839 23.7948 6.65839 23.7948C8.53323 22.1406 9.03427 19.4433 8.97983 16.9435C8.93228 14.7598 9.55448 12.1668 12.1847 10.4112C14.376 8.94865 16.4651 8.90397 18.2399 9.36607Z' fill='url(%23paint1_linear_2036_35276)'/%3E%3Cpath d='M11.3171 20.2647C9.8683 17.1579 10.7756 11.0789 16.4267 11.0789C20.4829 11.0789 23.1891 12.8651 22.9447 18.9072C22.9177 19.575 22.9904 20.2455 23.2203 20.873C23.7584 22.3414 24.7159 24.8946 24.7159 24.8946C23.6673 24.5452 22.8325 23.7408 22.4445 22.7058L21.4002 19.921L21.2662 19.3848C21.0202 18.4008 20.136 17.7104 19.1217 17.7104H17.5319L17.6659 18.2466C17.9119 19.2306 18.7961 19.921 19.8104 19.921L22.0258 26H10.4754C10.7774 24.7006 12.0788 23.2368 11.3171 20.2647Z' fill='url(%23paint2_linear_2036_35276)'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_2036_35276)'%3E%3Crect x='4' y='4' width='24' height='24' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear_2036_35276' x1='0' y1='0' x2='32' y2='32' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23A681D4'/%3E%3Cstop offset='1' stop-color='%237D31D4'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint1_linear_2036_35276' x1='6.0545' y1='24.3421' x2='28.8119' y2='3.82775' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0.0001' stop-opacity='0.996458'/%3E%3Cstop offset='0.317708'/%3E%3Cstop offset='1' stop-opacity='0.32'/%3E%3C/linearGradient%3E%3ClinearGradient id='paint2_linear_2036_35276' x1='6.0545' y1='24.3421' x2='28.8119' y2='3.82775' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0.0001' stop-opacity='0.996458'/%3E%3Cstop offset='0.317708'/%3E%3Cstop offset='1' stop-opacity='0.32'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E%0A";

const DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const MONTHS = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
    'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
    'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

function getShift(date: Date): string {
    const h = date.getHours();
    const m = date.getMinutes();
    const total = h * 60 + m;
    if (total >= 8 * 60 + 30 && total < 16 * 60 + 30) return 'เช้า';
    if (total >= 16 * 60 + 30 || total < 30) return 'บ่าย';
    return 'ดึก';
}

@Component({
    selector: 'app-root',
    imports: [
        FormsModule,
        KeyValuePipe,
        NgTemplateOutlet,
        RouterLink,
        TuiAvatar,
        TuiBadge,
        TuiButton,
        TuiCardLarge,
        TuiCell,
        TuiChevron,
        TuiDataList,
        TuiDataListDropdownManager,
        TuiDataListWrapper,
        TuiDropdown,
        TuiFade,
        TuiForm,
        TuiHeader,
        TuiIcon,
        TuiInputDate,
        TuiNavigation,
        TuiPlatform,
        TuiRoot,
        TuiSelect,
        TuiSwitch,
        TuiTabs,
        TuiTextfield,
        TuiTitle,
        TuiBreadcrumbs,
        TuiInput,
        TuiLink,
        TuiAmountPipe,
        TuiHovered,
        TuiLegendItem,
        TuiRingChart,
        SettingsComponent,
    ],
    templateUrl: './app.html',
    styleUrl: './app.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: TUI_MONTHS,
            useValue: signal([
                'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
                'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
                'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
            ] as const),
        },
        {
            provide: TUI_SHORT_WEEK_DAYS,
            useValue: signal([
                'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.',
            ] as const),
        },
    ],
})
export class App implements OnDestroy {
    private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    private readonly now = signal(new Date());
    private readonly intervalId: ReturnType<typeof setInterval> | null = null;

    protected readonly timeString = computed(() =>
        this.now().toLocaleTimeString('th-TH', {hour12: false}),
    );

    protected readonly dateString = computed(() => {
        const d = this.now();
        const day = DAYS[d.getDay()];
        const date = d.getDate();
        const month = MONTHS[d.getMonth()];
        const year = d.getFullYear() + 543;
        return `วัน${day}ที่ ${date} ${month} ${year}`;
    });

    protected readonly shift = computed(() => `เวร${getShift(this.now())}`);

    constructor() {
        if (this.isBrowser) {
            this.intervalId = setInterval(() => this.now.set(new Date()), 1000);
        }
    }

    ngOnDestroy(): void {
        if (this.intervalId !== null) clearInterval(this.intervalId);
    }

    protected readonly dateMin = new TuiDay(2026, 2, 16);
    protected readonly dateMax = new TuiDay(2031, 11, 31);
    protected dateValue = TuiDay.currentLocal();
    protected readonly shifts = ['เช้า', 'บ่าย', 'ดึก'];
    protected selectedShift: string | null = getShift(new Date());

    protected readonly expanded = signal(false);
    protected open = false;
    protected switch = false;
    protected readonly routes: any = {};
    protected readonly breadcrumbs = ['Home', 'Angular', 'Repositories', 'Taiga UI'];

    protected readonly drawer = {
        Components: [
            {name: 'Button', icon: ICON},
            {name: 'Input', icon: ICON},
            {name: 'Tooltip', icon: ICON},
        ],
        Essentials: [
            {name: 'Getting started', icon: ICON},
            {name: 'Showcase', icon: ICON},
            {name: 'Typography', icon: ICON},
        ],
    };

    protected chartActiveItemIndex = Number.NaN;
    protected readonly chartValue = [99, 88, 77];
    protected readonly chartSum = tuiSum(...this.chartValue);
    protected readonly chartLabels = ['เช้า', 'บ่าย', 'ดึก'];

    protected isChartItemActive(index: number): boolean {
        return this.chartActiveItemIndex === index;
    }

    protected onChartHover(index: number, hovered: boolean): void {
        this.chartActiveItemIndex = hovered ? index : Number.NaN;
    }

    protected handleToggle(): void {
        this.expanded.update((e) => !e);
    }

    protected resetToToday(): void {
        this.dateValue = TuiDay.currentLocal();
        this.selectedShift = getShift(new Date());
    }
}
