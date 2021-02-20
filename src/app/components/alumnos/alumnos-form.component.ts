import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alumno } from 'src/app/models/alumno';
import { AlumnoService } from '../../services/alumno.service';
import Swal from 'sweetalert2'
import { CommonFormComponent } from '../common-form.component';

@Component({
  selector: 'app-alumnos-form',
  templateUrl: './alumnos-form.component.html',
  styleUrls: ['./alumnos-form.component.css']
})
export class AlumnosFormComponent extends CommonFormComponent<Alumno,AlumnoService> implements OnInit {
alumno:Alumno=new Alumno();
error:any;
private fotoSeleccionada:File;

  constructor( alumnoServices:AlumnoService, router:Router, active:ActivatedRoute) {
    super(alumnoServices,router,active);
    this.titulo='Crear Alumno';
    this.model=new Alumno();
    this.redirect='/alumnos';
    this.nombreModel=Alumno.name;
   }

   seleccionarfoto(event){
     this.fotoSeleccionada=event.target.files[0];
     
     console.log(this.fotoSeleccionada);
     console.log(this.fotoSeleccionada.type.indexOf('image'));
      if(this.fotoSeleccionada.type.indexOf('image') < 0){
        this.fotoSeleccionada=null;
        Swal.fire('Error','El archivo debe ser tipo imagen','error')
      }
   }

   crear():void{
  if(!this.fotoSeleccionada){
    super.crear();
  } else{
    this.alumnoServices.crearConFoto(this.model,this.fotoSeleccionada).subscribe(alumno=>{
      
      console.log(alumno);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `${this.nombreModel} ${alumno.nombre} creado con exito`,
        showConfirmButton: false,
        timer: 3500
      })
      this.router.navigate([this.redirect]);
    },err=>{
      if(err.status===400){
        this.error=err.error;
      }
    });
  }
  }


  editar():void{
    
      this.alumnoServices.editarConFoto(this.model,this.fotoSeleccionada).subscribe(alumno=>{
        
        console.log(alumno);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${this.nombreModel} ${alumno.nombre} actualizado con exito`,
          showConfirmButton: false,
          timer: 3500
        })
        this.router.navigate([this.redirect]);
      },err=>{
        if(err.status===400){
          this.error=err.error;
        }
      });
    }
    

}
