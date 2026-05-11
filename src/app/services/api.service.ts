import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {forkJoin, map, Observable} from 'rxjs';

export interface RescueMember {
    rescue_id: number;
    rescue_name: string;
}

export interface ChangeEntry {
    added: number[];
    removed: number[];
    saved_at: string;
}

export interface ShiftAssignmentResult {
    date: string;
    shift_id: number;
    rescue_ids: number[];
    saved_at?: string;
    changes?: ChangeEntry[];
}

export interface IncidentSummary {
    total: number;
    'แจ้งเหตุ': {
        total: number;
        '1669': number;
        '2nd': number;
        'วิทยุ': number;
        trauma: number;
        non_trauma: number;
    };
    'แจ้งเพิ่มเติม เหตุเดียวกัน': number;
    'ปรึกษา': number;
    'สายหลุด': number;
    'ก่อกวน': number;
}

export interface CbdCriteria {
    cbdcriteria_id: number;
    cbdcriteria_detail: string;
}

export interface CbdLevel {
    cbdlevel_id: number;
    cbdlevel_detail: string;
}

export interface IncidentRecord {
    date: string;
    shift_id: number;
    type: string;
    subtype: string | null;
    level: string | null;
    cbd_criteria: string | null;
    cbd_level: string | null;
    saved_at: string;
}

const API_URL = 'http://localhost:8000';

@Injectable({providedIn: 'root'})
export class ApiService {
    private readonly http = inject(HttpClient);

    getRescuers(): Observable<RescueMember[]> {
        return this.http.get<RescueMember[]>(`${API_URL}/rescue`);
    }

    getCbdCriteria(): Observable<CbdCriteria[]> {
        return this.http.get<CbdCriteria[]>(`${API_URL}/cbdcriteria`);
    }

    getCbdLevel(): Observable<CbdLevel[]> {
        return this.http.get<CbdLevel[]>(`${API_URL}/cbdlevel`);
    }

    getIncidentSummary(date: string, shiftId: number): Observable<IncidentSummary> {
        const params = new HttpParams().set('date', date).set('shift_id', shiftId);
        return this.http.get<IncidentSummary>(`${API_URL}/incident/summary`, {params});
    }

    getDailyShiftTotals(date: string): Observable<number[]> {
        return forkJoin([
            this.getIncidentSummary(date, 1),
            this.getIncidentSummary(date, 2),
            this.getIncidentSummary(date, 3),
        ]).pipe(map(([s1, s2, s3]) => [s3.total, s1.total, s2.total]));
    }

    getIncidentList(date: string, shiftId: number): Observable<IncidentRecord[]> {
        const params = new HttpParams().set('date', date).set('shift_id', shiftId);
        return this.http.get<IncidentRecord[]>(`${API_URL}/incident/list`, {params});
    }

    createIncident(data: {
        date: string;
        shift_id: number;
        type: string;
        subtype: string | null;
        level: string | null;
        cbd_criteria: string | null;
        cbd_level: string | null;
    }): Observable<{message: string; saved_at: string}> {
        return this.http.post<{message: string; saved_at: string}>(`${API_URL}/incident`, data);
    }

    getShiftAssignment(date: string, shiftId: number): Observable<ShiftAssignmentResult> {
        const params = new HttpParams().set('date', date).set('shift_id', shiftId);
        return this.http.get<ShiftAssignmentResult>(`${API_URL}/shift-assignment`, {params});
    }

    saveShiftAssignment(data: {
        date: string;
        shift_id: number;
        rescue_ids: number[];
    }): Observable<{message: string; saved_at: string}> {
        return this.http.post<{message: string; saved_at: string}>(
            `${API_URL}/shift-assignment`,
            data,
        );
    }

    subscribeToEvents(): EventSource {
        return new EventSource(`${API_URL}/events`);
    }
}
