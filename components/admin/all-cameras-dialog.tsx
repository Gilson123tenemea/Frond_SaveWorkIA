"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter, // <-- IMPORTANTE
} from "@/components/ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";

import toast from "react-hot-toast";

import { listarEmpresas } from "@/servicios/empresa";
import { listarZonasPorEmpresa } from "@/servicios/zona";

import { CameraFormDialog } from "./camera-form-dialog";

export function AllCamerasDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [companies, setCompanies] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [selectedZoneId, setSelectedZoneId] = useState<string>("");

  const [showCameraForm, setShowCameraForm] = useState(false);

  useEffect(() => {
    if (open) loadCompanies();
  }, [open]);

  const loadCompanies = async () => {
    try {
      const data = await listarEmpresas();
      setCompanies(data);
    } catch {
      toast.error("❌ Error al cargar empresas");
    }
  };

  const loadZones = async (empresaId: string) => {
    try {
      const data = await listarZonasPorEmpresa(Number(empresaId));
      setZones(data);
    } catch {
      toast.error("❌ Error al cargar zonas");
    }
  };

  const handleContinue = () => {
    if (!selectedZoneId) {
      toast.error("⚠️ Debes seleccionar una zona");
      return;
    }
    setShowCameraForm(true);
  };

  const handleSuccess = () => {
    setShowCameraForm(false);
    setSelectedCompanyId("");
    setSelectedZoneId("");
    onSuccess();
  };

  return (
    <>
      <Dialog open={open && !showCameraForm} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Registrar Nueva Cámara
            </DialogTitle>
            <DialogDescription>
              Selecciona la empresa y la zona donde estará la cámara.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Empresa */}
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Select
                value={selectedCompanyId}
                onValueChange={(val) => {
                  setSelectedCompanyId(val);
                  setSelectedZoneId("");
                  loadZones(val);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c: any) => (
                    <SelectItem
                      key={c.id_empresa}
                      value={String(c.id_empresa)}
                    >
                      {c.nombreEmpresa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Zona */}
            {selectedCompanyId && (
              <div className="space-y-2">
                <Label>Zona</Label>
                <Select
                  value={selectedZoneId}
                  onValueChange={setSelectedZoneId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar zona" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((z: any) => (
                      <SelectItem
                        key={z.id_Zona}
                        value={String(z.id_Zona)}
                      >
                        {z.nombreZona}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleContinue} disabled={!selectedZoneId}>
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FORMULARIO DE CÁMARA */}
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
