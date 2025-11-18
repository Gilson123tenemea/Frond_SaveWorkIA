"use client";

import { useState, useEffect } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";

import { Search, Plus, Pencil, Trash2, MapPin } from "lucide-react";
import toast from "react-hot-toast";

import { getUser } from "@/lib/auth";
import {
  listarAsignacionesPorEmpresa,
  eliminarAsignacion
} from "@/servicios/zona_inspector";

import { ZoneAssignForm } from "./zone-assignment-dialog";

export function ZoneAssignmentsTable() {
  const [asignaciones, setAsignaciones] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const loadAsignaciones = async () => {
    const user = getUser();
    const empresaId = user?.id_empresa_supervisor;
    if (!empresaId) return;

    const data = await listarAsignacionesPorEmpresa(empresaId);
    setAsignaciones(data);
  };

  useEffect(() => { loadAsignaciones(); }, []);

  // 🔎 FILTRO
  const filtered = asignaciones.filter((a) =>
    `${a.inspector_nombre} ${a.inspector_apellido} ${a.zona_nombre}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 🟥 ELIMINAR CON DISEÑO PROFESIONAL
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

    toast(
      (t) => (
        <div className="flex flex-col gap-4 p-2 text-center">
          <p className="text-base font-semibold text-gray-800">
            ¿Eliminar asignación del inspector <b>{nombreCompleto}</b>?
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                document.body.removeChild(overlay);
              }}
              className="px-4 py-2 bg-white border rounded-md hover:bg-gray-100 text-black"
            >
              Cancelar
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t.id);
                document.body.removeChild(overlay);

                const promise = eliminarAsignacion(id);

                toast.promise(promise, {
                  loading: "Eliminando asignación...",
                  success: "Asignación eliminada correctamente",
                  error: "❌ Error al eliminar la asignación"
                });

                await promise;
                loadAsignaciones();
              }}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
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
          width: "380px"
        }
      }
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inspectores Asignados</CardTitle>
              <CardDescription>Listado de asignaciones activas</CardDescription>
            </div>
            <Button onClick={() => { setEditingItem(null); setDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" /> Agregar Asignación
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Buscador */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar inspector o zona..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* TABLA */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Inspector Asignado</TableHead>
                  <TableHead>Zona</TableHead>
                  <TableHead>Fecha Asignación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No hay asignaciones registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((a) => (
                    <TableRow key={a.id_inspector_zona}>
                      {/* Inspector */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{a.inspector_nombre.charAt(0)}</AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="font-medium">
                              {a.inspector_nombre} {a.inspector_apellido}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Cédula: {a.inspector_cedula}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Zona */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {a.zona_nombre}
                        </div>
                      </TableCell>

                      {/* Fecha */}
                      <TableCell>{a.fecha_asignacion}</TableCell>

                      {/* Acciones */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm"
                            onClick={() => {
                              setEditingItem(a);
                              setDialogOpen(true);
                            }}>
                            <Pencil className="w-4 h-4" />
                          </Button>

                          <Button variant="ghost" size="sm"
                            onClick={() =>
                              handleDelete(
                                a.id_inspector_zona,
                                `${a.inspector_nombre} ${a.inspector_apellido}`
                              )
                            }>
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

      {/* MODAL EDITAR/CREAR */}
      <ZoneAssignForm
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); loadAsignaciones(); }}
        editingItem={editingItem}
      />
    </>
  );
}
