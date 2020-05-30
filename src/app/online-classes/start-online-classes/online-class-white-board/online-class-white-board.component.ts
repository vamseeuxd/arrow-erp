import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-online-class-white-board",
  templateUrl: "./online-class-white-board.component.html",
  styleUrls: ["./online-class-white-board.component.scss"],
})
export class OnlineClassWhiteBoardComponent implements OnInit {
  @Input() imageUrl = "";

  constructor() {}

  ngOnInit(): void {}
}
