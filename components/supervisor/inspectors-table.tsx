"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Pencil, Trash2, Phone, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import { getUser } from "@/lib/auth";

import {
  listarInspectoresPorSupervisor,
  eliminarInspector,
} from "../../servicios/inspector";

import { InspectorDialog } from "./inspector-dialog";

export function InspectorsTable() {
  const [inspectors, setInspectors] = useState([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInspector, setEditingInspector] = useState(null);


  const loadInspectors = async () => {
    try {
      const user = getUser();

      if (!user || !user.id) {
        console.error("⚠ No hay supervisor logueado");
        toast.error("No se pudo obtener el supervisor actual");
        return;
      }

      const data = await listarInspectoresPorSupervisor(user.id);
      setInspectors(data);
    } catch (error) {
      console.error(error);
      toast.error("❌ Error al cargar inspectores");
    }
  };



  useEffect(() => {
    loadInspectors();
  }, []);

  // 🟦 Filtrar por nombre o correo
  const filteredInspectors = inspectors.filter(
    (i: any) =>
      `${i.nombre} ${i.apellido}`.toLowerCase().includes(search.toLowerCase()) ||
      i.correo.toLowerCase().includes(search.toLowerCase())
  );

  // 🟦 Abrir modal para editar
  const handleEdit = (inspector: any) => {
    setEditingInspector(inspector);
    setDialogOpen(true);
  };

  // 🟦 Abrir modal vacío (crear)
  const handleAdd = () => {
    setEditingInspector(null);
    setDialogOpen(true);
  };

  // 🟦 Cierre del modal
  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingInspector(null);
    loadInspectors();
  };

  // 🟥 ELIMINAR — con confirmación PRO (igual al módulo de supervisores)
  const handleDelete = async (id: number, nombreCompleto: string) => {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.4)";
    overlay.style.zIndex = "999";
    overlay.style.transition = "opacity 0.3s ease";
    document.body.appendChild(overlay);

    const confirmToast = toast(
      (t) => (
        <div className="flex flex-col gap-4 p-2 text-center">
          <p className="text-base font-semibold text-gray-800">
            ¿Eliminar al inspector <b>{nombreCompleto}</b>?
          </p>

          <div className="flex justify-center gap-3">

            <button
              onClick={() => {
                toast.dismiss(t.id);
                document.body.removeChild(overlay);
              }}
              className="px-4 py-2 text-sm font-medium bg-white border rounded-md hover:bg-gray-100 text-black"
            >
              Cancelar
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t.id);
                document.body.removeChild(overlay);

                const promise = eliminarInspector(id).catch((err) => {
                  const msg = err?.message || "";

                  if (msg.includes("zonas asignadas")) {
                    return Promise.reject({
                      message:
                        "❌ Este inspector tiene zonas asignadas. Elimine o reasigne esas zonas antes de eliminarlo.",
                    });
                  }

                  return Promise.reject(err);
                });

                toast.promise(
                  promise,
                  {
                    loading: "Eliminando inspector...",
                    success: `Inspector "${nombreCompleto}" eliminado correctamente`,
                    error: (err) => err.message || "❌ Error al eliminar el inspector",
                  },
                  {
                    style: {
                      background: "#dc2626",
                      color: "#fff",
                      borderRadius: "8px",
                      fontWeight: 500,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                    },
                    iconTheme: {
                      primary: "#fff",
                      secondary: "#b91c1c",
                    },
                  }
                );

                try {
                  await promise;
                  await loadInspectors();
                } catch (err) {
                  /* 👌 NO MOSTRAR ERRORES EN CONSOLA */
                }
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      ),
      {
        duration: 8000,
        position: "top-center",
        style: {
          background: "#fff",
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          borderRadius: "12px",
          padding: "20px",
          width: "380px",
        },
      }
    );

    setTimeout(() => {
      overlay.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
      }, 300);
    }, 8000);
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inspectores Registrados</CardTitle>
              <CardDescription>Listado de inspectores activos</CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Inspector
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* 🔍 Buscador */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar inspector..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* 📄 Tabla */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Inspector</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Zona</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredInspectors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No hay inspectores registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInspectors.map((i: any) => (
                    <TableRow key={i.id_inspector}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{i.nombre.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {i.nombre} {i.apellido}
                            </p>
                            <p className="text-xs text-muted-foreground">Cédula: {i.cedula}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {i.correo}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {i.telefono}
                        </div>
                      </TableCell>

                      <TableCell>{i.zona_asignada}</TableCell>

                      <TableCell>
                        <Badge variant={i.borrado ? "default" : "outline"}>
                          {i.borrado ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(i)}
                          >
                            <Pencil className="w-4 h-4 text-blue-500" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDelete(i.id_inspector, `${i.nombre} ${i.apellido}`)
                            }
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 🟦 Modal */}
      <InspectorDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        inspector={editingInspector}
      />
    </>
  );
}
