import { Injectable } from '@angular/core';
import { RootService } from './services/root.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SuggestionService extends RootService {
  getSuggestions(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/suggestions?query=${query}`);
  }
}
