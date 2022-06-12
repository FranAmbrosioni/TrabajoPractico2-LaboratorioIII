let app = Vue.createApp({
  data() {
    return {};
},
});

app.component("review-form", {
    template:
    /*html*/
    ` <form  @submit.prevent ='procesarFormulario' class="formulario">
    <label>Nombre y Apellido:</label><input type="text" id="txtNombre" v-model="nombre" ><br>
    
    <label>Monto a invertir:</label><input type="number" id="txtMonto" v-model="monto" ><br>
    
    <label>Cantidad de días:</label><input type="number" id="txtCantDias"v-model="cantDias"><br>
    
    <p v-if="errores">
    
    <ul>
    <li v-for="error in errores"  class="errores">{{ error }}</li>
    </ul>
    </p>
    <label> Reinvertir </label><input type="checkbox" v-model="reinvertir"><br><br>
    
    <button id="btnCalcular" >Calcular </button><br><br>
    
    <p v-if = "montoFinal >0" id="primerCalculo">Monto a cobrar: {{montoFinal}}</p>
    
            <p v-if="reinvertir && errores.length ==0">
            
            <table id="tablaReinvertir">
                <thead>
                    <th>Periodo</th>
                    <th>Monto Inicial</th>
                    <th>MontoFinal</th>
                </thead>
                    <tr v-for="item in items">
                        <td>{{item.periodo}}</td>
                        <td>{{item.monto}}</td>
                        <td>{{item.montoFinal}}</td>       
                    </tr>
            </p> 
    </form>`,
    data() {
    return {
        errores: [],
        nombre: null,
        monto: null,
        cantDias: null,
        porcentaje: null,
        montoFinal: null,
        
        periodo: 0,
        
        headers: ["Periodo", "Monto incial", "Monto Final"],
        items: [{}],
        montoInteres1: null,
    };
    },
    methods: {
    
    procesarFormulario() {
        this.errores = [];
        let validar = false;
        if (!this.nombre) {
        this.errores.push("El nombre es obligatorio");
        }
        if (!this.monto) {
        this.errores.push("Monto es Obligatorio");
        } else if (this.monto < 1000) {
        this.errores.push("Monto debe ser mayor a 1000");
        }
        if (!this.cantDias) {
        this.errores.push("Campo dias obligatorio");
        } else if (this.cantDias < 30) {
        this.errores.push("Plazo mínimo superior a 30 días");
        }
        if (this.nombre && this.monto >=1000 && this.cantDias) {
        validar = true;

        }
        this.items = [{}];
        if (validar) {
          //Calcular()
        if (this.cantDias >= 30 && this.cantDias <= 60) {
            this.porcentaje = 0.4;
            this.montoFinal = (
            this.monto +
            this.monto * ((this.cantDias / 360) * this.porcentaje)
            ).toFixed(2);
            // this.montoFinalF = this.montoFinal.toFixed(2);
        }
        if (this.cantDias >= 61 && this.cantDias <= 120) {
            this.porcentaje = 0.45;
            this.montoFinal = (
            this.monto +
              this.monto * ((this.cantDias / 360) * this.porcentaje)
            ).toFixed(2);
            //this.montoFinalF = this.montoFinal.toFixed(2);
        }
        if (this.cantDias >= 121 && this.cantDias <= 360) {
            this.porcentaje = 0.55;
            this.montoFinal = (
            this.monto +
              this.monto * ((this.cantDias / 360) * this.porcentaje)
            ).toFixed(2);
            //this.montoFinalF = this.montoFinal.toFixed(2);
        }
        if (this.cantDias > 361) {
            this.porcentaje = 0.65;
            this.montoFinal = (
            this.monto +
              this.monto * ((this.cantDias / 360) * this.porcentaje)
            ).toFixed(2);
            //this.montoFinalF = this.montoFinal.toFixed(2);
        }

        if (this.reinvertir) {
            while (this.periodo < 4) {
            this.periodo++;

            if (this.periodo == 1) {
                this.add({
                periodo: this.periodo,
                monto: this.monto,
                montoFinal: this.montoFinal,
                });
                //this.montoFinal1 = this.montoFinal
            } else {
                this.montoInteres1 = (
                  this.montoFinal *
                (1 + this.porcentaje / 12)
                ).toFixed(2);
                this.add({
                periodo: this.periodo,
                monto: this.montoFinal,
                montoFinal: this.montoInteres1,
                });
                this.montoFinal = this.montoInteres1;
            }
            }
            // El monto final no se visualiza cuando se selecciona la opción de Reinvertir.
            this.montoFinal = 0;
            this.periodo = 0;
        }
        } else {
        this.montoFinal = 0;
        }
    },

    add: function (item) {
        this.items.push(item);
    },
    },
  })
  .mount("#app");
