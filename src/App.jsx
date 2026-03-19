// frontend/src/App.jsx
import { useState } from "react";
import PedidoForm from './componentes/PedidoForm';
import PedidoList from './componentes/PedidoList';

function App() {
  const [vista, setVista] = useState("form"); // "form" o "list"

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra de navegación */}
      <nav className="bg-white shadow-lg mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">
                🛒 Sistema de Pedidos
              </h1>
            </div>
            <div className="flex space-x-4 items-center">
              <button
                onClick={() => setVista("form")}
                className={`px-4 py-2 rounded-md ${
                  vista === "form" 
                    ? "bg-indigo-600 text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                + Nuevo Pedido
              </button>
              <button
                onClick={() => setVista("list")}
                className={`px-4 py-2 rounded-md ${
                  vista === "list" 
                    ? "bg-indigo-600 text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                📋 Ver Pedidos
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4">
        {vista === "form" ? <PedidoForm /> : <PedidoList />}
      </div>
    </div>
  );
}

export default App;