const carrerasSanMarcosDashboard = {
  A: ["Medicina Humana", "Obstetricia", "Enfermería", "Tecnología Médica", "Farmacia y Bioquímica", "Odontología", "Medicina Veterinaria", "Psicología"],
  B: ["Química", "Física", "Matemática", "Estadística", "Genética y Biotecnología", "Microbiología y Parasitología", "Biología"],
  C: ["Ingeniería Industrial", "Ingeniería de Sistemas", "Ingeniería de Software", "Ingeniería Civil", "Ingeniería Ambiental", "Ingeniería Electrónica", "Ingeniería Biomédica", "Ingeniería Mecánica de Fluidos"],
  D: ["Administración", "Administración de Negocios Internacionales", "Contabilidad", "Economía", "Negocios Internacionales"],
  E: ["Derecho", "Ciencia Política", "Literatura", "Filosofía", "Comunicación Social", "Arqueología", "Historia", "Sociología", "Educación"]
};

document.addEventListener("DOMContentLoaded", () => {
  const usuarioStr = localStorage.getItem("usuarioLumis");
  if (!usuarioStr) {
      alert("⚠️ No hay sesión activa. Por favor inicia sesión.");
      window.location.href = "../01_html/02_login.html";
      return;
  }

  let usuario = JSON.parse(usuarioStr);

  // Elementos del perfil
  const perfilNombre = document.getElementById("perfilNombre");
  const perfilHandle = document.getElementById("perfilHandle");
  const perfilDetalleCarrera = document.getElementById("perfilDetalleCarrera");
  const perfilId = document.getElementById("perfilId");
  const perfilAvatar = document.getElementById("perfilAvatar");
  const avatarFallback = document.getElementById("avatarFallback");
  const btnEditarHandle = document.getElementById("btnEditarHandle");
  const fechaHoy = document.getElementById("fechaHoy");

  // Función para actualizar la vista de la tarjeta de usuario
  function actualizarInterfazUsuario() {
      perfilNombre.textContent = usuario.nombre || "Estudiante";
      
      // Asegurar que el handle siempre tenga el símbolo @
      let handleLimpio = usuario.handle || "@usuario";
      if (!handleLimpio.startsWith("@")) {
          handleLimpio = "@" + handleLimpio;
      }
      perfilHandle.textContent = handleLimpio;
      perfilId.textContent = `ID: #${usuario.id || "000000"}`;

      // Mostrar tipo, área y carrera correctamente sin textos genéricos
      if (usuario.tipo === "pre") {
          perfilDetalleCarrera.textContent = `Pre-Universitaria • Área ${usuario.area || "A"} • ${usuario.carrera || ""}`;
      } else if (usuario.tipo === "uni") {
          perfilDetalleCarrera.textContent = `Universitaria • ${usuario.carrera || ""}`;
      } else {
          perfilDetalleCarrera.textContent = "Estudiante Lumis";
      }

      // Mostrar foto si existe
      if (usuario.foto) {
          perfilAvatar.src = usuario.foto;
          perfilAvatar.style.display = "block";
          avatarFallback.style.display = "none";
      } else {
          perfilAvatar.style.display = "none";
          avatarFallback.style.display = "flex";
      }
  }

  actualizarInterfazUsuario();

  // Fecha actual
  const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  fechaHoy.textContent = new Date().toLocaleDateString('es-ES', opcionesFecha);

  // Modal interactivo para editar perfil completo (Nombre, Handle, Foto, Tipo y Carrera)
  btnEditarHandle.addEventListener("click", () => {
      // Crear modal dinámicamente
      const modalOverlay = document.createElement("div");
      modalOverlay.className = "modal-overlay";

      modalOverlay.innerHTML = `
          <div class="modal-contenido">
              <h3>Editar Perfil 🌸</h3>
              
              <div class="campo-grupo">
                  <label>Nombre</label>
                  <input type="text" id="editNombre" value="${usuario.nombre || ""}">
              </div>

              <div class="campo-grupo">
                  <label>Usuario (@) <span style="font-size:0.6rem; opacity:0.7;">(c/30 días)</span></label>
                  <input type="text" id="editHandle" value="${usuario.handle || ""}">
              </div>

              <div class="campo-grupo">
                  <label>Foto de Perfil (URL o Imagen)</label>
                  <input type="file" id="editFotoFile" accept="image/*">
              </div>

              <div class="campo-grupo">
                  <label>Tipo de Estudiante</label>
                  <select id="editTipo">
                      <option value="pre" ${usuario.tipo === 'pre' ? 'selected' : ''}>Pre-Universitario</option>
                      <option value="uni" ${usuario.tipo === 'uni' ? 'selected' : ''}>Universitario</option>
                  </select>
              </div>

              <div class="campo-grupo" id="editGrupoArea" style="display: ${usuario.tipo === 'pre' ? 'flex' : 'none'};">
                  <label>Área (UNMSM)</label>
                  <select id="editArea">
                      <option value="A" ${usuario.area === 'A' ? 'selected' : ''}>Área A</option>
                      <option value="B" ${usuario.area === 'B' ? 'selected' : ''}>Área B</option>
                      <option value="C" ${usuario.area === 'C' ? 'selected' : ''}>Área C</option>
                      <option value="D" ${usuario.area === 'D' ? 'selected' : ''}>Área D</option>
                      <option value="E" ${usuario.area === 'E' ? 'selected' : ''}>Área E</option>
                  </select>
              </div>

              <div class="campo-grupo">
                  <label id="editLabelCarrera">${usuario.tipo === 'pre' ? 'Carrera a Postular' : 'Carrera Universitaria'}</label>
                  <select id="editCarrera">
                      <!-- Se llena dinámicamente -->
                  </select>
              </div>

              <div class="modal-botones">
                  <button type="button" id="btnGuardarCambios" class="btn-guardar-modal">Guardar</button>
                  <button type="button" id="btnCerrarModal" class="btn-cancelar-modal">Cancelar</button>
              </div>
          </div>
      `;

      document.body.appendChild(modalOverlay);

      // Referencias del modal
      const editTipo = document.getElementById("editTipo");
      const editGrupoArea = document.getElementById("editGrupoArea");
      const editArea = document.getElementById("editArea");
      const editCarrera = document.getElementById("editCarrera");
      const editLabelCarrera = document.getElementById("editLabelCarrera");
      const editHandleInput = document.getElementById("editHandle");

      // --- INDICADOR EN VIVO DE DISPONIBILIDAD DEL @ ---
      const indicadorModalHandle = document.createElement("div");
      indicadorModalHandle.style.cssText = "font-size: 0.75rem; margin-top: 3px; font-weight: bold;";
      editHandleInput.parentNode.appendChild(indicadorModalHandle);

      editHandleInput.addEventListener("input", (e) => {
          let valor = e.target.value.trim();
          if (!valor.startsWith("@") && valor.length > 0) {
              valor = "@" + valor;
              editHandleInput.value = valor;
          }

          if (valor === usuario.handle) {
              indicadorModalHandle.textContent = "✨ Es tu usuario actual";
              indicadorModalHandle.style.color = "var(--color-titulo)";
              return;
          }

          const listaUsuarios = JSON.parse(localStorage.getItem("listaUsuariosLumis")) || [];
          const handleOcupado = listaUsuarios.some(u => u.handle.toLowerCase() === valor.toLowerCase() && u.id !== usuario.id);

          if (handleOcupado) {
              indicadorModalHandle.textContent = "❌ Este @ ya está en uso por otro estudiante";
              indicadorModalHandle.style.color = "#ff5f56";
          } else {
              indicadorModalHandle.textContent = "✅ @ disponible";
              indicadorModalHandle.style.color = "#27c93f";
          }
      });

      function actualizarSelectCarrerasModal() {
          editCarrera.innerHTML = "";
          const tipoVal = editTipo.value;

          if (tipoVal === "pre") {
              editGrupoArea.style.display = "flex";
              editLabelCarrera.textContent = "Carrera a Postular";
              const areaSel = editArea.value || "A";
              if (carrerasSanMarcosDashboard[areaSel]) {
                  carrerasSanMarcosDashboard[areaSel].forEach(c => {
                      const opt = document.createElement("option");
                      opt.value = c;
                      opt.textContent = c;
                      if (c === usuario.carrera) opt.selected = true;
                      editCarrera.appendChild(opt);
                  });
              }
          } else {
              editGrupoArea.style.display = "none";
              editLabelCarrera.textContent = "Carrera Universitaria";
              Object.keys(carrerasSanMarcosDashboard).forEach(areaKey => {
                  carrerasSanMarcosDashboard[areaKey].forEach(c => {
                      const opt = document.createElement("option");
                      opt.value = c;
                      opt.textContent = `${c} (Área ${areaKey})`;
                      if (c === usuario.carrera) opt.selected = true;
                      editCarrera.appendChild(opt);
                  });
              });
          }
      }

      editTipo.addEventListener("change", actualizarSelectCarrerasModal);
      editArea.addEventListener("change", actualizarSelectCarrerasModal);
      actualizarSelectCarrerasModal();

      // Guardar cambios del modal
      document.getElementById("btnGuardarCambios").addEventListener("click", () => {
          const nuevoHandle = editHandleInput.value.trim();
          const handleConArroba = nuevoHandle.startsWith("@") ? nuevoHandle : "@" + nuevoHandle;
          
          const listaUsuarios = JSON.parse(localStorage.getItem("listaUsuariosLumis")) || [];

          if (handleConArroba !== usuario.handle) {
              const ocupado = listaUsuarios.some(u => u.handle.toLowerCase() === handleConArroba.toLowerCase() && u.id !== usuario.id);
              if (ocupado) {
                  alert("❌ No puedes usar este @ porque ya le pertenece a otro usuario.");
                  return;
              }

              const ahora = new Date().getTime();
              const ultimoCambio = usuario.ultimoCambioHandle || 0;
              const treintaDiasMs = 30 * 24 * 60 * 60 * 1000;

              if (ahora - ultimoCambio < treintaDiasMs) {
                  const diasFaltantes = Math.ceil((treintaDiasMs - (ahora - ultimoCambio)) / (1000 * 60 * 60 * 24));
                  alert(`⏳ Solo puedes cambiar tu usuario (@) cada 30 días.\nTe faltan ${diasFaltantes} días.`);
                  return;
              }
              usuario.ultimoCambioHandle = ahora;
              usuario.handle = handleConArroba;
          }

          usuario.nombre = document.getElementById("editNombre").value.trim();
          usuario.tipo = editTipo.value;
          usuario.area = editTipo.value === 'pre' ? editArea.value : '';
          usuario.carrera = editCarrera.value;

          // Actualizar también en la lista general de usuarios de localStorage
          const index = listaUsuarios.findIndex(u => u.id === usuario.id);
          if (index !== -1) {
              listaUsuarios[index] = usuario;
              localStorage.setItem("listaUsuariosLumis", JSON.stringify(listaUsuarios));
          }

          // Manejar foto si se seleccionó archivo nuevo
          const fileInput = document.getElementById("editFotoFile");
          if (fileInput.files && fileInput.files[0]) {
              const reader = new FileReader();
              reader.onload = function(e) {
                  usuario.foto = e.target.result;
                  localStorage.setItem("usuarioLumis", JSON.stringify(usuario));
                  actualizarInterfazUsuario();
                  modalOverlay.remove();
                  alert("✨ ¡Perfil actualizado con éxito!");
              };
              reader.readAsDataURL(fileInput.files[0]);
          } else {
              localStorage.setItem("usuarioLumis", JSON.stringify(usuario));
              actualizarInterfazUsuario();
              modalOverlay.remove();
              alert("✨ ¡Perfil actualizado con éxito!");
          }
      });

      document.getElementById("btnCerrarModal").addEventListener("click", () => {
          modalOverlay.remove();
      });
  });

  // Manejo de Temas y Modo Oscuro en el Dashboard
  const circulosTemas = document.querySelectorAll(".circulo-tema");
  const btnModoOscuro = document.getElementById("btnModoOscuro");
  const iconoModo = document.getElementById("iconoModo");
  const textoModo = document.getElementById("textoModo");

  let temaActual = usuario.tema || "mint";
  let modoOscuroActivo = usuario.modoOscuro || false;

  aplicarTemaVisual(temaActual, modoOscuroActivo);
  if (modoOscuroActivo) {
      btnModoOscuro.classList.add("activo");
      iconoModo.textContent = "☀️";
      textoModo.textContent = "Modo Oscuro: ON";
  }

  circulosTemas.forEach(circulo => {
      circulo.addEventListener("click", () => {
          circulosTemas.forEach(c => c.classList.remove("activo"));
          circulo.classList.add("activo");
          temaActual = circulo.getAttribute("data-tema");
          usuario.tema = temaActual;
          localStorage.setItem("usuarioLumis", JSON.stringify(usuario));
          aplicarTemaVisual(temaActual, modoOscuroActivo);
      });
  });

  if (btnModoOscuro) {
      btnModoOscuro.addEventListener("click", () => {
          modoOscuroActivo = !modoOscuroActivo;
          usuario.modoOscuro = modoOscuroActivo;
          localStorage.setItem("usuarioLumis", JSON.stringify(usuario));

          if (modoOscuroActivo) {
              btnModoOscuro.classList.add("activo");
              iconoModo.textContent = "☀️";
              textoModo.textContent = "Modo Oscuro: ON";
          } else {
              btnModoOscuro.classList.remove("activo");
              iconoModo.textContent = "🌙";
              textoModo.textContent = "Modo Oscuro: OFF";
          }
          aplicarTemaVisual(temaActual, modoOscuroActivo);
      });
  }

  function aplicarTemaVisual(tema, esOscuro) {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.removeAttribute("data-mode");

      if (tema !== "mint") {
          document.documentElement.setAttribute("data-theme", tema);
      }
      if (esOscuro) {
          document.documentElement.setAttribute("data-mode", "dark");
      }
  }

  // Botón Cerrar Sesión
  document.getElementById("btnLogout").addEventListener("click", () => {
      window.location.href = "02_login.html";
  });
});