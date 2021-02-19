import { Component, OnInit } from '@angular/core';
import { Alumno } from 'src/app/models/alumno';
import { AlumnoService } from '../../services/alumno.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styles: [
  ]
})
export class AlumnosComponent implements OnInit {
  alumnos:Alumno[];
  titulo='Lista de alumnos';
  constructor(private service:AlumnoService) { }

  ngOnInit(): void {
    this.service.listar().subscribe(alumnos=>this.alumnos=alumnos);
  }


  eliminar(alumno:Alumno){
      
        Swal.fire({
          title: `seguro que desea eliminar a ${alumno.nombre}?`,
          text: "Estas seguro!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si',
          cancelButtonText: 'Cancelar!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.service.eliminar(alumno.id).subscribe(()=>{
              this.alumnos= this.alumnos.filter(a=>a!==alumno);
           
            Swal.fire(
              'Eliminado!',
              `Alumno ${alumno.nombre} eliminado con exito`,
              'success'
            )
          });
        }
        })
    

    
  }

}
