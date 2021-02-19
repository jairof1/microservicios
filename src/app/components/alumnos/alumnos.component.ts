import { Component, OnInit, ViewChild } from '@angular/core';
import { Alumno } from 'src/app/models/alumno';
import { AlumnoService } from '../../services/alumno.service';
import Swal from 'sweetalert2'
import { MatPaginator, PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-alumnos',
  templateUrl: './alumnos.component.html',
  styles: [
  ]
})
export class AlumnosComponent implements OnInit {
  alumnos:Alumno[];
  titulo='Lista de alumnos';
  totalRegistros = 0;
  totalPorPagina = 4;
  paginaActual = 0;
  pageSizeOptions:number[]=[3,5,10,15,100];

  @ViewChild(MatPaginator) paginator:MatPaginator;

  constructor(private service:AlumnoService) { }

  ngOnInit(): void {
 this.calcularRangos();
  }

paginar(event:PageEvent):void{
this.paginaActual= event.pageIndex;
this.totalPorPagina= event.pageSize;
  
 this.calcularRangos();

}

private calcularRangos(){
 
    this.service.listarPaginas(this.paginaActual.toString(),this.totalPorPagina.toString()).subscribe(content=>{
      this.alumnos=content.content as Alumno[];
      this.totalRegistros=content.totalElements as number;
      this.paginator._intl.itemsPerPageLabel= 'Registros';
      this.paginator._intl.nextPageLabel='proxima pagina';
    });
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
              //this.alumnos= this.alumnos.filter(a=>a!==alumno);
              this.calcularRangos();
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
