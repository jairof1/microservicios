import { Component, Directive, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2'
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Generic } from '../models/generic';
import { CommonService } from '../services/common.service';


@Directive()
export abstract class CommonListarComponent<E extends Generic,S extends CommonService<E>> implements OnInit {
    
  titulo:string;
  lista:E[];
  protected nombreModel:string;


  totalRegistros = 0;
  totalPorPagina = 4;
  paginaActual = 0;
  pageSizeOptions:number[]=[3,5,10,15,100];

  @ViewChild(MatPaginator) paginator:MatPaginator;

  constructor(protected service:S) { }

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
      this.lista=content.content as E[];
      this.totalRegistros=content.totalElements as number;
      this.paginator._intl.itemsPerPageLabel= 'Registros';
      this.paginator._intl.nextPageLabel='proxima pagina';
    });
}

  eliminar(e:E){
      
        Swal.fire({
          title: `seguro que desea eliminar a ${e.nombre}?`,
          text: "Estas seguro!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si',
          cancelButtonText: 'Cancelar!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.service.eliminar(e.id).subscribe(()=>{
              this.calcularRangos();
            Swal.fire(
              'Eliminado!',
              `${this.nombreModel} ${e.nombre} eliminado con exito`,
              'success'
            )
          });
        }
        })
    

    
  }

}
