window.addEventListener("load",CargarElementos);

function $(id) {
    return document.getElementById(id);
}


function CargarElementos()
{
    CargarLocalidades();    
    var peticion = new XMLHttpRequest();  
    peticion.onreadystatechange = function()
    {
        
        if(peticion.status == 200 && peticion.readyState == 4)
        {
            $("divSpinner").hidden=true;
            var materias = JSON.parse(peticion.responseText);
    
            for (let index = 0; index < materias.length; index++) 
            {
                crearFila(materias[index]);
            }       
        }
    }

    peticion.open("GET","http://localhost:3000/personas",true);
    peticion.send();
    $("divSpinner").hidden=false;
}

function crearFila(persona)
{
    var fila = document.createElement("tr");

    var tdId = document.createElement("td");
    var tdNombre = document.createElement("td");
    var tdFechaFinal = document.createElement("td");
    var tdFechaFinal = document.createElement("td");
    var tdLocalidad = document.createElement("td");
    var tdTurno = document.createElement("td");
    
    var txtId = document.createTextNode(persona.id);
    var txtNombre = document.createTextNode(persona.nombre);
    var txtFechaFinal = document.createTextNode(persona.apellido);
    var txtLocalidad = document.createTextNode(persona.localidad.nombre);
    var txtTurno = document.createTextNode(persona.sexo);

    fila.appendChild(tdId);
    tdId.appendChild(txtId);

    fila.appendChild(tdNombre);
    tdNombre.appendChild(txtNombre);

    fila.appendChild(tdFechaFinal);
    tdFechaFinal.appendChild(txtFechaFinal);

    fila.appendChild(tdLocalidad);
    tdLocalidad.appendChild(txtLocalidad);

    fila.appendChild(tdTurno);
    tdTurno.appendChild(txtTurno);
    


    fila.addEventListener("dblclick",desplegarFormFila);

    $("tabla").appendChild(fila);
}

function CargarLocalidades()
{
    var peticion = new XMLHttpRequest();
    peticion.onreadystatechange = function()
    {
        
        if(peticion.status == 200 && peticion.readyState == 4)
        {
            $("divSpinner").hidden=true;
            var localidades = JSON.parse(peticion.responseText);
    
            for (let index = 0; index < localidades.length; index++) 
            {
                CrearOpcion(localidades[index]);
            }       
        }
    }
    peticion.open("GET","http://localhost:3000/localidades",true);
    peticion.send(); 


}
function CrearOpcion(localidad)
{
    var opciones = $("selectLocalidad");

    var opcionLocalidad = document.createElement("option");
    var idLocalidad = document.createTextNode(localidad.id);
    var valueLocalidad = document.createTextNode(localidad.id);
    var txtLocalidad = document.createTextNode(localidad.nombre);
    opcionLocalidad.value = localidad.id;
    opcionLocalidad.id = localidad.id;

    opciones.appendChild(opcionLocalidad);
    opcionLocalidad.appendChild(txtLocalidad);
    //opciones.appendChild(nameLocalidad);
    //nameLocalidad.appendChild(txtLocalidad);
    
}

//form hidden

function desplegarFormFila(event)
{
    var divMateria=$("divFormMateria");
    divMateria.hidden = false;

    var tabla = $("tabla");
    var fila = event.target.parentNode; 
    var id = fila.childNodes[0].childNodes[0].nodeValue;
    var nombre = fila.childNodes[1].childNodes[0].nodeValue;
    var apellido = fila.childNodes[2].childNodes[0].nodeValue;
    var localidad = fila.childNodes[3].childNodes[0].nodeValue;
    var turno = fila.childNodes[4].childNodes[0].nodeValue;

    $("txtNombre").value = nombre;
    $("txtApellido").value = apellido;
    //$("selectLocalidad").value = fechaFormato;

    
    if(turno == "Male")
    {
        $("hombre").checked=true;
        $("mujer").checked = false;
    }
    else
    {
        $("mujer").checked=true;
        $("hombre").checked = false;

    }

    $("btnModificar").onclick=function()
    {
       
        let flagNombre = true;
        let flagFecha = true;
        let flagTurno = true;
        let flagCuatrimestre = true;
       
        if($("txtNombre").value.length < 3)
        {
            
            $("txtNombre").style.borderColor="red";          
            flagNombre = false;

        }
        if($("txtApellido").value.length < 3)
        {
            
            $("txtApellido").style.borderColor="red";          
            flagNombre = false;

        }

        if(!($("hombre").checked || $("mujer").checked))
        {
            flagTurno = false;
        }
        else if($("hombre").checked && $("mujer").checked)
        {
            flagTurno = false;
        }

   
    
        if(flagNombre && flagFecha && flagFecha)
        {
            var nombreInput= $("txtNombre").value;
            var apellidoInput = $("txtApellido").value;
            var sexoInput;
            var localidadInput = $("selectLocalidad").textContent;

            if($("mujer").checked)
            {
                sexoInput = "Female";
                $("hombre").checked = false;
            }else{
                sexoInput = "Male";
                $("mujer").checked = false;
            }

            var jsonMateria={"id":id,"nombre":nombreInput,"apellido":apellidoInput,"localidad":localidadInput,"sexo":sexoInput}

            var peticion = new XMLHttpRequest();
            peticion.onreadystatechange = function() 
            {
                
                if(peticion.status == 200 && peticion.readyState == 4)
                {
                    $("divSpinner").hidden = true;
                    
        
                    fila.childNodes[1].childNodes[0].nodeValue = nombreInput;
                    fila.childNodes[2].childNodes[0].nodeValue = apellidoInput;
                    fila.childNodes[3].childNodes[0].nodeValue = localidadInput;
                    fila.childNodes[4].childNodes[0].nodeValue = sexoInput;
                    
                }
            }

            peticion.open("POST","http://localhost:3000/editar");
            peticion.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            peticion.send(JSON.stringify(jsonMateria));
            
            $("divSpinner").hidden = false;            
        }



    }

    $("btnCerrar").onclick = function(){
        $("divFormMateria").hidden = true;
    }

}