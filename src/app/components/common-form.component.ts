import { Component, Directive, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'
import { CommonService } from '../services/common.service';
import { Generic } from '../models/generic';

@Directive()
export abstract class CommonFormComponent<E extends Generic,S extends CommonService<E>> implements OnInit {

titulo:string;
model: E;
error:any;
protected redirect:string;

protected nombreModel:string;


  constructor(protected alumnoServices:S,protected router:Router,protected active:ActivatedRoute) { }

  ngOnInit(): void {
   this.active.paramMap.subscribe(param=>{
     const id:number= +param.get('id');
     if(id){
       this.alumnoServices.ver(id).subscribe(m=> this.model = m)
     }
   });
  }

  crear():void{
    
    this.alumnoServices.crear(this.model).subscribe(m=>{
      
      console.log(m);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `${this.nombreModel} ${m.nombre} creado con exito`,
        showConfirmButton: false,
        timer: 3500
      })
      this.router.navigate([this.redirect]);
    },err=>{
      if(err.status===400){
        this.error=err.error;
      }
    })
  }

  editar():void{
    
    this.alumnoServices.editar(this.model).subscribe(m=>{
      
      console.log(m);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `${this.nombreModel} ${m.nombre} se ha actualizado con exito`,
        showConfirmButton: false,
        timer: 3500
      })
      this.router.navigate([this.redirect]);
    },err=>{
      if(err.status===400){
        this.error=err.error;
      }
    })
  }

}
