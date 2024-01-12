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

  getFilieres(query: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.url}/suggestionFilieres?query=${query}`
    );
  }

  getNiveau(query: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.url}/suggestionNiveaux?query=${query}`
    );
  }

  getEcole(query: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.url}/suggestionNiveaux?query=${query}`
    );
  }
  getTypeEcoles(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/suggestionTypeEcoles?query=${query}`);
  }
}
