import { Component, OnInit } from '@angular/core';
/*import { FormControl, FormGroup } from '@angular/forms'; */
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RegistrationService } from './registration.service';
import { PasswordValidator } from './shared/password.validator';
import { forbiddenNameValidator } from './shared/user-name.validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  registrationForm!: FormGroup;

  get userName(){
    return this.registrationForm.get('username');
  }

  get email(){
    return this.registrationForm.get('email');
  }

  get alternateEmails(){
    return this.registrationForm.get('alternateEmails') as FormArray;
  }

  addAlternateEmail(){
    this.alternateEmails.push(this.fb.control(''));
  }

  constructor(private fb: FormBuilder, private _registrationService: RegistrationService) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required,Validators.minLength(3), forbiddenNameValidator(/password/)]],
      email : [''],
      subscribe: [false],
      password: [''],
      confirmPassword: [''],
      address: this.fb.group({
        city: [''],
        state: [''],
        postalCode: ['']
      }),
      alternateEmails: this.fb.array([])
    }, {validator: PasswordValidator });

    this.registrationForm.get('subscribe')?.valueChanges
     .subscribe(checkedValue =>{
       const email = this.registrationForm.get('email');
       if(checkedValue){
         email?.setValidators(Validators.required);
       } else{
         email?.clearValidators;
       }
       email?.updateValueAndValidity();
     });
  }

  /* registrationForm = this.fb.group({
    username: ['', [Validators.required,Validators.minLength(3), forbiddenNameValidator(/password/)]],
    email : [''],
    subscribe: [false],
    password: [''],
    confirmPassword: [''],
    address: this.fb.group({
      city: [''],
      state: [''],
      postalCode: ['']
    })
  }, {validator: PasswordValidator });
  */

  /*
  registrationForm = new FormGroup(
    {
      username: new FormControl(''),
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
      address: new FormGroup({
        city: new FormControl(''),
        state: new FormControl(''),
        postalCode: new FormControl('')
      })
    }
  );
  */
  /*LoadApiData() {
    this.registrationForm.setValue({
     username: 'Bruce',
       password: 'test',
       confirmPassword: 'test',
       address: {
        city: 'City',
         state: 'State',
         postalCode: '123456'
       }
     });

  }

  LoadApiof(){
    this.registrationForm.patchValue({
     username: 'Bruce',
       password: 'test',
       confirmPassword: 'test',
     });


}
*/
  onSubmit(){
    console.log(this.registrationForm.value);
    this._registrationService.register(this.registrationForm.value)
      .subscribe(
        response => console.log('Success!', response),
        error => console.error('Error!', error)
      )
  }
}
