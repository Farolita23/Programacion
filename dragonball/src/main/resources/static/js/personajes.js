// personajes.js
document.addEventListener("DOMContentLoaded", function() {
    // Variables globales
    const API_URL = "http://localhost:9999/api";
    const tablaPersonajes = document.getElementById("cuerpoTablaPersonajes");
    const btnBuscar = document.getElementById("btnBuscar");
    const btnCrear = document.getElementById("btnCrear");
    const modalPersonaje = document.getElementById("modalPersonaje");
    const formPersonaje = document.getElementById("formPersonaje");
    const btnCancelar = document.getElementById("btnCancelar");
    const modalDetalles = document.getElementById("modalDetalles");
    
    // Función auxiliar para manejar URLs de imágenes
    function getImageUrl(url) {
        // Comprobar si es una URL externa
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            return url;
        } else {
            // Es una ruta local
            return `images/${url}`;
        }
    }
    
    // Actualizar el texto de ayuda en el formulario
    const labelImagenUrl = document.querySelector('label[for="inputImagenUrl"]');
    if (labelImagenUrl) {
        labelImagenUrl.innerHTML = 'URL de Imagen: <small>(URL completa de internet o nombre del archivo local)</small>';
    }
    
    // Elementos para cerrar los modales
    const cerrarModales = document.querySelectorAll(".modal-close");
    
    // Cargar personajes al iniciar la página
    cargarPersonajes();
    
    // Event Listeners
    btnBuscar.addEventListener("click", buscarPersonajes);
    btnCrear.addEventListener("click", abrirModalCrear);
    btnCancelar.addEventListener("click", cerrarModalPersonaje);
    formPersonaje.addEventListener("submit", guardarPersonaje);
    
    // Cerrar modales con el botón de cerrar
    cerrarModales.forEach(btn => {
        btn.addEventListener("click", function() {
            modalPersonaje.style.display = "none";
            modalDetalles.style.display = "none";
        });
    });
    
    // Cerrar modales al hacer clic fuera del contenido
    window.addEventListener("click", function(event) {
        if (event.target === modalPersonaje) {
            modalPersonaje.style.display = "none";
        }
        if (event.target === modalDetalles) {
            modalDetalles.style.display = "none";
        }
    });

    // Agregar fondo temático de Dragon Ball
    const dragonBallBackground = document.createElement("div");
    dragonBallBackground.classList.add("dragon-ball-background");
    document.body.appendChild(dragonBallBackground);
    
    // Esfera del dragón (Easter egg)
    const esferaDragon = document.createElement("div");
    esferaDragon.classList.add("esfera-dragon");
    document.body.appendChild(esferaDragon);
    
    esferaDragon.addEventListener("click", function() {
        // Animación para todos los personajes
        const filas = tablaPersonajes.querySelectorAll("tr");
        filas.forEach((fila, index) => {
            setTimeout(() => {
                fila.classList.add("power-up-animation");
                setTimeout(() => {
                    fila.classList.remove("power-up-animation");
                }, 1000);
            }, index * 100);
        });
    });
    
    // Funciones
    
    // Cargar todos los personajes
    function cargarPersonajes() {
        fetch(`${API_URL}/personajes/todos`)
            .then(response => response.json())
            .then(data => {
                mostrarPersonajesEnTabla(data);
            })
            .catch(error => {
                console.error("Error al cargar personajes:", error);
                mostrarMensaje("Error al cargar los personajes. Por favor, inténtalo de nuevo más tarde.", "error");
            });
    }
    
    // Buscar personajes con los criterios de búsqueda
    function buscarPersonajes() {
        const nombre = document.getElementById("nombre").value;
        const raza = document.getElementById("raza").value;
        const esHeroeCheckbox = document.getElementById("esHeroe");
        
        let url = `${API_URL}/personajes?nombre=${encodeURIComponent(nombre)}&raza=${encodeURIComponent(raza)}`;
        
        if (esHeroeCheckbox.checked) {
            url += `&esHeroe=true`;
        }
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                mostrarPersonajesEnTabla(data);
            })
            .catch(error => {
                console.error("Error al buscar personajes:", error);
                mostrarMensaje("Error al buscar personajes. Por favor, inténtalo de nuevo más tarde.", "error");
            });
    }
    
    // Mostrar personajes en la tabla
    function mostrarPersonajesEnTabla(personajes) {
        tablaPersonajes.innerHTML = "";
        
        if (personajes.length === 0) {
            tablaPersonajes.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center;">No se encontraron personajes</td>
                </tr>
            `;
            return;
        }
        
        personajes.forEach(personaje => {
            const fechaNacimiento = new Date(personaje.fechaNacimiento).toLocaleDateString();
            const esHeroe = personaje.esHeroe ? "Sí" : "No";
            
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${personaje.id}</td>
                <td><img src="${getImageUrl(personaje.imagenUrl)}" alt="${personaje.nombre}" class="personaje-img"></td>
                <td>${personaje.nombre}</td>
                <td>${personaje.raza}</td>
                <td class="power-level">${personaje.nivelPoder}</td>
                <td>${esHeroe}</td>
                <td>${fechaNacimiento}</td>
                <td>
                    <button class="btn btn-action btn-view" data-id="${personaje.id}">Ver</button>
                    <button class="btn btn-action btn-edit" data-id="${personaje.id}">Editar</button>
                    <button class="btn btn-action btn-delete" data-id="${personaje.id}">Eliminar</button>
                </td>
            `;
            
            tablaPersonajes.appendChild(fila);
            
            // Event listeners para los botones de acciones
            const btnVer = fila.querySelector(".btn-view");
            const btnEditar = fila.querySelector(".btn-edit");
            const btnEliminar = fila.querySelector(".btn-delete");
            
            btnVer.addEventListener("click", () => verPersonaje(personaje.id));
            btnEditar.addEventListener("click", () => editarPersonaje(personaje.id));
            btnEliminar.addEventListener("click", () => eliminarPersonaje(personaje.id));
        });
    }
    
    // Ver detalles de un personaje
    function verPersonaje(id) {
        Promise.all([
            fetch(`${API_URL}/personajes/${id}`).then(res => res.json()),
            fetch(`${API_URL}/personajes/${id}/transformaciones`).then(res => res.json()),
            fetch(`${API_URL}/personajes/${id}/tecnicas`).then(res => res.json()),
            fetch(`${API_URL}/sagas/todas`).then(res => res.json()) // Para la versión simplificada
        ])
        .then(([personaje, transformaciones, tecnicas, sagas]) => {
            document.getElementById("detallesTitulo").textContent = `Detalles de ${personaje.nombre}`;
            document.getElementById("detallesImagen").src = getImageUrl(personaje.imagenUrl);
            document.getElementById("detallesNombre").textContent = personaje.nombre;
            document.getElementById("detallesRaza").textContent = personaje.raza;
            document.getElementById("detallesNivelPoder").textContent = personaje.nivelPoder;
            document.getElementById("detallesTipo").textContent = personaje.esHeroe ? "Héroe" : "Villano";
            document.getElementById("detallesFechaNacimiento").textContent = new Date(personaje.fechaNacimiento).toLocaleDateString();
            document.getElementById("detallesBiografia").textContent = personaje.biografia;
            
            // Mostrar transformaciones
            const listaTransformaciones = document.getElementById("listaTransformaciones");
            listaTransformaciones.innerHTML = "";
            
            if (transformaciones.length === 0) {
                listaTransformaciones.innerHTML = "<li>No tiene transformaciones registradas</li>";
            } else {
                transformaciones.forEach(trans => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <div class="transformacion-info">
                            <span class="transformacion-nombre">${trans.nombre}</span>
                            <span class="transformacion-multiplicador">x${trans.multiplicadorPoder}</span>
                        </div>
                    `;
                    listaTransformaciones.appendChild(li);
                });
            }
            
            // Mostrar técnicas
            const listaTecnicas = document.getElementById("listaTecnicas");
            listaTecnicas.innerHTML = "";
            
            if (tecnicas.length === 0) {
                listaTecnicas.innerHTML = "<li>No tiene técnicas registradas</li>";
            } else {
                tecnicas.forEach(tec => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <div class="tecnica-info">
                            <span class="tecnica-nombre">${tec.nombre}</span>
                            <span class="tecnica-nivel">Nivel ${tec.nivelDano}</span>
                        </div>
                    `;
                    listaTecnicas.appendChild(li);
                });
            }
            
            // Para la versión simplificada, mostraremos todas las sagas (se debería llamar a un endpoint específico en una app completa)
            const listaSagas = document.getElementById("listaSagas");
            listaSagas.innerHTML = "";
            
            // Simulamos que el personaje está en algunas sagas (en una app real, esto vendría de la API)
            const sagasDelPersonaje = sagas.slice(0, 3 + Math.floor(Math.random() * 3)); // Entre 3 y 5 sagas aleatorias
            
            if (sagasDelPersonaje.length === 0) {
                listaSagas.innerHTML = "<li>No aparece en ninguna saga</li>";
            } else {
                sagasDelPersonaje.forEach(saga => {
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <div class="saga-info">
                            <span class="saga-nombre">${saga.nombre}</span>
                            <span class="saga-ano">${saga.anoLanzamiento}</span>
                        </div>
                    `;
                    listaSagas.appendChild(li);
                });
            }
            
            // Mostrar modal
            modalDetalles.style.display = "block";
        })
        .catch(error => {
            console.error("Error al cargar detalles del personaje:", error);
            mostrarMensaje("Error al cargar los detalles del personaje.", "error");
        });
    }
    
    // Abrir modal para crear un nuevo personaje
    function abrirModalCrear() {
        document.getElementById("modalTitulo").textContent = "Crear Personaje";
        document.getElementById("personajeId").value = "";
        formPersonaje.reset();
        modalPersonaje.style.display = "block";
    }
    
    // Abrir modal para editar un personaje existente
    function editarPersonaje(id) {
        fetch(`${API_URL}/personajes/${id}`)
            .then(response => response.json())
            .then(personaje => {
                document.getElementById("modalTitulo").textContent = "Editar Personaje";
                document.getElementById("personajeId").value = personaje.id;
                document.getElementById("inputNombre").value = personaje.nombre;
                document.getElementById("inputRaza").value = personaje.raza;
                document.getElementById("inputNivelPoder").value = personaje.nivelPoder;
                document.getElementById("inputEsHeroe").checked = personaje.esHeroe;
                
                // Formatear la fecha para el input date (YYYY-MM-DD)
                const fecha = new Date(personaje.fechaNacimiento);
                const fechaFormateada = fecha.toISOString().split('T')[0];
                document.getElementById("inputFechaNacimiento").value = fechaFormateada;
                
                document.getElementById("inputBiografia").value = personaje.biografia;
                document.getElementById("inputImagenUrl").value = personaje.imagenUrl;
                
                modalPersonaje.style.display = "block";
            })
            .catch(error => {
                console.error("Error al cargar personaje para editar:", error);
                mostrarMensaje("Error al cargar los datos del personaje.", "error");
            });
    }
    
    // Guardar (crear o actualizar) un personaje
    function guardarPersonaje(event) {
        event.preventDefault();
        
        const personajeId = document.getElementById("personajeId").value;
        const esEdicion = personajeId !== "";
        
        const personaje = {
            nombre: document.getElementById("inputNombre").value,
            raza: document.getElementById("inputRaza").value,
            nivelPoder: parseFloat(document.getElementById("inputNivelPoder").value),
            esHeroe: document.getElementById("inputEsHeroe").checked,
            fechaNacimiento: document.getElementById("inputFechaNacimiento").value,
            biografia: document.getElementById("inputBiografia").value,
            imagenUrl: document.getElementById("inputImagenUrl").value
        };
        
        if (esEdicion) {
            personaje.id = parseInt(personajeId);
        }
        
        const url = esEdicion ? `${API_URL}/personajes/${personajeId}` : `${API_URL}/personajes`;
        const method = esEdicion ? "PUT" : "POST";
        
        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(personaje)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al guardar el personaje");
            }
            return response.json();
        })
        .then(data => {
            cerrarModalPersonaje();
            mostrarMensaje(`Personaje ${esEdicion ? "actualizado" : "creado"} correctamente`, "success");
            cargarPersonajes();
        })
        .catch(error => {
            console.error("Error al guardar personaje:", error);
            mostrarMensaje(`Error al ${esEdicion ? "actualizar" : "crear"} el personaje.`, "error");
        });
    }
    
    // Eliminar un personaje
    function eliminarPersonaje(id) {
        if (confirm("¿Estás seguro de que quieres eliminar este personaje? Esta acción no se puede deshacer.")) {
            fetch(`${API_URL}/personajes/${id}`, {
                method: "DELETE"
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al eliminar el personaje");
                }
                return response.text();
            })
            .then(data => {
                mostrarMensaje("Personaje eliminado correctamente", "success");
                cargarPersonajes();
            })
            .catch(error => {
                console.error("Error al eliminar personaje:", error);
                mostrarMensaje("Error al eliminar el personaje.", "error");
            });
        }
    }
    
    // Cerrar el modal de personaje
    function cerrarModalPersonaje() {
        modalPersonaje.style.display = "none";
        formPersonaje.reset();
    }
    
    // Mostrar mensaje de éxito o error
    function mostrarMensaje(mensaje, tipo) {
        // Comprobar si ya existe un mensaje y eliminarlo
        const mensajeExistente = document.querySelector(".mensaje-flash");
        if (mensajeExistente) {
            mensajeExistente.remove();
        }
        
        // Crear elemento de mensaje
        const mensajeElement = document.createElement("div");
        mensajeElement.classList.add("mensaje-flash", tipo);
        mensajeElement.textContent = mensaje;
        
        // Añadir al DOM
        document.body.appendChild(mensajeElement);
        
        // Mostrar con animación
        setTimeout(() => {
            mensajeElement.classList.add("mostrar");
        }, 10);
        
        // Eliminar después de 3 segundos
        setTimeout(() => {
            mensajeElement.classList.remove("mostrar");
            setTimeout(() => {
                mensajeElement.remove();
            }, 300);
        }, 3000);
    }
});

// Funciones auxiliares para el formato de fechas
function formatearFecha(fecha) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
}