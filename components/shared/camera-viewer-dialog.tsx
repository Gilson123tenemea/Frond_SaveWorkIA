"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Maximize2, Volume2, VolumeX, Play, Pause, Settings } from "lucide-react"

interface CameraViewerDialogProps {
  cameraName: string
  cameraLocation: string
  trigger?: React.ReactNode
}

export function CameraViewerDialog({ cameraName, cameraLocation, trigger }: CameraViewerDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Camera className="w-4 h-4 mr-2" />
            Ver Cámara
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              {cameraName}
            </div>
            <Badge variant="outline" className="gap-1.5">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              En Vivo
            </Badge>
          </DialogTitle>
          <DialogDescription>{cameraLocation}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Video Player */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <img
              src={`/.jpg?height=600&width=1000&query=${cameraLocation} surveillance camera feed`}
              alt="Camera Feed"
              className="w-full h-full object-cover"
            />

            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <span className="text-white text-sm font-medium ml-2">15:42:30</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20">
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Detection Overlays */}
            <div className="absolute top-4 left-4 space-y-2">
              <Badge className="bg-success">
                <Camera className="w-3 h-3 mr-1" />2 Trabajadores Detectados
              </Badge>
              <Badge className="bg-success">EPP Completo</Badge>
            </div>
          </div>

          {/* Camera Info */}
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Resolución</p>
              <p className="font-medium">1920x1080 (Full HD)</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">FPS</p>
              <p className="font-medium">30 fps</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Latencia</p>
              <p className="font-medium">42ms</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Estado</p>
              <p className="font-medium text-success">Operativa</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
