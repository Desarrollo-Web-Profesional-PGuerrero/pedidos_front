import { useState, useEffect } from "react";
import API from "../servicios/api";

function PedidoForm() {
  const [form, setForm] = useState({
    cliente: "", // ID del cliente
    fecha_solicitud: "",
    fecha_envio: "",
    total: "",
    pagado: [],
    abono: "",
    comentario: ""
  });

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar clientes disponibles
useEffect(() => {
  const cargarClientes = async () => {
    try {
      console.log("Cargando clientes...");
      // Usa el nuevo endpoint
      const response = await API.get("/usuarios");
      console.log("Respuesta del servidor:", response.data);
      
      if (Array.isArray(response.data)) {
        // Mapear los datos para mostrar username
        const clientesMapeados = response.data.map(usuario => ({
          _id: usuario._id,
          nombre: usuario.username,
          telefono: "No disponible"
        }));
        
        console.log("Clientes mapeados:", clientesMapeados);
        setClientes(clientesMapeados);
      } else {
        console.error("La respuesta no es un array:", response.data);
        setClientes([]);
      }
    } catch (error) {
      console.error("Error detallado:", error);
      
      // Mostrar más información del error
      if (error.response) {
        console.error("Respuesta del servidor:", error.response.data);
        console.error("Status:", error.response.status);
      }
      
      // Datos de ejemplo para pruebas
      setClientes([
        { _id: "1", nombre: "Usuario Demo 1", telefono: "---" },
        { _id: "2", nombre: "Usuario Demo 2", telefono: "---" }
      ]);
    }
  };
  cargarClientes();
}, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handlePagadoChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setForm({
        ...form,
        pagado: [...form.pagado, value]
      });
    } else {
      setForm({
        ...form,
        pagado: form.pagado.filter((metodo) => metodo !== value)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Validar que se seleccionó un cliente
      if (!form.cliente) {
        alert("Por favor selecciona un cliente");
        setLoading(false);
        return;
      }

      // Preparar los datos para enviar
      const pedidoData = {
        cliente: form.cliente,
        fecha_solicitud: form.fecha_solicitud,
        fecha_envio: form.fecha_envio,
        total: parseFloat(form.total) || 0,
        pagado: form.pagado,
        abono: form.abono ? parseFloat(form.abono) : 0,
        comentario: form.comentario || ""
      };

      console.log("Enviando pedido:", pedidoData);

      const response = await API.post("/pedidos", pedidoData);
      console.log("Respuesta del servidor:", response.data);
      
      alert("✅ Pedido guardado correctamente");
      
      // Resetear formulario
      setForm({
        cliente: "",
        fecha_solicitud: "",
        fecha_envio: "",
        total: "",
        pagado: [],
        abono: "",
        comentario: ""
      });
    } catch (error) {
      console.error("Error detallado:", error);
      
      // Mensaje de error más descriptivo
      let mensajeError = "Error al guardar el pedido";
      if (error.response) {
        // El servidor respondió con un error
        mensajeError = error.response.data?.message || 
                      error.response.data?.error || 
                      `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        mensajeError = "No se pudo conectar con el servidor";
      } else {
        // Error al configurar la petición
        mensajeError = error.message;
      }
      
      alert("❌ " + mensajeError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-8">
        
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          📦 Registro de Pedido
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Selección de Cliente */}
          <div>
            <label className="block font-medium mb-1">
              Cliente <span className="text-red-500">*</span>
            </label>
            <select
              name="cliente"
              value={form.cliente}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Selecciona un cliente --</option>
              {clientes.length > 0 ? (
                clientes.map((cliente) => (
                  <option key={cliente._id} value={cliente._id}>
                    {cliente.nombre} - {cliente.telefono}
                  </option>
                ))
              ) : (
                <option value="" disabled>Cargando clientes...</option>
              )}
            </select>
            {clientes.length === 0 && !loading && (
              <p className="text-sm text-yellow-600 mt-1">
                ⚠️ No hay clientes disponibles. Agrega clientes en la base de datos.
              </p>
            )}
          </div>

          {/* Métodos de Pago */}
          <div>
            <label className="block font-medium mb-2">
              Métodos de Pago
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["Efectivo", "Transferencia", "Tarjeta", "Depósito"].map((metodo) => (
                <label
                  key={metodo}
                  className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg cursor-pointer hover:bg-indigo-100 transition"
                >
                  <input
                    type="checkbox"
                    value={metodo}
                    checked={form.pagado.includes(metodo)}
                    onChange={handlePagadoChange}
                    className="accent-indigo-600"
                  />
                  <span>{metodo}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Fecha Solicitud <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fecha_solicitud"
                value={form.fecha_solicitud}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Fecha Envío <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fecha_envio"
                value={form.fecha_envio}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Total y Abono */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Total ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="total"
                value={form.total}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Abono ($)</label>
              <input
                type="number"
                name="abono"
                value={form.abono}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Comentario */}
          <div>
            <label className="block font-medium mb-1">Comentario</label>
            <textarea
              name="comentario"
              value={form.comentario}
              onChange={handleChange}
              rows="3"
              placeholder="Escribe algún comentario adicional..."
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Guardando...
              </span>
            ) : "Guardar Pedido"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default PedidoForm;