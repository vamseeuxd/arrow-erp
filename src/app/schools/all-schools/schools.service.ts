import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Schools } from './schools.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable()
export class SchoolsService {
  private readonly API_URL = 'assets/data/professors.json';
  dataChange: BehaviorSubject<Schools[]> = new BehaviorSubject<Schools[]>(
    []
  );
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) {}
  get data(): Schools[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /** CRUD METHODS */
  getAllSchoolss(): void {
    this.httpClient.get<Schools[]>(this.API_URL).subscribe(
      data => {
        this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      }
    );
  }
  // DEMO ONLY, you can find working methods below
  addSchools(professors: Schools): void {
    this.dialogData = professors;
  }
  updateSchools(professors: Schools): void {
    this.dialogData = professors;
  }
  deleteSchools(id: number): void {
    console.log(id);
  }
}
