import { Component, OnInit } from "@angular/core";
import { OnlineClassInterface } from "../../interfaces/online-class.interface";
import { Observable } from "rxjs";
import { OnlineClassesService2 } from "../../online-classes.service2";

@Component({
  selector: "app-online-classes-list",
  templateUrl: "./online-classes-list.component.html",
  styleUrls: ["./online-classes-list.component.sass"],
})
export class OnlineClassesListComponent implements OnInit {
  public classesList$: Observable<OnlineClassInterface[]>;

  constructor(public onlineClassesService: OnlineClassesService2) {
    this.classesList$ = this.onlineClassesService.classesList$ as Observable<
      OnlineClassInterface[]
    >;
  }

  ngOnInit(): void {}
}
