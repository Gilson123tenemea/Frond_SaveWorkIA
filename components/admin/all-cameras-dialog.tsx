"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera } from "lucide-react"
import { getCompanies, getZones } from "@/lib/storage"
import { CameraFormDialog } from "./camera-form-dialog"

interface AllCamerasDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AllCamerasDialog({ open, onOpenChange, onSuccess }: AllCamerasDialogProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("")
  const [selectedZoneId, setSelectedZoneId] = useState<string>("")
  const [showCameraForm, setShowCameraForm] = useState(false)

  const companies = getCompanies()
  const zones = selectedCompanyId ? getZones().filter((z) => z.companyId === Number.parseInt(selectedCompanyId)) : []

  const handleContinue = () => {
    if (selectedZoneId) {
      setShowCameraForm(true)
    }
  }

  const handleSuccess = () => {
    setShowCameraForm(false)
    setSelectedCompanyId("")
    setSelectedZoneId("")
    onSuccess()
  }

  return (
    <>
      <Dialog open={open && !showCameraForm} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Agregar Nueva Cámara
            </DialogTitle>
            <DialogDescription>Selecciona la empresa y zona donde instalar la cámara</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Select
                value={selectedCompanyId}
                onValueChange={(value) => {
                  setSelectedCompanyId(value)
                  setSelectedZoneId("")
                }}
              >
                <SelectTrigger id="company">
                  <SelectValue placeholder="Seleccionar empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCompanyId && (
              <div className="space-y-2">
                <Label htmlFor="zone">Zona</Label>
                <Select value={selectedZoneId} onValueChange={setSelectedZoneId}>
                  <SelectTrigger id="zone">
                    <SelectValue placeholder="Seleccionar zona" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">No hay zonas disponibles</div>
                    ) : (
                      zones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id.toString()}>
                          {zone.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

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

      <CameraFormDialog
        open={showCameraForm}
        onOpenChange={(open) => {
          if (!open) {
            setShowCameraForm(false)
            onOpenChange(false)
          }
        }}
        camera={null}
        zoneId={selectedZoneId ? Number.parseInt(selectedZoneId) : null}
        onSuccess={handleSuccess}
      />
    </>
  )
}
