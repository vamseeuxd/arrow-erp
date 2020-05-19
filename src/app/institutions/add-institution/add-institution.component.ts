import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {InstitutionsInterface} from '../all-institutions/institutions.model';
import {Observable} from 'rxjs';
import {InstitutionsService} from '../all-institutions/institutions.service';
import {InstitutionsValidators} from '../institutions-validators/institutions.validators';
import {BusyIndicatorService} from '../../layout/busy-indicator.service';

@Component({
  selector: 'app-add-institution',
  templateUrl: './add-institution.component.html',
  styleUrls: ['./add-institution.component.sass']
})
export class AddInstitutionComponent implements AfterViewInit {
  institutionForm: FormGroup;
  institutionsCollection: AngularFirestoreCollection<InstitutionsInterface>;
  institutionsList: Observable<InstitutionsInterface[]>;
  @Input() isPage = true;
  @Input() institution: InstitutionsInterface;
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<InstitutionsInterface> = new EventEmitter<InstitutionsInterface>();
  showForm = false;

  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private busyIndicator: BusyIndicatorService,
    public institutionsService: InstitutionsService
  ) {
    this.institutionsCollection = afs.collection<InstitutionsInterface>('institutionsList');
    this.institutionsList = this.institutionsCollection.valueChanges();
  }

  ngAfterViewInit() {
    this.institutionForm = this.fb.group({
      institutionName: [(this.institution ? this.institution.institutionName : ''), [Validators.required]],
      contactPerson: [(this.institution ? this.institution.contactPerson : ''), [Validators.required]],
      address: [(this.institution ? this.institution.address : ''), [Validators.required]],
      contactEmail: [(this.institution ? this.institution.contactEmail : ''), [Validators.required]],
      institutionId: [
        (this.institution ? this.institution.institutionId : ''),
        Validators.required,
        InstitutionsValidators.InstitutionId(
          this.afs,
          this.institution ? this.institution.id : ''
        )
      ],
      contactPhone: [(this.institution ? this.institution.contactPhone : ''), [Validators.required, Validators.pattern('^(?:(?:\\+|0{0,2})91(\\s*[\\ -]\\s*)?|[0]?)?[789]\\d{9}|(\\d[ -]?){10}\\d$')]],
      memberShip: [(this.institution ? this.institution.memberShip : ''), [Validators.required]],
      status: [(this.institution ? this.institution.status : ''), [Validators.required]],
    });
    setTimeout(() => {
      this.showForm = true;
    });
  }

  get institutionId() {
    return this.institutionForm.get('institutionId');
  }

  async onSubmit() {
    if (this.institution) {
      const busyIndicatorId = this.busyIndicator.show();
      await this.institutionsService.updateInstitutions(this.institutionForm.value,this.institution.id,this.institution.createdOn)
      this.showForm = false;
      this.institutionForm.reset();
      setTimeout(() => {
        this.showForm = true;
      });
      this.save.emit(this.institutionForm.value);
      this.busyIndicator.hide(busyIndicatorId);
    }
    else {
      const busyIndicatorId = this.busyIndicator.show();
      await this.institutionsService.addInstitutions(this.institutionForm.value);
      this.showForm = false;
      this.institutionForm.reset();
      setTimeout(() => {
        this.showForm = true;
      });
      this.save.emit(this.institutionForm.value);
      this.busyIndicator.hide(busyIndicatorId);
    }
  }
}
