import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { CursoService } from '../../services/curso.service';
import { AlumnoService } from '../../services/alumno.service';
import { Alumno } from 'src/app/models/alumno';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';





@Component({
  selector: 'app-asignar-alumnos',
  templateUrl: './asignar-alumnos.component.html',
  styleUrls: ['./asignar-alumnos.component.css']
})
export class AsignarAlumnosComponent implements OnInit {
  curso:Curso;
  alumnosAsignar:Alumno[]=[];
  alumnos:Alumno[]=[];
  mostrarColumnas:string[]=['nombre','apellido','seleccion'];
  mostrarColumnasAlumnos:string[]=['id','nombre','apellido','email','eliminar'];
  tabIndex = 0;
  pageSizeOptions=[3,5,10,20,50];
  dataSource:MatTableDataSource<Alumno>;
  @ViewChild(MatPaginator,{static:true}) paginator:MatPaginator;

  seleccion: SelectionModel<Alumno> = new SelectionModel<Alumno>(true,[]);



  constructor(private active:ActivatedRoute,private serviceCurso:CursoService,private serviceAlumno:AlumnoService) { }

  ngOnInit(): void {
  this.active.paramMap.subscribe(param=>{
  const id:number= +param.get('id');
  this.serviceCurso.ver(id).subscribe(c=>{
    this.curso=c;
    this.alumnos=this.curso.alumnos;
    this.iniciarPaginador();
    });
  });
  }

  iniciarPaginador():void{
    this.dataSource= new MatTableDataSource<Alumno>(this.alumnos);
    this.dataSource.paginator=this.paginator;
    this.paginator._intl.itemsPerPageLabel='Registro por pagina';
  
  }


  filtrar(event:string){
    event= event !== undefined?event.trim():'';
    if(event !== ''){
      this.serviceAlumno.filtrarPorNombre(event).subscribe(alumnos =>this.alumnosAsignar=alumnos.filter(a=>{
        let filtrar = true;
        this.alumnos.forEach(ac=>{
          if(a.id === ac.id){
            filtrar = false;
          }
        });
        return filtrar;
      }));
      }
    }

    seleccionarDesSeleccionarTodo():void{
      this.estanTodosSeleccionados()?
      this.seleccion.clear(): this.alumnosAsignar.forEach(a=>this.seleccion.select(a));
    }

    estanTodosSeleccionados():boolean{
      const alumnosSeleccionados= this.seleccion.selected.length;
      const numAlumnos= this.alumnosAsignar.length;

      return (alumnosSeleccionados === numAlumnos)
    }

    asignar(): void{
      
      this.serviceCurso.asignarAlumnos(this.curso,this.seleccion.selected).subscribe(
      c=>{
        this.tabIndex=2;
        Swal.fire('Asignados',`Alumnos asignados con exito al curso ${c.nombre}`,'success');
        this.alumnos=this.alumnos.concat(this.seleccion.selected);
        this.iniciarPaginador();
        this.alumnosAsignar=[];
        this.seleccion.clear();
      },e =>{
        //console.log(e.status);
        if(e.status === 500){
          const mensaje = e.error.message as string;
          if(mensaje.indexOf('ConstraintViolationException')>-1){
            Swal.fire('Cuidado',`No se puede asignar ya que esta en otro curso`,'error');
          }
        }
      }
      );
    }

    eliminarAlumno(alumno:Alumno):void{
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
      this.serviceCurso.eliminarAlumno(this.curso,alumno).subscribe(curso=>{
        this.alumnos=this.alumnos.filter(a=>a.id != alumno.id);
        this.iniciarPaginador();
        Swal.fire('Eliminado',`Alumno ${alumno.nombre} fue eliminado con exito`);
      });
    }
  });
}

}
