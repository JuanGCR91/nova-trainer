import { Usuario } from "../../../types";

export default function UsuariosTable({
  usuarios,
  onDelete,
  onEdit,
}: {
  usuarios: Usuario[];
  onDelete: (id: number) => void;
  onEdit: (usuario: Usuario) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-graphite rounded-lg">
        <thead>
          <tr className="bg-ultramar text-white">
            <th className="py-2 px-3">Nombre</th>
            <th className="py-2 px-3">Rol</th>
            <th className="py-2 px-3">Email</th>
            <th className="py-2 px-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-6 text-center text-gray-500">
                No hay usuarios registrados.
              </td>
            </tr>
          ) : (
            usuarios.map((u) => (
              <tr key={u.id} className="border-b last:border-none hover:bg-skyblue/10">
                <td className="py-2 px-3">{u.nombre}</td>
                <td className="py-2 px-3">{u.rol}</td>
                <td className="py-2 px-3">{u.email}</td>
                <td className="py-2 px-3 flex gap-2">
                  <button
                    className="bg-skyblue text-white px-3 py-1 rounded hover:bg-ultramar transition text-sm"
                    onClick={() => onEdit(u)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-limelime text-graphite px-3 py-1 rounded hover:bg-ultramar hover:text-white transition text-sm"
                    onClick={() => onDelete(u.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
