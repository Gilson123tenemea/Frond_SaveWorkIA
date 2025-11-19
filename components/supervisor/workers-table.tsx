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
import {
  Search,
  MapPin,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import { toast } from "react-hot-toast";
import { getUser } from "@/lib/auth";

// Servicios API reales
import {
  listarTrabajadoresPorSupervisor,
  eliminarTrabajador,
} from "@/servicios/trabajador";

import { WorkerDialog } from "./worker-dialog";
import { AssignWorkerZonesDialog } from "./assign-worker-zones-dialog";

// ===============================
// 🔥 Tipo adaptado al backend real
// ===============================
export interface WorkerAPI {
  id_trabajador: number;
  codigo_trabajador: string;
  implementos_requeridos: string;
  estado: boolean;
  persona: {
    cedula: string;
    nombre: string;
    apellido: string;
    telefono: string;
    correo: string;
  };
  cargo: string;
}

// ===============================
// 🚀 Componente Principal
// ===============================

export function WorkersTable() {
  const currentUser = getUser();

  const [workers, setWorkers] = useState<WorkerAPI[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<WorkerAPI | null>(null);

  // 👉 estado para el diálogo de zonas
  const [zonesDialogOpen, setZonesDialogOpen] = useState(false);
  const [selectedWorkerForZones, setSelectedWorkerForZones] =
    useState<WorkerAPI | null>(null);

  // =======================================================
  // 🔥 Cargar trabajadores reales desde FastAPI
  // =======================================================
  const loadWorkers = async () => {
    try {
      const user = getUser();

      if (!user || !user.id_supervisor) {
        console.error("⚠ No hay supervisor logueado");
        return;
      }

      const data: WorkerAPI[] = await listarTrabajadoresPorSupervisor(
        user.id_supervisor
      );

      setWorkers(data);
    } catch (error) {
      console.error("❌ Error al cargar trabajadores:", error);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  // =======================================================
  // 🔎 Filtros (nombre, apellido, cedula)
  // =======================================================
  const filteredWorkers = workers.filter((worker) =>
    (
      worker.persona.nombre +
      " " +
      worker.persona.apellido
    )
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    worker.persona.cedula.includes(search)
  );

  // =======================================================
  // 🟥 ELIMINAR — confirmación PRO (overlay + toast)
  // =======================================================
  const handleDelete = async (id: number, nombreCompleto: string) => {
    // Crear overlay oscuro
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
            ¿Eliminar al trabajador <b>{nombreCompleto}</b>?
          </p>

          <div className="flex justify-center gap-3">
            {/* Cancelar */}
            <button
              onClick={() => {
                toast.dismiss(t.id);
                document.body.removeChild(overlay);
              }}
              className="px-4 py-2 text-sm font-medium bg-white border rounded-md hover:bg-gray-100 text-black"
            >
              Cancelar
            </button>

            {/* Eliminar */}
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                document.body.removeChild(overlay);

                const promise = eliminarTrabajador(id);

                toast.promise(promise, {
                  loading: "Eliminando trabajador...",
                  success: `Trabajador "${nombreCompleto}" eliminado correctamente`,
                  error: "❌ Error al eliminar el trabajador",
                });

                try {
                  await promise;
                  await loadWorkers();
                } catch (err) {
                  console.error(err);
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

  // =======================================================
  // ✏️ Editar trabajador
  // =======================================================
  const handleEdit = (worker: WorkerAPI) => {
    setEditingWorker(worker);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingWorker(null);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingWorker(null);
    loadWorkers();
  };

  // 👉 abrir diálogo de zonas
  const handleOpenZones = (worker: WorkerAPI) => {
    setSelectedWorkerForZones(worker);
    setZonesDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Trabajadores Registrados</CardTitle>
              <CardDescription>
                Personal asignado a tu supervisión
              </CardDescription>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Trabajador
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Buscador */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar trabajador..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trabajador</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Implementos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Zonas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredWorkers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-muted-foreground py-8"
                    >
                      No hay trabajadores registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWorkers.map((worker) => (
                    <TableRow key={worker.id_trabajador}>
                      {/* ✔ TRABAJADOR */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-muted text-lg font-semibold">
                              {worker.persona.nombre.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">
                              {worker.persona.nombre}{" "}
                              {worker.persona.apellido}
                            </span>

                            <span className="text-xs text-muted-foreground">
                              Cédula: {worker.persona.cedula}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* ✔ EMAIL */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-muted-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2z"
                            />
                          </svg>
                          {worker.persona.correo}
                        </div>
                      </TableCell>

                      {/* ✔ TELÉFONO */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-muted-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.45l.816 3.261a2 2 0 01-.45 1.89L8.21 11.79a11.04 11.04 0 005.002 5.002l1.189-1.189a2 2 0 011.89-.45l3.261.816A2 2 0 0121 19.72V22a2 2 0 01-2 2h-1C9.163 24 3 17.837 3 10V9a2 2 0 012-2z"
                            />
                          </svg>
                          {worker.persona.telefono}
                        </div>
                      </TableCell>

                      {/* ✔ CÓDIGO */}
                      <TableCell>{worker.codigo_trabajador}</TableCell>

                      {/* ✔ IMPLEMENTOS */}
                      <TableCell>
                        <Badge
                          className={
                            worker.implementos_requeridos === "Entregado"
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-yellow-500 text-black hover:bg-yellow-600"
                          }
                        >
                          {worker.implementos_requeridos}
                        </Badge>
                      </TableCell>

                      {/* ✔ ESTADO */}
                      <TableCell>
                        <Badge
                          className={
                            worker.estado
                              ? "bg-blue-900 text-white hover:bg-blue-950"
                              : "bg-red-800 text-white hover:bg-red-900"
                          }
                        >
                          {worker.estado ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>

                      {/* ✔ ZONAS BUTTON */}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2"
                          onClick={() => handleOpenZones(worker)}
                        >
                          <MapPin className="w-4 h-4 text-blue-700" />
                        </Button>
                      </TableCell>

                      {/* ✔ ACCIONES */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(worker)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDelete(
                                worker.id_trabajador,
                                `${worker.persona.nombre} ${worker.persona.apellido}`
                              )
                            }
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
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

      {/* Modal registro/edición */}
      <WorkerDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        worker={editingWorker}
      />

      {/* Modal asignar zonas */}
      <AssignWorkerZonesDialog
        open={zonesDialogOpen}
        onClose={() => setZonesDialogOpen(false)}
        worker={selectedWorkerForZones}
      />
    </>
  );
}
