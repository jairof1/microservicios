import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../services/curso.service';
import { ExamenService } from '../../services/examen.service';
import { Curso } from '../../models/curso';
import { FormControl } from '@angular/forms';
import { Examen } from '../../models/examen';
import { flatMap, map } from 'rxjs/operators';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-asignar-examenes',
  templateUrl: './asignar-examenes.component.html',
  styleUrls: ['./asignar-examenes.component.css']
})
export class AsignarExamenesComponent implements OnInit {
curso:Curso;
autocompleteControl= new FormControl();
examenesFiltrados:Examen[]=[];
examenesAsignar:Examen[]=[];
mostrarColumnas:string[]=['nombre','asignatura','eliminar'];
examenes : Examen[]=[];
mostrarColumnasExamenes:string[]=['id','nombre','asignatura','eliminar'];
tabIndex:number=0;
datasource:MatTableDataSource<Examen>;
@ViewChild(MatPaginator,{static:true})paginator : MatPaginator;
pageSizeOptions:number[]=[3,,5,10,15,20]

  constructor(private active:ActivatedRoute,private router:Router,private serviceCurso:CursoService,private serviceExamen:ExamenService) { }

  ngOnInit(): void {
    this.active.paramMap.subscribe(params=>{
      const id: number = +params.get('id');
      this.serviceCurso.ver(id).subscribe(c=>{
        this.curso=c
        this.examenes=this.curso.examenes;
        this.iniciarPaginador();
      });
    });
    this.autocompleteControl.valueChanges.pipe(
       map(valor=> typeof valor === 'string'?valor: valor.nombre),
       flatMap(valor=>  valor?this.serviceExamen.filtrarPorNombre(valor):[])
    ).subscribe(examenes => this.examenesFiltrados=examenes);
  }

  mostrarNombre(examen? : Examen): string{
    return examen? examen.nombre:'';
  }
  
  private iniciarPaginador(){
    this.datasource=new MatTableDataSource<Examen>(this.examenes);
    this.datasource.paginator=this.paginator;
    this.paginator._intl.itemsPerPageLabel='Registro por pagina';

  }
  
  seleccionarExamen(event:MatAutocompleteSelectedEvent){
      const examen = event.option.value as Examen;

      if(!this.existe(examen.id)){
        
              this.examenesAsignar=this.examenesAsignar.concat(examen);
              console.log(this.examenesAsignar);
              

      }else{
        Swal.fire('!Error',`el examen ${examen.nombre} ya esta asignado al curso`,'error');
      }
      this.autocompleteControl.setValue('');
              event.option.deselect();
              event.option.focus();
  }

  private existe(id:number):boolean{
    let existe = false;
    this.examenesAsignar.concat(this.examenes).forEach(e=>{
      if(id===e.id){
        existe=true;
      }
    });

    return existe;
  }


  eliminarDelAsignar(examen:Examen):void{
    this.examenesAsignar = this.examenesAsignar.filter(examenfil=>examenfil.id !== examen.id);

  }

  asignar():void{
    console.log(this.examenesAsignar);
      this.serviceCurso.asignarExamenes(this.curso,this.examenesAsignar).subscribe(e=>{
        this.examenes=this.examenes.concat(this.examenesAsignar);
        this.iniciarPaginador();
        this.examenesAsignar=[];
        Swal.fire('Asignados',`Examenes asignados con exito ${e.nombre}`,'success')

        this.tabIndex=2;
      });
  }

  eliminarExamenCurso(examen:Examen):void{
    Swal.fire({
      title: `seguro que desea eliminar a ${examen.nombre}?`,
      text: "Estas seguro!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
    this.serviceCurso.eliminarExamen(this.curso,examen).subscribe(curso=>{
      this.examenes=this.examenes.filter(e=>e.id != examen.id);
      this.iniciarPaginador();
      Swal.fire('Eliminado',`Alumno ${examen.nombre} fue eliminado con exito`);
    });
  }
});

  }

}
