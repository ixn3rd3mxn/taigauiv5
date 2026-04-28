import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';

export interface ShiftAssignment {
    date: string;
    shift_id: number;
    rescue_ids: number[];
}

@Injectable({providedIn: 'root'})
export class ShiftAssignmentService {
    private readonly http = inject(HttpClient);

    get(date: string, shiftId: number): Observable<ShiftAssignment> {
        const params = new HttpParams().set('date', date).set('shift_id', shiftId);
        return this.http.get<ShiftAssignment>('http://localhost:8000/shift-assignment', {params});
    }

    save(data: ShiftAssignment): Observable<{message: string; saved_at: string}> {
        return this.http.post<{message: string; saved_at: string}>(
            'http://localhost:8000/shift-assignment',
            data,
        );
    }
}
