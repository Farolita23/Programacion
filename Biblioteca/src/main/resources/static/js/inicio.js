async function main(){
	const api = await requestAPI("");
	alert(api)
}
main();
/*
function buscarAutores() {

    var nombre = document.getElementById("nombre").value;
    fetch("http://localhost:9999/consulta_autores?nombre=" + nombre)
    // Al obtener respuesta del servidor, tomar el texto o html
    .then(res => res.text())
    .then(json => {
        const posts = JSON.parse(json);     
        let tabla = "";            
        posts.forEach(fila => {
            tabla += "<tr>";
            tabla += "<td>"+fila.id+"</td>"; 
            tabla += "<td>"+fila.nombre+"</td>";
            tabla += "<td>"+fila.fechaNacimiento+"</td>"; 
            tabla += "<td>"+fila.direccion+"</td>"; 
            tabla += "<td>"+fila.dni+"</td>"; 
			tabla += "<td><button onclick=\"abrirModificarAutor('"+fila.id+"','"+ fila.nombre +"','"+ fila.fechaNacimiento +"','"+ fila.direccion +"','"+ fila.dni +"')\">Modificar</button><button onclick=\"eliminarAutor("+fila.id+")\">Eliminar</button></td>";                 
            tabla += "</tr>";
        });         
        var contenedor_tabla = document.getElementById("contenido_tabla");
        contenedor_tabla.innerHTML = tabla;
    })
    // Si algo falló, mostrar mensaje en consola
    .catch(e => {
        alert('Error importando archivo: ' + e.message);
    });


}

function abrirCrearAutor() {
    // Ventana modal
    var modal = document.getElementById("ventanaModal");
    modal.style.display = "block";
}

function abrirModificarAutor(id,nombre,fechaNacimiento,direccion,dni) {
    // Ventana modal
	document.getElementById("nombre_completo").value=nombre;
    document.getElementById("direccion").value=direccion;
    document.getElementById("dni").value=dni;
    document.getElementById("fechaNacimiento").value=fechaNacimiento;
	document.getElementById("idAutor").value=id;
    var modal = document.getElementById("ventanaModal");
    modal.style.display = "block";
}

function cerrarCrearAutor() {
    // Ventana modal
    document.getElementById("nombre_completo").value="";
    document.getElementById("direccion").value="";
    document.getElementById("dni").value="";
    document.getElementById("fechaNacimiento").value="";
	document.getElementById("idAutor").value="";
    var modal = document.getElementById("ventanaModal");
    modal.style.display = "none";
}

function gestionarAutor() {

    var nombre = document.getElementById("nombre_completo").value;
    var direccion = document.getElementById("direccion").value;
    var dni = document.getElementById("dni").value;
    var fechaNacimiento = document.getElementById("fechaNacimiento").value;
	
	var idAutor = document.getElementById("idAutor").value; 
	
	var url = "";
	if(idAutor!=""){
		//Tenemos que modificar
		url = "http://localhost:9999/modificar_autor?idAutor="+idAutor+"&nombre="+nombre+"&dni="+dni+"&direccion="+direccion+"&fechaNacimiento="+fechaNacimiento;
	} else {
		//Tenemos que crear
		url = "http://localhost:9999/crear_autor?nombre="+nombre+"&dni="+dni+"&direccion="+direccion+"&fechaNacimiento="+fechaNacimiento;    
	}
	
	fetch(url)
        // Al obtener respuesta del servidor, tomar el texto o html
    .then(res => res.text())
    .then(res => {
        buscarAutores();
        cerrarCrearAutor();               
     })
     // Si algo falló, mostrar mensaje en consola
     .catch(e => {
         alert('Error importando archivo: ' + e.message);
     });
}

function eliminarAutor(idAutor){
	fetch("http://localhost:9999/eliminar_autor?idAutor=" + idAutor)
    // Al obtener respuesta del servidor, tomar el texto o html
    .then(res => res.text())
	.then(res => {
	    buscarAutores();             
	})
    // Si algo falló, mostrar mensaje en consola
    .catch(e => {
        alert('Error importando archivo: ' + e.message);
    });
}

function abrirCrearLibro() {
    // Ventana modal
    var modal = document.getElementById("crearLibro");
    modal.style.display = "block";
}

function cerrarCrearLibro() {
    // Ventana modal
    document.getElementById("titulo").value="";
    document.getElementById("descripcion").value="";
    document.getElementById("fecha").value="";
    document.getElementById("favorito").checked=false;
	document.getElementById("isbn").value="";
	document.getElementById("idioma").value="";
	document.getElementById("categoria").selectedIndex = 0;
	document.getElementById("editorial").selectedIndex = 0;
    var modal = document.getElementById("crearLibro");
    modal.style.display = "none";
}


function cargaInicial(){
	let selectEditoriales = document.getElementById("editorial");
	fetch("buscar_editoriales")
  	.then(res => res.text())
  	.then(json => {
		const posts = JSON.parse(json);
		let opt = document.createElement("option");
		opt.value=0;
		opt.text="";
		selectEditoriales.add(opt);
	  	posts.forEach(editorial => {
			opt = document.createElement("option");
			opt.value=editorial.id;
			opt.text=editorial.nombre;
			selectEditoriales.add(opt);
	  	});
  	})
  	// Si algo falló, mostrar mensaje en consola
  	.catch(e => {
	  alert('Error importando archivo: ' + e.message);
  	});
	
	let selectCategorias = document.getElementById("categoria");
	fetch("buscar_categorias")
  	.then(res => res.text())
  	.then(json => {
		const posts = JSON.parse(json);
		let opt = document.createElement("option");
		opt.value=0;
		opt.text="";
		selectCategorias.add(opt);
	  	posts.forEach(categoria => {
			opt = document.createElement("option");
			opt.value=categoria.id;
			opt.text=categoria.nombre;
			selectCategorias.add(opt);
	  	});
  	})
  	// Si algo falló, mostrar mensaje en consola
  	.catch(e => {
	  alert('Error importando archivo: ' + e.message);
  	});
	
	
	
}


function crearLibro(){
	var titulo = document.getElementById("titulo").value;
    var descripcion = document.getElementById("descripcion").value;
    var fecha = document.getElementById("fecha").value;
    var favorito = document.getElementById("favorito").value;
	var isbn = document.getElementById("isbn").value;
	var idioma = document.getElementById("idioma").value;
	var categoria = document.getElementById("editorial").value;
	var editorial = document.getElementById("categoria").value;
	
	var url = "http://localhost:9999/crear_libro?titulo="+titulo+"&descripcion="+descripcion+"&fechaPublicacion="+fecha+"&favorite="+favorito+"&isbn="+isbn+"&idioma="+idioma+"&idCategoria="+categoria+"&idEditorial="+editorial;
		
	fetch(url)
        // Al obtener respuesta del servidor, tomar el texto o html
    .then(res => res.text())
    .then(res => {
        cerrarCrearLibro();               
     })
     // Si algo falló, mostrar mensaje en consola
     .catch(e => {
         alert('Error importando archivo: ' + e.message);
     });
}

*/