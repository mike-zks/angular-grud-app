import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  userForm !: FormGroup;
  actionButton : string = "Ajouter";
  titleForm : string = "Formulaire de Création d'Utilisateur";

  constructor(private formBuilder : FormBuilder, 
    private api : ApiService, 
    private toastr : ToastrService,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      firstname : ['',Validators.required],
      lastname : ['',Validators.required]
    });

    if (this.editData) {
      this.titleForm = "Modification de l'utilisateur "+this.editData.id;
      this.actionButton = "Modifier";
      this.userForm.controls['firstname'].setValue(this.editData.firstname);
      this.userForm.controls['lastname'].setValue(this.editData.lastname);
    }

  }
  addUser(){
    if (!this.editData) {
      if (this.userForm.valid) {
        this.api.createUser(this.userForm.value)
        .subscribe({
          next:(res)=>{
            this.toastr.success("Nouvel utilisateur ajouté avec succès!");
            this.userForm.reset();
            this.dialogRef.close('ajouter');
          },
          error:()=>{
            this.toastr.error("Echec d'enregistrement de l'utilisateur")
          }
        })
      }
    }else{
      this.updateUser()
    }
  }
  updateUser(){
    this.api.updateUser(this.editData.id, this.userForm.value)
    .subscribe({
      next:(res)=>{
        this.toastr.success("Modification de l'utilisateur réussie");
        this.userForm.reset();
        this.dialogRef.close('modifier')
      },
      error:(err)=>{
        this.toastr.error("Echec de modification")
      },
    })
  }
}
