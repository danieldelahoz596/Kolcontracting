import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ProfileService } from 'app/_services';
import { getErrorMessage } from 'app/_utils/helpers';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnInit {
  passwordChangeForm: FormGroup;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private profileService: ProfileService,
  ) {
    this.passwordChangeForm = this.fb.group({
      old_password: ['', [Validators.required]],
      new_password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
    }, {
      validators: this.checkPasswords
    });
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('new_password').value;
    const confirmPass = group.get('confirm_password').value;
    return pass === confirmPass ? null : { notMatch: true };
  }

  ngOnInit() {
  }

  onSubmit() {
    this.profileService.updatePassword(this.passwordChangeForm.value).subscribe(res => {
      this.toastr.success('Updated!');
    }, err => {
      this.toastr.error(getErrorMessage(err));
    });
  }
}
