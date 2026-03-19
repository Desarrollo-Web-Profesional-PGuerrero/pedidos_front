// frontend/src/componentes/PedidoList.jsx
import { useState, useEffect } from "react";
import API from "../servicios/api";

function PedidoList() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const response = await API.get("/pedidos");
      console.log("📦 Pedidos recibidos (RAW):", response.data);
      
      // Analizar la estructura de cada pedido
      response.data.forEach((pedido, index) => {
        console.log(`📊 Pedido ${index}:`, {
          _id: pedido._id,
          cliente: pedido.cliente,
          tipoCliente: typeof pedido.cliente,
          esObjeto: pedido.cliente && typeof pedido.cliente === 'object',
          tieneUsername: pedido.cliente?.username ? true : false,
          username: pedido.cliente?.username,
          clienteEsString: typeof pedido.cliente === 'string',
          clienteId: typeof pedido.cliente === 'string' ? pedido.cliente : null
        });
      });
      
      setPedidos(response.data);
      setError(null);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
      setError("Error al cargar los pedidos");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este pedido?")) {
      try {
        await API.delete(`/pedidos/${id}`);
        setPedidos(pedidos.filter(pedido => pedido._id !== id));
        alert("✅ Pedido eliminado correctamente");
      } catch (error) {
        console.error("Error eliminando pedido:", error);
        alert("❌ Error al eliminar el pedido");
      }
    }
  };

  // Función mejorada para obtener el nombre del cliente
  const getNombreCliente = (pedido) => {
    // Caso 1: populate funcionó correctamente
    if (pedido.cliente && typeof pedido.cliente === 'object') {
      if (pedido.cliente.username) {
        return pedido.cliente.username;
      }
      return `Cliente ID: ${pedido.cliente._id?.slice(-6) || 'desconocido'}`;
    }
    
    // Caso 2: solo tenemos el ID del cliente
    if (pedido.cliente && typeof pedido.cliente === 'string') {
      return `Cliente ID: ${pedido.cliente.slice(-6)}`;
    }
    
    // Caso 3: no hay información del cliente
    return "Cliente no disponible";
  };

  // Filtrar pedidos
  const pedidosFiltrados = pedidos.filter(pedido => {
    const nombreCliente = getNombreCliente(pedido).toLowerCase();
    return nombreCliente.includes(filtro.toLowerCase()) ||
           pedido._id?.toLowerCase().includes(filtro.toLowerCase());
  });

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-600 p-4">
      <p>{error}</p>
      <button 
        onClick={cargarPedidos}
        className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            📋 Lista de Pedidos
          </h1>
          
          {/* Barra de búsqueda */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Buscar por cliente..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={cargarPedidos}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <span>↻</span> Actualizar
            </button>
          </div>
        </div>

        {pedidosFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No hay pedidos para mostrar</p>
            {filtro && (
              <button
                onClick={() => setFiltro("")}
                className="mt-2 text-indigo-600 hover:text-indigo-800"
              >
                Limpiar filtro
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {pedidosFiltrados.map((pedido) => (
              <div
                key={pedido._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    {/* Cliente e ID */}
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {getNombreCliente(pedido)}
                      </h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        ID: {pedido._id.slice(-8)}
                      </span>
                    </div>
                    
                    {/* Fechas y montos */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">📅 Solicitud</p>
                        <p className="font-medium text-sm">
                          {new Date(pedido.fecha_solicitud).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">📦 Envío</p>
                        <p className="font-medium text-sm">
                          {new Date(pedido.fecha_envio).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">💰 Total</p>
                        <p className="font-medium text-green-600">
                          ${pedido.total?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">💵 Abono</p>
                        <p className="font-medium text-blue-600">
                          ${(pedido.abono || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Métodos de pago */}
                    <div className="flex flex-wrap gap-2">
                      {pedido.pagado?.map((metodo, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full"
                        >
                          {metodo}
                        </span>
                      ))}
                    </div>

                    {/* Comentario */}
                    {pedido.comentario && (
                      <p className="text-gray-600 text-sm border-t pt-2 mt-2">
                        <span className="font-medium">📝 Comentario:</span> {pedido.comentario}
                      </p>
                    )}
                  </div>

                  {/* Botón eliminar */}
                  <button
                    onClick={() => handleEliminar(pedido._id)}
                    className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>

                {/* Fechas de creación/actualización */}
                <div className="mt-3 pt-3 border-t text-xs text-gray-400 flex gap-4">
                  <span>Creado: {new Date(pedido.createdAt).toLocaleString()}</span>
                  <span>Actualizado: {new Date(pedido.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PedidoList;