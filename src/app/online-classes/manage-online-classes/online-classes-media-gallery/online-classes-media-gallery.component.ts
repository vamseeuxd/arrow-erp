import {
  AfterViewInit,
  Component,
  forwardRef,
  Input,
  ViewChild,
} from "@angular/core";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { MatDialog } from "@angular/material/dialog";
import { OnlineClassesAddMediaComponent } from "../online-classes-add-media/online-classes-add-media.component";
import { ONLINE_CLASS_ACTION } from "../../interfaces/online-class-action.enum";
import { OnlineClassMediaDetails } from "../../interfaces/online-class-media-details.interface";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-online-classes-media-gallery",
  templateUrl: "./online-classes-media-gallery.component.html",
  styleUrls: ["./online-classes-media-gallery.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OnlineClassesMediaGalleryComponent),
      multi: true,
    },
  ],
})
export class OnlineClassesMediaGalleryComponent
  implements ControlValueAccessor, AfterViewInit {
  constructor(public dialog: MatDialog) {}

  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder: CdkDropList;

  public items: Array<number> = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
  ];

  public target: CdkDropList;
  public targetIndex: number;
  public source: any;
  public sourceIndex: number;

  readonly OnlineClassAction = ONLINE_CLASS_ACTION;

  @Input() onlineClassMediaDetailsList: OnlineClassMediaDetails[] = [];

  onChange: (value) => {};

  onTouched: () => {};

  ngAfterViewInit() {
    setTimeout(() => {
      const phElement = this.placeholder.element.nativeElement;
      phElement.style.display = "none";
      phElement.parentNode.removeChild(phElement);
    }, 50);
  }

  drop() {
    if (!this.target) {
      return;
    }

    const phElement = this.placeholder.element.nativeElement;
    const parent = phElement.parentNode;

    phElement.style.display = "none";

    parent.removeChild(phElement);
    parent.appendChild(phElement);
    parent.insertBefore(
      this.source.element.nativeElement,
      parent.children[this.sourceIndex]
    );

    this.target = null;
    this.source = null;

    if (this.sourceIndex !== this.targetIndex) {
      moveItemInArray(
        this.onlineClassMediaDetailsList,
        this.sourceIndex,
        this.targetIndex
      );
    }
  }

  enter = (drag: CdkDrag, drop: CdkDropList) => {
    if (drop === this.placeholder) {
      return true;
    }

    const phElement = this.placeholder.element.nativeElement;
    const dropElement = drop.element.nativeElement;

    const dragIndex = __indexOf(
      dropElement.parentNode.children,
      drag.dropContainer.element.nativeElement
    );
    const dropIndex = __indexOf(dropElement.parentNode.children, dropElement);

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      const sourceElement = this.source.element.nativeElement;
      phElement.style.width = sourceElement.clientWidth + "px";
      phElement.style.height = sourceElement.clientHeight + "px";

      sourceElement.parentNode.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = "";
    dropElement.parentNode.insertBefore(
      phElement,
      dragIndex < dropIndex ? dropElement.nextSibling : dropElement
    );

    this.source.start();
    this.placeholder.enter(
      drag,
      drag.element.nativeElement.offsetLeft,
      drag.element.nativeElement.offsetTop
    );

    return false;
  };

  openDialog(action: ONLINE_CLASS_ACTION) {
    const dialogRef = this.dialog.open(OnlineClassesAddMediaComponent, {
      data: { action },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onlineClassMediaDetailsList.push({
          ...result,
          id: new Date().getTime().toString(),
        });
        this.updatePosition();
      }
    });
  }

  drop2(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.onlineClassMediaDetailsList,
      event.previousIndex,
      event.currentIndex
    );
    this.updatePosition();
  }

  deleteMediaDetails(mediaDetails: OnlineClassMediaDetails) {
    const isConfirmed = confirm("Are you sure! Do you want to delete?");
    if (isConfirmed) {
      this.onlineClassMediaDetailsList = this.onlineClassMediaDetailsList.filter(
        (value) => value.id !== mediaDetails.id
      );
      this.updatePosition();
    }
  }

  updatePosition() {
    this.onlineClassMediaDetailsList.forEach((value, position) => {
      value.position = position;
    });
    this.onChange(this.onlineClassMediaDetailsList);
  }

  editMediaDetails(
    mediaDetails: OnlineClassMediaDetails,
    action: ONLINE_CLASS_ACTION
  ) {
    const dialogRef = this.dialog.open(OnlineClassesAddMediaComponent, {
      data: { action, mediaDetails },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onlineClassMediaDetailsList = this.onlineClassMediaDetailsList.map(
          (value) => {
            if (value.id === mediaDetails.id) {
              return result;
            }
            return value;
          }
        );
        this.onChange(this.onlineClassMediaDetailsList);
      }
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: OnlineClassMediaDetails[]): void {
    if (Array.isArray(obj)) {
      this.onlineClassMediaDetailsList = obj;
    } else {
      obj = [];
      this.onlineClassMediaDetailsList = obj;
    }
  }
}

function __indexOf(collection, node) {
  return Array.prototype.indexOf.call(collection, node);
}
