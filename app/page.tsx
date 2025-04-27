"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  ChevronDown,
  ChevronUp,
  FilterX,
  SortDesc,
  SortAsc,
  PlusCircle,
  X,
  AlertTriangle,
  Shield,
  Zap,
  Activity,
  BarChart2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { format } from "date-fns"

// Define the anomaly type
interface Anomaly {
  id: number
  title: string
  description: string
  severity: "Low" | "Medium" | "High"
  reported_at: string
}

export default function AISafetyDashboard() {
  // Initial mock data
  const initialAnomalies: Anomaly[] = [
    {
      id: 1,
      title: "Biased Recommendation Algorithm",
      description:
        "Algorithm consistently favored certain demographics in job recommendations, leading to unequal opportunity distribution across different user groups. The bias was traced to training data imbalances.",
      severity: "Medium",
      reported_at: "2025-03-15T10:00:00Z",
    },
    {
      id: 2,
      title: "LLM Hallucination in Critical Info",
      description:
        "LLM provided incorrect safety procedure information when asked about emergency protocols in a chemical plant. This could have led to dangerous situations if the information had been followed in a real emergency.",
      severity: "High",
      reported_at: "2025-04-01T14:30:00Z",
    },
    {
      id: 3,
      title: "Minor Data Leak via Chatbot",
      description:
        "Chatbot inadvertently exposed non-sensitive user metadata during conversation. While no critical information was revealed, this indicates a potential vulnerability in the information boundary management.",
      severity: "Low",
      reported_at: "2025-03-20T09:15:00Z",
    },
  ]

  // State management
  const [anomalies, setAnomalies] = useState<Anomaly[]>(initialAnomalies)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [severityFilter, setSeverityFilter] = useState<string>("All")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [showForm, setShowForm] = useState(false)
  const [pulseEffect, setPulseEffect] = useState(false)

  // Form state
  const [newAnomaly, setNewAnomaly] = useState<{
    title: string
    description: string
    severity: "Low" | "Medium" | "High"
  }>({
    title: "",
    description: "",
    severity: "Medium",
  })

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    title: false,
    description: false,
  })

  // Pulse effect for the dashboard
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseEffect(true)
      setTimeout(() => setPulseEffect(false), 1000)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Toggle anomaly details
  const toggleExpand = (id: number) => {
    const newExpandedIds = new Set(expandedIds)
    if (newExpandedIds.has(id)) {
      newExpandedIds.delete(id)
    } else {
      newExpandedIds.add(id)
    }
    setExpandedIds(newExpandedIds)
  }

  // Filter and sort anomalies
  const filteredAndSortedAnomalies = anomalies
    .filter((anomaly) => severityFilter === "All" || anomaly.severity === severityFilter)
    .sort((a, b) => {
      const dateA = new Date(a.reported_at).getTime()
      const dateB = new Date(b.reported_at).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

  // Count anomalies by severity
  const anomalyCounts = {
    Low: anomalies.filter((a) => a.severity === "Low").length,
    Medium: anomalies.filter((a) => a.severity === "Medium").length,
    High: anomalies.filter((a) => a.severity === "High").length,
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const errors = {
      title: !newAnomaly.title.trim(),
      description: !newAnomaly.description.trim(),
    }

    setFormErrors(errors)

    if (errors.title || errors.description) {
      return
    }

    // Create new anomaly
    const anomaly: Anomaly = {
      id: Math.max(0, ...anomalies.map((i) => i.id)) + 1,
      title: newAnomaly.title,
      description: newAnomaly.description,
      severity: newAnomaly.severity,
      reported_at: new Date().toISOString(),
    }

    // Add to anomalies list
    setAnomalies([...anomalies, anomaly])

    // Reset form
    setNewAnomaly({
      title: "",
      description: "",
      severity: "Medium",
    })

    // Hide form
    setShowForm(false)
  }

  // Get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Low":
        return <Shield className="h-4 w-4" />
      case "Medium":
        return <AlertTriangle className="h-4 w-4" />
      case "High":
        return <Zap className="h-4 w-4" />
      default:
        return null
    }
  }

  // Get badge color based on severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-green-500 hover:bg-green-600 text-white"
      case "Medium":
        return "bg-yellow-500 hover:bg-yellow-600 text-black"
      case "High":
        return "bg-red-500 hover:bg-red-600 text-white"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto py-8 px-4 relative">
        {/* Header section */}
        <div className="relative mb-8 border-b border-teal-200 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">AI Safety Monitoring System</h1>
              <p className="text-teal-600">Tracking and analyzing AI anomalies</p>
            </div>

            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-teal-500" />
              <span className="text-sm text-blue-700">
                System Status: <span className="text-green-500">Operational</span>
              </span>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="bg-white border border-teal-200 shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-teal-600 text-sm">Total Anomalies</p>
                  <p className="text-2xl font-bold text-blue-900">{anomalies.length}</p>
                </div>
                <BarChart2 className="h-8 w-8 text-teal-500" />
              </CardContent>
            </Card>

            <Card className="bg-white border border-teal-200 shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-teal-600 text-sm">Low Severity</p>
                  <p className="text-2xl font-bold text-green-500">{anomalyCounts.Low}</p>
                </div>
                <Shield className="h-8 w-8 text-green-500" />
              </CardContent>
            </Card>

            <Card className="bg-white border border-teal-200 shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-teal-600 text-sm">Medium Severity</p>
                  <p className="text-2xl font-bold text-yellow-500">{anomalyCounts.Medium}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </CardContent>
            </Card>

            <Card className="bg-white border border-teal-200 shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-teal-600 text-sm">High Severity</p>
                  <p className="text-2xl font-bold text-red-500">{anomalyCounts.High}</p>
                </div>
                <Zap className="h-8 w-8 text-red-500" />
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => setShowForm(!showForm)}
              className={`flex items-center gap-2 ${
                showForm ? "bg-blue-800 hover:bg-blue-900 text-white" : "bg-teal-500 hover:bg-teal-600 text-white"
              }`}
            >
              {showForm ? <X size={16} /> : <PlusCircle size={16} />}
              {showForm ? "Cancel" : "Report Anomaly"}
            </Button>
          </div>
        </div>

        {/* New Anomaly Form */}
        {showForm && (
          <Card className="mb-8 border border-teal-200 bg-white shadow">
            <CardHeader className="border-b border-teal-100">
              <CardTitle className="text-blue-900">Report AI Anomaly</CardTitle>
              <CardDescription className="text-teal-600">
                Document unexpected AI behavior for system improvement
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-blue-800">
                    Anomaly Title
                  </Label>
                  <Input
                    id="title"
                    value={newAnomaly.title}
                    onChange={(e) => setNewAnomaly({ ...newAnomaly, title: e.target.value })}
                    className={`bg-white border-teal-300 focus:border-teal-500 ${
                      formErrors.title ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.title && <p className="text-red-500 text-sm">Title is required</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-blue-800">
                    Detailed Analysis
                  </Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={newAnomaly.description}
                    onChange={(e) => setNewAnomaly({ ...newAnomaly, description: e.target.value })}
                    className={`bg-white border-teal-300 focus:border-teal-500 ${
                      formErrors.description ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.description && <p className="text-red-500 text-sm">Description is required</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-blue-800">Severity Classification</Label>
                  <RadioGroup
                    value={newAnomaly.severity}
                    onValueChange={(value) =>
                      setNewAnomaly({
                        ...newAnomaly,
                        severity: value as "Low" | "Medium" | "High",
                      })
                    }
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Low" id="low" className="text-green-500 border-green-500" />
                      <Label htmlFor="low" className="cursor-pointer text-green-500">
                        Low
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Medium" id="medium" className="text-yellow-500 border-yellow-500" />
                      <Label htmlFor="medium" className="cursor-pointer text-yellow-500">
                        Medium
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="High" id="high" className="text-red-500 border-red-500" />
                      <Label htmlFor="high" className="cursor-pointer text-red-500">
                        High
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium">
                  Submit Anomaly Report
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Filter and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white rounded-lg border border-teal-200 shadow">
          <div className="flex items-center gap-2">
            <FilterX size={16} className="text-teal-500" />
            <Label htmlFor="severity-filter" className="text-blue-800">
              Filter by Severity:
            </Label>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger id="severity-filter" className="w-[140px] bg-white border-teal-300">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-white border-teal-300">
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            {sortOrder === "newest" ? (
              <SortDesc size={16} className="text-teal-500" />
            ) : (
              <SortAsc size={16} className="text-teal-500" />
            )}
            <Label htmlFor="sort-order" className="text-blue-800">
              Sort by Date:
            </Label>
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}>
              <SelectTrigger id="sort-order" className="w-[140px] bg-white border-teal-300">
                <SelectValue placeholder="Newest First" />
              </SelectTrigger>
              <SelectContent className="bg-white border-teal-300">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Anomalies List */}
        <div className="space-y-4">
          {filteredAndSortedAnomalies.length === 0 ? (
            <Card className="border border-teal-200 bg-white">
              <CardContent className="py-8 text-center text-blue-700">
                No anomalies detected matching the current filters.
              </CardContent>
            </Card>
          ) : (
            filteredAndSortedAnomalies.map((anomaly) => (
              <Card key={anomaly.id} className="transition-all hover:shadow-md border border-teal-200 bg-white">
                <CardHeader className="pb-2 border-b border-teal-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-blue-900">{anomaly.title}</CardTitle>
                      <CardDescription className="text-teal-600">
                        <span className="font-mono">ID: {anomaly.id.toString().padStart(4, "0")}</span> • Detected:{" "}
                        {format(new Date(anomaly.reported_at), "MMM d, yyyy - HH:mm")}
                      </CardDescription>
                    </div>
                    <Badge className={`${getSeverityColor(anomaly.severity)} flex items-center gap-1 font-medium`}>
                      {getSeverityIcon(anomaly.severity)}
                      {anomaly.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardFooter className="pt-2 flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(anomaly.id)}
                    className="flex items-center gap-1 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                  >
                    {expandedIds.has(anomaly.id) ? (
                      <>
                        Hide Analysis <ChevronUp size={16} />
                      </>
                    ) : (
                      <>
                        View Analysis <ChevronDown size={16} />
                      </>
                    )}
                  </Button>
                </CardFooter>

                {/* Expandable Description */}
                {expandedIds.has(anomaly.id) && (
                  <CardContent className="pt-0 pb-4 border-t border-teal-100 mt-2">
                    <div className="p-3 bg-blue-50 rounded-md mt-2">
                      <p className="text-sm text-blue-800 font-mono leading-relaxed">{anomaly.description}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-teal-200 text-center text-xs text-blue-600">
          <p>AI Safety Monitoring System v1.0.2 • HumanChain AI Safety Division</p>
          <p className="mt-1">Monitoring AI systems for anomalous behavior since 2025</p>
        </div>
      </div>
    </main>
  )
}
