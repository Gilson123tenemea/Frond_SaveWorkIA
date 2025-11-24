// src/components/inspector/inspector-profile.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  IdCard,
} from "lucide-react";

import { getUser } from "@/lib/auth";
import { obtenerPerfilInspector } from "@/servicios/inspector";

type InspectorPerfil = {
  id_inspector: number;
  id_persona: number;
  cedula: string;
  nombre: string;
  apellido: string;
  telefono?: string | null;
  correo: string;
  direccion: string;
  genero: string;
  fecha_nacimiento: string;
  zona_asignada: string;
  frecuenciaVisita?: string | null;
  fecha_asignacion?: string | null;
  fotoBase64?: string | null;
};

interface InspectorProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InspectorProfile({ open, onOpenChange }: InspectorProfileProps) {
  const [perfil, setPerfil] = useState<InspectorPerfil | null>(null);
  const [loading, setLoading] = useState(false);

  const user = getUser();
  const inspectorId = user?.id_inspector ?? user?.id ?? null;

  useEffect(() => {
    if (!open || !inspectorId) return;

    async function loadPerfil() {
      try {
        setLoading(true);
        const data = await obtenerPerfilInspector(inspectorId);
        setPerfil(data);
      } catch (error) {
        console.error("❌ Error cargando perfil de inspector:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPerfil();
  }, [open, inspectorId]);

  const iniciales =
    (perfil?.nombre?.charAt(0) || "") + (perfil?.apellido?.charAt(0) || "");

  const fechaNac = perfil?.fecha_nacimiento
    ? new Date(perfil.fecha_nacimiento).toLocaleDateString()
    : "-";

  const fechaAsig = perfil?.fecha_asignacion
    ? new Date(perfil.fecha_asignacion).toLocaleDateString()
    : "-";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Perfil del Inspector
          </DialogTitle>
          <DialogDescription>
            Información personal y detalles del inspector de seguridad.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Cargando perfil...
          </div>
        ) : !perfil ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No se pudo cargar la información del inspector.
          </div>
        ) : (
          <Card className="border-none shadow-none">
            <CardContent className="space-y-6 pt-4">
              {/* Cabezera con avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  {perfil.fotoBase64 ? (
                    <AvatarImage
                      src={`data:image/jpeg;base64,${perfil.fotoBase64}`}
                      alt="Foto del inspector"
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {iniciales || "IN"}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">
                      {perfil.nombre} {perfil.apellido}
                    </h2>
                    <Badge variant="outline">Inspector de Seguridad</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ID Inspector: {perfil.id_inspector}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Zona asignada: <strong>{perfil.zona_asignada}</strong>
                  </p>
                </div>
              </div>

              {/* Datos personales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-sm">
                    <IdCard className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Cédula:</span>
                    <span>{perfil.cedula}</span>
                  </p>

                  <p className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Correo:</span>
                    <span>{perfil.correo}</span>
                  </p>

                  <p className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Teléfono:</span>
                    <span>{perfil.telefono || "-"}</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Género:</span>
                    <span>{perfil.genero}</span>
                  </p>

                  <p className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Fecha de nacimiento:</span>
                    <span>{fechaNac}</span>
                  </p>

                  <p className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Dirección:</span>
                    <span className="truncate">{perfil.direccion}</span>
                  </p>
                </div>
              </div>

              {/* Datos de rol */}
              <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Zona Asignada
                  </p>
                  <p className="text-sm">{perfil.zona_asignada}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Frecuencia de visita
                  </p>
                  <p className="text-sm">
                    {perfil.frecuenciaVisita || "No definida"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    Fecha de asignación
                  </p>
                  <p className="text-sm">{fechaAsig}</p>
                </div>
              </div>

              {/* Botones acción (solo visual por ahora) */}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  disabled
                  title="Funcionalidad pendiente"
                >
                  Cambiar foto
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  disabled
                  title="Funcionalidad pendiente"
                >
                  Editar datos
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
