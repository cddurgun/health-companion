'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FlaskConical, Plus, Trash2, Upload, FileText, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface LabResult {
  id: string
  testName: string
  testDate: string
  result: string
  fileUrl?: string | null
  provider?: string | null
  notes?: string | null
  flagged: boolean
  createdAt: string
}

interface ParsedResult {
  testName: string
  value: string
  unit: string
  referenceRange: string
  flag?: string
}

export default function LabsPage() {
  const [labResults, setLabResults] = useState<LabResult[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [formData, setFormData] = useState({
    testName: '',
    testDate: new Date().toISOString().slice(0, 10),
    provider: '',
    notes: '',
    manualResults: [{ name: '', value: '', unit: '', referenceRange: '' }],
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    fetchLabResults()
  }, [])

  const fetchLabResults = async () => {
    try {
      const res = await fetch('/api/labs')
      const data = await res.json()
      setLabResults(data)
    } catch (error) {
      console.error('Failed to fetch lab results:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)

    // Check if image file for AI extraction
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      setExtracting(true)
      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/labs/extract', {
          method: 'POST',
          body: formData,
        })

        if (res.ok) {
          const data = await res.json()
          if (data.extracted) {
            // Pre-fill form with extracted data
            setFormData((prev) => ({
              ...prev,
              testName: data.testName || prev.testName,
              testDate: data.testDate || prev.testDate,
              provider: data.provider || prev.provider,
              manualResults: data.results || prev.manualResults,
            }))
          }
        }
      } catch (error) {
        console.error('Failed to extract data:', error)
      } finally {
        setExtracting(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      // Upload file first if selected
      let fileUrl = null
      if (selectedFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', selectedFile)

        const uploadRes = await fetch('/api/labs/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          fileUrl = uploadData.url
        }
      }

      // Create lab result
      const payload = {
        testName: formData.testName,
        testDate: new Date(formData.testDate).toISOString(),
        result: JSON.stringify(formData.manualResults),
        provider: formData.provider || undefined,
        notes: formData.notes || undefined,
        fileUrl,
        flagged: formData.manualResults.some((r) => r.name.toLowerCase().includes('abnormal')),
      }

      const res = await fetch('/api/labs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        await fetchLabResults()
        setShowAddForm(false)
        setSelectedFile(null)
        setFormData({
          testName: '',
          testDate: new Date().toISOString().slice(0, 10),
          provider: '',
          notes: '',
          manualResults: [{ name: '', value: '', unit: '', referenceRange: '' }],
        })
      }
    } catch (error) {
      console.error('Failed to add lab result:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lab result?')) return

    try {
      const res = await fetch(`/api/labs/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchLabResults()
      }
    } catch (error) {
      console.error('Failed to delete lab result:', error)
    }
  }

  const addManualResult = () => {
    setFormData({
      ...formData,
      manualResults: [...formData.manualResults, { name: '', value: '', unit: '', referenceRange: '' }],
    })
  }

  const updateManualResult = (index: number, field: string, value: string) => {
    const updated = [...formData.manualResults]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, manualResults: updated })
  }

  const commonTests = [
    'Complete Blood Count (CBC)',
    'Comprehensive Metabolic Panel (CMP)',
    'Lipid Panel',
    'Thyroid Panel (TSH, T3, T4)',
    'Hemoglobin A1C',
    'Vitamin D',
    'Vitamin B12',
    'Iron Panel',
    'Liver Function Tests',
    'Kidney Function Tests',
  ]

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lab Results</h1>
          <p className="text-gray-600">Track and analyze your medical test results</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Lab Result
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Lab Result</CardTitle>
            <CardDescription>Upload a lab report or enter results manually</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <Label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                >
                  {selectedFile ? selectedFile.name : 'Upload lab report (PDF or Image)'}
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-2">
                  AI will attempt to extract test values automatically
                </p>
                {extracting && (
                  <p className="text-sm text-blue-600 mt-2">🤖 Extracting data with AI...</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="testName">Test Name *</Label>
                  <Select
                    value={formData.testName}
                    onValueChange={(value) => setFormData({ ...formData, testName: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select test type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {commonTests.map((test) => (
                        <SelectItem key={test} value={test}>
                          {test}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="testDate">Test Date *</Label>
                  <Input
                    type="date"
                    id="testDate"
                    value={formData.testDate}
                    onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="provider">Lab/Provider (optional)</Label>
                <Input
                  id="provider"
                  placeholder="e.g., Quest Diagnostics, LabCorp"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                />
              </div>

              {/* Manual Results Entry */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Test Results</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addManualResult}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Result
                  </Button>
                </div>
                <div className="space-y-3">
                  {formData.manualResults.map((result, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-2">
                      <Input
                        placeholder="Test name"
                        value={result.name}
                        onChange={(e) => updateManualResult(idx, 'name', e.target.value)}
                      />
                      <Input
                        placeholder="Value"
                        value={result.value}
                        onChange={(e) => updateManualResult(idx, 'value', e.target.value)}
                      />
                      <Input
                        placeholder="Unit"
                        value={result.unit}
                        onChange={(e) => updateManualResult(idx, 'unit', e.target.value)}
                      />
                      <Input
                        placeholder="Reference range"
                        value={result.referenceRange}
                        onChange={(e) => updateManualResult(idx, 'referenceRange', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  placeholder="Additional context or observations..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Save Lab Result'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lab Results List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : labResults.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FlaskConical className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No lab results yet</h3>
            <p className="text-gray-600 mb-4">Start tracking your medical tests and biomarkers</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Result
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {labResults.map((lab) => {
            const parsedResults: ParsedResult[] = JSON.parse(lab.result || '[]')

            return (
              <Card key={lab.id} className={lab.flagged ? 'border-orange-300 bg-orange-50' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle>{lab.testName}</CardTitle>
                        {lab.flagged && (
                          <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded">
                            <AlertTriangle className="h-3 w-3 inline mr-1" />
                            FLAGGED
                          </span>
                        )}
                      </div>
                      <CardDescription>
                        {new Date(lab.testDate).toLocaleDateString()} • {lab.provider || 'No provider'}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {lab.fileUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={lab.fileUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-1" />
                            View File
                          </a>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(lab.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {parsedResults.map((result, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-lg border">
                        <p className="text-sm font-medium text-gray-600">{result.name}</p>
                        <p className="text-xl font-bold text-gray-900">
                          {result.value} <span className="text-sm text-gray-500">{result.unit}</span>
                        </p>
                        {result.referenceRange && (
                          <p className="text-xs text-gray-500">Ref: {result.referenceRange}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  {lab.notes && (
                    <p className="text-sm text-gray-700 mt-4 pt-4 border-t italic">{lab.notes}</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
