import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { ProfileService } from 'app/_services';

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any;
  newPhoto: any;

  constructor(
    private toastr: ToastrService,
    private profileService: ProfileService,
  ) { }

  ngOnInit() {
    this.profileService.getProfile()
      .subscribe(user => {
        this.user = user;
      });
  }

  updateProfile() {
    if (this.newPhoto) {
      this.user.photo_file = this.newPhoto;
    }
    this.profileService.updateProfile(this.user).subscribe(user => {
      this.toastr.success('Updated!');
      this.user = user;
    });
  }

  clearPhoto() {
    this.newPhoto = null;
    $('#fileInput').val('');
  }

  onSelectPhoto(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.newPhoto = reader.result;
      };
    }
  }
}
