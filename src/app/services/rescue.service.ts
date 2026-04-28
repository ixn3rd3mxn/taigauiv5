import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';

export interface RescueMember {
    rescue_id: number;
    rescue_name: string;
}

@Injectable({providedIn: 'root'})
export class RescueService {
    private readonly http = inject(HttpClient);

    getAll(): Observable<RescueMember[]> {
        return this.http.get<RescueMember[]>('http://localhost:8000/rescue');
    }
}
