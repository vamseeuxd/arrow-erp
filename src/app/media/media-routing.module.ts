import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { GalleryComponent } from "./gallery/gallery.component";
import { CarouselComponent } from "./carousel/carousel.component";
const routes: Routes = [
  {
    path: "",
    redirectTo: "gallery",
    pathMatch: "full",
  },
  {
    path: "gallery",
    component: GalleryComponent,
  },
  {
    path: "online-classes",
    component: CarouselComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MediaRoutingModule {}
