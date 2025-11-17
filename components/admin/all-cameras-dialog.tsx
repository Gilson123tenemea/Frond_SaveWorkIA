"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera } from "lucide-react";
import { listarEmpresas } from "@/servicios/empresa";
import { listarZonasPorEmpresa } from "@/servicios/zona";
import { CameraFormDialog } from "./camera-form-dialog";
import toast from "react-hot-toast";

interface AllCamerasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AllCamerasDialog({
  open,
  onOpenChange,
  onSuccess,
}: AllCamerasDialogProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [selectedZoneId, setSelectedZoneId] = useState<string>("");
  const [showCameraForm, setShowCameraForm] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);

  useEffect(() => {
    if (open) loadCompanies();
  }, [open]);

  const loadCompanies = async () => {
    try {
      const data = await listarEmpresas();
      setCompanies(data);
    } catch {
      toast.error("❌ Error al obtener empresas");
    }
  };

  const loadZones = async (empresaId: string) => {
    try {
      const data = await listarZonasPorEmpresa(Number(empresaId));
      setZones(data);
    } catch {
      toast.error("❌ Error al obtener zonas");
    }
  };

  const handleCompanyChange = (value: string) => {
    setSelectedCompanyId(value);
    setSelectedZoneId("");
    loadZones(value);
  };

  const handleContinue = () => {
    if (selectedZoneId) setShowCameraForm(true);
  };

  const handleSuccess = () => {
    setShowCameraForm(false);
    setSelectedCompanyId("");
    setSelectedZoneId("");
    onSuccess();
  };

  return (
    <>
      {/* Selección de empresa y zona */}
      <Dialog open={open && !showCameraForm} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Agregar Nueva Cámara
            </DialogTitle>
            <DialogDescription>
              Selecciona la empresa y zona donde instalar la cámara
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Empresa */}
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Select
                value={selectedCompanyId}
                onValueChange={handleCompanyChange}
              >
                <SelectTrigger id="company">
                  <SelectValue placeholder="Seleccionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      No hay empresas disponibles
                    </div>
                  ) : (
                    companies.map((company) => (
                      <SelectItem
                        key={company.id_empresa}
                        value={String(company.id_empresa)}
                      >
                        {company.nombreEmpresa}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Zona */}
            {selectedCompanyId && (
              <div className="space-y-2">
                <Label htmlFor="zone">Zona</Label>
                <Select
                  value={selectedZoneId}
                  onValueChange={setSelectedZoneId}
                >
                  <SelectTrigger id="zone">
                    <SelectValue placeholder="Seleccionar zona" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        No hay zonas disponibles
                      </div>
                    ) : (
  zones.map((zone) => (
  <SelectItem
    key={zone.id_zona}
    value={String(zone.id_zona)}
  >
    {zone.nombreZona}
  </SelectItem>
))


                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleContinue} disabled={!selectedZoneId}>
              Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Formulario de creación de cámara */}
      <CameraFormDialog
        open={showCameraForm}
        onOpenChange={(open) => {
          if (!open) {
            setShowCameraForm(false);
            onOpenChange(false);
          }
        }}
        camera={null}
        zoneId={selectedZoneId ? Number(selectedZoneId) : null}
        onSuccess={handleSuccess}
      />
    </>
  );
}
