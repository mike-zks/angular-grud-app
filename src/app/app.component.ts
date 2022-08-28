import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'sab_test';
  displayedColumns: string[] = ['firstname', 'lastname', 'creationdate', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog : MatDialog, private api :ApiService, private toastr : ToastrService) {
    
  }
  ngOnInit(): void {
    this.getAllUsers();
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val  === 'ajouter'){
        this.getAllUsers();
      }
    });
  }
  getAllUsers(){
    this.api.getUsers()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res["hydra:member"]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        this.toastr.info("Erreur dans l'affichage de données")
      }
    })
  }
  getUser(id : number){
    this.api.getUser(id)
    .subscribe({
      next:(res)=>{
        this.toastr.show(JSON.stringify(res), "Infos utilisateur")
        console.log(res)
      },
      error:(err)=>{
        this.toastr.error("Echec de collecte des infos sur l'utilisateur")
      },
    })
  }
  editUser(row : any){
    this.dialog.open(DialogComponent, {
      width: '30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val  === 'modifier'){
        this.getAllUsers();
      }
    });
  }
  deleteUser(id : number){
    this.api.deleteUser(id)
    .subscribe({
      next:(res)=>{
        this.toastr.success("Utilisateur Supprimé avec Succès")
        this.getAllUsers();
      },
      error:(err)=>{
        this.toastr.error("Echec de Suppression")
      },
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
