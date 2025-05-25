// tecnicas.js
document.addEventListener("DOMContentLoaded", function() {
    // Variables globales
    const API_URL = "http://localhost:9999/api";
    const contenedorTecnicas = document.getElementById("contenedorTecnicas");
    const btnBuscarTecnica = document.getElementById("btnBuscarTecnica");
    const btnCrearTecnica = document.getElementById("btnCrearTecnica");
    const modalTecnica = document.getElementById("modalTecnica");
    const formTecnica = document.getElementById("formTecnica");
    const btnCancelarTecnica = document.getElementById("btnCancelarTecnica");
    
    // Función auxiliar para manejar URLs de imágenes
    function getImageUrl(url) {
        // Comprobar si es una URL externa
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            return url;
        } else if (url) {
            // Es una ruta local
            return `images/${url}`;
        } else {
            // URL no proporcionada, usar imagen por defecto
            return 'images/default-tecnica.png';
        }
    }
    
    // Actualizar el texto de ayuda en el formulario
    const labelImagenUrl = document.querySelector('label[for="inputImagenUrlTecnica"]');
    if (labelImagenUrl) {
        labelImagenUrl.innerHTML = 'URL de Imagen: <small>(URL completa de internet o nombre del archivo local)</small>';
    }
    
    // Elemento para cerrar el modal
    const cerrarModal = document.querySelector("#modalTecnica .modal-close");
    
    // Cargar técnicas al iniciar la página
    cargarTecnicas();
    
    // Event Listeners
    btnBuscarTecnica.addEventListener("click", buscarTecnicas);
    btnCrearTecnica.addEventListener("click", abrirModalCrearTecnica);
    btnCancelarTecnica.addEventListener("click", cerrarModalTecnica);
    formTecnica.addEventListener("submit", guardarTecnica);
    
    // Cerrar modal con el botón de cerrar
    cerrarModal.addEventListener("click", function() {
        modalTecnica.style.display = "none";
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener("click", function(event) {
        if (event.target === modalTecnica) {
            modalTecnica.style.display = "none";
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
        // Animación para todas las técnicas
        const tecnicasCards = contenedorTecnicas.querySelectorAll(".tecnica-card");
        tecnicasCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add("power-up-animation");
                setTimeout(() => {
                    card.classList.remove("power-up-animation");
                }, 1000);
            }, index * 100);
        });
    });
    
    // Funciones
    
    // Cargar todas las técnicas
    function cargarTecnicas() {
        fetch(`${API_URL}/tecnicas/todas`)
            .then(response => response.json())
            .then(data => {
                mostrarTecnicasEnGrid(data);
            })
            .catch(error => {
                console.error("Error al cargar técnicas:", error);
                mostrarMensaje("Error al cargar las técnicas. Por favor, inténtalo de nuevo más tarde.", "error");
            });
    }
    
    // Buscar técnicas con los criterios de búsqueda
    function buscarTecnicas() {
        const nombre = document.getElementById("nombreTecnica").value;
        
        fetch(`${API_URL}/tecnicas?nombre=${encodeURIComponent(nombre)}`)
            .then(response => response.json())
            .then(data => {
                mostrarTecnicasEnGrid(data);
            })
            .catch(error => {
                console.error("Error al buscar técnicas:", error);
                mostrarMensaje("Error al buscar técnicas. Por favor, inténtalo de nuevo más tarde.", "error");
            });
    }
    
    // Mostrar técnicas en el grid
    function mostrarTecnicasEnGrid(tecnicas) {
        contenedorTecnicas.innerHTML = "";
        
        if (tecnicas.length === 0) {
            contenedorTecnicas.innerHTML = `
                <div class="no-results">
                    <p>No se encontraron técnicas</p>
                </div>
            `;
            return;
        }
        
        tecnicas.forEach(tecnica => {
            const tecnicaCard = document.createElement("div");
            tecnicaCard.classList.add("tecnica-card");
            
            // Colores diferentes según el nivel de daño
            let colorClase = "bajo";
            if (tecnica.nivelDano >= 70) {
                colorClase = "alto";
            } else if (tecnica.nivelDano >= 40) {
                colorClase = "medio";
            }
            
            // Añadir imagen si está disponible
            const imagenHTML = tecnica.imagenUrl ? 
                `<div class="tecnica-imagen">
                    <img src="${getImageUrl(tecnica.imagenUrl)}" alt="${tecnica.nombre}" class="tecnica-img">
                </div>` : '';
            
            tecnicaCard.innerHTML = `
                <div class="tecnica-header nivel-${colorClase}">
                    <div class="tecnica-nombre">${tecnica.nombre}</div>
                    <div class="tecnica-nivel-dano">Nivel ${tecnica.nivelDano}</div>
                </div>
                <div class="tecnica-body">
                    ${imagenHTML}
                    <p class="tecnica-descripcion">${tecnica.descripcion}</p>
                    <div class="tecnica-actions">
                        <button class="btn btn-action btn-edit" data-id="${tecnica.id}">Editar</button>
                        <button class="btn btn-action btn-delete" data-id="${tecnica.id}">Eliminar</button>
                    </div>
                </div>
            `;
            
            contenedorTecnicas.appendChild(tecnicaCard);
            
            // Event listeners para los botones de acciones
            const btnEditar = tecnicaCard.querySelector(".btn-edit");
            const btnEliminar = tecnicaCard.querySelector(".btn-delete");
            
            btnEditar.addEventListener("click", () => editarTecnica(tecnica.id));
            btnEliminar.addEventListener("click", () => eliminarTecnica(tecnica.id));
        });
    }
    
    // Abrir modal para crear una nueva técnica
    function abrirModalCrearTecnica() {
        document.getElementById("modalTituloTecnica").textContent = "Crear Técnica";
        document.getElementById("tecnicaId").value = "";
        formTecnica.reset();
        modalTecnica.style.display = "block";
    }
    
    // Abrir modal para editar una técnica existente
    function editarTecnica(id) {
        fetch(`${API_URL}/tecnicas/${id}`)
            .then(response => response.json())
            .then(tecnica => {
                document.getElementById("modalTituloTecnica").textContent = "Editar Técnica";
                document.getElementById("tecnicaId").value = tecnica.id;
                document.getElementById("inputNombreTecnica").value = tecnica.nombre;
                document.getElementById("inputDescripcionTecnica").value = tecnica.descripcion;
                document.getElementById("inputNivelDano").value = tecnica.nivelDano;
                
                // Cargar URL de imagen si existe
                if (document.getElementById("inputImagenUrlTecnica")) {
                    document.getElementById("inputImagenUrlTecnica").value = tecnica.imagenUrl || '';
                }
                
                modalTecnica.style.display = "block";
            })
            .catch(error => {
                console.error("Error al cargar técnica para editar:", error);
                mostrarMensaje("Error al cargar los datos de la técnica.", "error");
            });
    }
    
    // Guardar (crear o actualizar) una técnica
    function guardarTecnica(event) {
        event.preventDefault();
        
        const tecnicaId = document.getElementById("tecnicaId").value;
        const esEdicion = tecnicaId !== "";
        
        const tecnica = {
            nombre: document.getElementById("inputNombreTecnica").value,
            descripcion: document.getElementById("inputDescripcionTecnica").value,
            nivelDano: parseInt(document.getElementById("inputNivelDano").value)
        };
        
        // Añadir URL de imagen si existe el campo
        const inputImagenUrl = document.getElementById("inputImagenUrlTecnica");
        if (inputImagenUrl) {
            tecnica.imagenUrl = inputImagenUrl.value;
        }
        
        if (esEdicion) {
            tecnica.id = parseInt(tecnicaId);
        }
        
        const url = esEdicion ? `${API_URL}/tecnicas/${tecnicaId}` : `${API_URL}/tecnicas`;
        const method = esEdicion ? "PUT" : "POST";
        
        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tecnica)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al guardar la técnica");
            }
            return response.json();
        })
        .then(data => {
            cerrarModalTecnica();
            mostrarMensaje(`Técnica ${esEdicion ? "actualizada" : "creada"} correctamente`, "success");
            cargarTecnicas();
        })
        .catch(error => {
            console.error("Error al guardar técnica:", error);
            mostrarMensaje(`Error al ${esEdicion ? "actualizar" : "crear"} la técnica.`, "error");
        });
    }
    
    // Eliminar una técnica
    function eliminarTecnica(id) {
        if (confirm("¿Estás seguro de que quieres eliminar esta técnica? Esta acción no se puede deshacer.")) {
            fetch(`${API_URL}/tecnicas/${id}`, {
                method: "DELETE"
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al eliminar la técnica");
                }
                return response.text();
            })
            .then(data => {
                mostrarMensaje("Técnica eliminada correctamente", "success");
                cargarTecnicas();
            })
            .catch(error => {
                console.error("Error al eliminar técnica:", error);
                mostrarMensaje("Error al eliminar la técnica.", "error");
            });
        }
    }
    
    // Cerrar el modal de técnica
    function cerrarModalTecnica() {
        modalTecnica.style.display = "none";
        formTecnica.reset();
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