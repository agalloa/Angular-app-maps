import { AfterViewInit, Component, ElementRef,  OnDestroy,  ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles:[
    `
      .mapa-container{
        width: 100%;
        height: 100%;
      }

      .row{
        background-color: white;
        border-radius:5px;
        bottom:50px;
        left:50px;
        padding:10px;
        position: fixed;
        z-index: 999;
      }
    `
  ]
})

//El metodo afertViewInit sirve para cuando la vista ya termina de cargar y queremos mostrar algo.
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [ -118.35900591281063, 34.06725115085475 ];


  constructor() { }
  
  ngOnDestroy(): void {
    this.mapa.off('zoom',    () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move',    () => {});
  }

  ngAfterViewInit(): void {

      this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
      });
      
      //metodo para hacer zoom con el mouse
      this.mapa.on('zoom', (event) => {
       //const zoomActual =  this.mapa.getZoom();
       this.zoomLevel = this.mapa.getZoom();
      });
      
      //controla que el zoom maximo que se pueda hacer sea de 18
      this.mapa.on('zoomend', (event) => {
        if( this.mapa.getZoom() > 18 ){
          this.mapa.zoomTo(18);
        }
       });

       //Obtener el numero de latitud y longitud al moverse por el mapa
       this.mapa.on('move', (event) =>{
          //console.log(event);
          const target = event.target; 
          const { lng, lat } = target.getCenter();
          this.center = [lng, lat];
         // console.log( target.getCenter());
       });
  }

  zoomOut(){
    this.mapa.zoomOut();
    this.zoomLevel = this.mapa.getZoom();
  }
  zoomIn(){
    this.mapa.zoomIn();
    this.zoomLevel = this.mapa.getZoom();
  }
  changeZoom(valor: string){
    this.mapa.zoomTo( Number(valor));
  }
}
