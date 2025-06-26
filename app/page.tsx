"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Search, AlertTriangle, CheckCircle2, Clock, Users, FileText, Calendar, Hash } from "lucide-react"

type ProcessState = "input" | "executing" | "success" | "error"
type ErrorType = "invalid-data" | "project-not-found" | null

interface SelectionResult {
  numeroProceso: number
  fechaProceso: string
  estado: "Simulado antes Finalizar Postulaciones" | "Simulado despues Finalizar Postulaciones"
  numeroProyecto: string
  fechaCierre?: string
}

export default function SelectionProcess() {
  const [numeroProyecto, setNumeroProyecto] = useState("")
  const [processState, setProcessState] = useState<ProcessState>("input")
  const [errorType, setErrorType] = useState<ErrorType>(null)
  const [result, setResult] = useState<SelectionResult | null>(null)
  const [progress, setProgress] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar que el campo no esté vacío o tenga menos de 5 cifras
    if (!numeroProyecto.trim() || numeroProyecto.length < 5) {
      setErrorType("invalid-data")
      setProcessState("error")
      return
    }

    // Simular diferentes escenarios basados en entrada específica
    if (numeroProyecto === "11111") {
      setErrorType("project-not-found")
      setProcessState("error")
    } else {
      // Iniciar ejecución del algoritmo directamente
      setProcessState("executing")
      setProgress(0)
    }
  }

  // Efecto para simular el progreso del algoritmo
  useEffect(() => {
    if (processState === "executing") {
      const totalDuration = 5000 // 5 seconds
      const intervalTime = 50 // Update every 50ms
      const totalSteps = totalDuration / intervalTime // 100 steps
      const incrementPerStep = 100 / totalSteps // 1% per step

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            // Completar el proceso
            setTimeout(() => {
              let fechaCierre = "15/08/2025 18:00:00"
              const now = new Date()
              const fechaProceso =
                now.toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }) +
                " " +
                now.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              let isBeforeDeadline = true

              // Determinar el estado basado en el número de proyecto
              if (numeroProyecto === "00002") {
                isBeforeDeadline = false
                // Si es después del cierre, la fecha de cierre debe ser 1 día anterior a la fecha actual
                const oneDayBefore = new Date()
                oneDayBefore.setDate(oneDayBefore.getDate() - 1)
                fechaCierre =
                  oneDayBefore.toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }) + " 18:00:00"
              } else {
                // Si es antes del cierre (00001), la fecha de cierre debe ser 1 mes y 1 día mayor a la fecha actual
                const oneMonthOneDayLater = new Date()
                oneMonthOneDayLater.setMonth(oneMonthOneDayLater.getMonth() + 1)
                oneMonthOneDayLater.setDate(oneMonthOneDayLater.getDate() + 1)
                fechaCierre =
                  oneMonthOneDayLater.toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }) + " 18:00:00"
              }

              const mockResult: SelectionResult = {
                numeroProceso: Math.floor(Math.random() * 100) + 1,
                fechaProceso: fechaProceso,
                estado: isBeforeDeadline
                  ? "Simulado antes Finalizar Postulaciones"
                  : "Simulado despues Finalizar Postulaciones",
                numeroProyecto: numeroProyecto,
                fechaCierre: fechaCierre,
              }
              setResult(mockResult)
              setProcessState("success")
            }, 500)
            return 100
          }
          // Incremento constante para completar en exactamente 5 segundos
          const newProgress = prev + incrementPerStep
          return Math.min(newProgress, 100) // Asegurar que no pase de 100
        })
      }, intervalTime) // Actualizar cada 50ms

      return () => clearInterval(interval)
    }
  }, [processState, numeroProyecto])

  const resetProcess = () => {
    setProcessState("input")
    setErrorType(null)
    setResult(null)
    setNumeroProyecto("")
    setProgress(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Prácticas Profesionales</h1>
          <p className="text-gray-600">Selección de Aspirantes Provisorios</p>
        </div>

        {/* Main Content */}
        {processState === "input" && (
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Iniciar Proceso de Selección</CardTitle>
              <CardDescription>
                Ingrese el número del proyecto para el cual desea realizar la selección de aspirantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="numeroProyecto" className="text-sm font-medium">
                    Número del Proyecto <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="numeroProyecto"
                      type="text"
                      placeholder="Ej: 00001"
                      value={numeroProyecto}
                      onChange={(e) => setNumeroProyecto(e.target.value)}
                      className="pl-10"
                      maxLength={5}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Continuar
                </Button>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <h4 className="text-blue-700 font-bold text-sm">Ejemplos para prueba:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-blue-600">
                        Ingrese "00001" para simular Proceso Selección simulado antes de la fecha de cierre de
                        postulaciones.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-blue-600">
                        Ingrese "00002" para simular Proceso Selección simulado después de la fecha de cierre de
                        postulaciones.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-blue-600">
                        Ingrese texto o números incompletos para simular datos no válidos.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-blue-600">Ingrese "11111" para simular proyecto no encontrado.</span>
                    </li>
                  </ul>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Executing Algorithm State */}
        {processState === "executing" && (
          <Card className="w-full max-w-lg mx-auto">
            <CardContent className="py-12">
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold">Ejecutando algoritmo de selección...</h3>
                  <p className="text-sm text-gray-600">Procesando postulaciones y asignando estados</p>
                </div>
                <div className="space-y-3">
                  <Progress value={progress} className="w-full h-3" />
                  <p className="text-sm">
                    <span className="text-blue-600 font-medium">{Math.floor(progress)}% completado</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error States */}
        {processState === "error" && (
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Iniciar Proceso de Selección</CardTitle>
              <CardDescription>
                Ingrese el número del proyecto para el cual desea realizar la selección de aspirantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="numeroProyecto" className="text-sm font-medium">
                    Número del Proyecto <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="numeroProyecto"
                      type="text"
                      placeholder="Ej: 00001"
                      value={numeroProyecto}
                      onChange={(e) => setNumeroProyecto(e.target.value)}
                      className="pl-10"
                      maxLength={5}
                    />
                  </div>
                </div>

                {/* Error Message - Styled like the image */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-red-700 text-sm">
                    {errorType === "invalid-data" && "Los datos ingresados no son válidos. Intenta nuevamente."}
                    {errorType === "project-not-found" &&
                      "No se ha podido encontrar el Proyecto ingresado. Intente nuevamente."}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={resetProcess} variant="outline" className="flex-1">
                    Atrás
                  </Button>
                  <Button type="submit" className="flex-1">
                    Continuar
                  </Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <h4 className="text-blue-700 font-bold text-sm">Ejemplos para prueba:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-blue-600">
                        Ingrese "00001" para simular Proceso Selección simulado antes de la fecha de cierre de
                        postulaciones.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-blue-600">
                        Ingrese "00002" para simular Proceso Selección simulado después de la fecha de cierre de
                        postulaciones.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-blue-600">
                        Ingrese texto o números incompletos para simular datos no válidos.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-blue-600">Ingrese "11111" para simular proyecto no encontrado.</span>
                    </li>
                  </ul>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Success State */}
        {processState === "success" && result && (
          <div className="space-y-6">
            <Card className="w-full max-w-lg mx-auto border-green-200">
              <CardContent className="py-8">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-green-900">Proceso de Selección Completado</h3>
                    <p className="text-gray-600">El algoritmo de selección se ha ejecutado exitosamente</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Result Details */}
            <Card className="w-full max-w-lg mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Detalles del Proceso
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Número de Proyecto</Label>
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-sm">{result.numeroProyecto}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Fecha del Proceso</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{result.fechaProceso}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-500">Número de Proceso</Label>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-mono text-sm">{result.numeroProceso}</span>
                    </div>
                  </div>

                  {result.fechaCierre && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Fecha Cierre Postulaciones</Label>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{result.fechaCierre}</span>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-6">
                  <Label className="text-sm font-medium text-gray-500">Estado del Proceso</Label>
                  <Badge variant={result.estado.includes("antes") ? "default" : "secondary"} className="text-xs">
                    {result.estado}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {result.estado.includes("antes")
                      ? "La simulación se ejecutó antes del cierre de postulaciones"
                      : "La simulación se ejecutó después del cierre de postulaciones"}
                  </p>
                </div>

                <div className="pt-4">
                  <Button onClick={resetProcess} className="w-full">
                    Realizar Nueva Selección
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
