import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Alumno } from 'src/app/models/alumno';
import { AlumnoService } from '../../services/alumno.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-alumnos-form',
  templateUrl: './alumnos-form.component.html',
  styleUrls: ['./alumnos-form.component.css']
})
export class AlumnosFormComponent implements OnInit {
titulo='Crear Alumno';
alumno:Alumno=new Alumno();
error:any;
  constructor(private alumnoServices:AlumnoService,private router:Router,private active:ActivatedRoute) { }

  ngOnInit(): void {
   this.active.paramMap.subscribe(param=>{
     const id:number= +param.get('id');
     if(id){
       this.alumnoServices.ver(id).subscribe(alumno=> this.alumno = alumno)
     }
   });
  }

  crear():void{
    
    this.alumnoServices.crear(this.alumno).subscribe(alumno=>{
      
      console.log(alumno);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Alumno ${alumno.nombre} creado con exito`,
        showConfirmButton: false,
        timer: 3500
      })
      this.router.navigate(['/alumnos']);
    },err=>{
      if(err.status===400){
        this.error=err.error;
      }
    })
  }

  editar():void{
    
    this.alumnoServices.editar(this.alumno).subscribe(alumno=>{
      
      console.log(alumno);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Alumno ${alumno.nombre} se ha actualizado con exito`,
        showConfirmButton: false,
        timer: 3500
      })
      this.router.navigate(['/alumnos']);
    },err=>{
      if(err.status===400){
        this.error=err.error;
      }
    })
  }

}
