"use client"

import React, { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Activity, Heart, Zap, FileText, Pill } from "lucide-react"

interface ProbableDisease {
  disease: string;
  chance: number;
}

interface Abnormalities {
  type: string;
  description: string;
}

interface Treatment {
  if_abnormalities_present: string;
}

interface ImageAnalysis {
  modality: string;
  organ: string;
  analysis: string;
  abnormalities?: Abnormalities;
  treatment?: Treatment;
}

interface AssessmentResult {
  probableDiseases: ProbableDisease[];
  remedies: string;
  advice: string;
  imageAnalysis: ImageAnalysis;
}

interface AssessmentData {
  formData: {
    name: string;
    gender: string;
    age: string;
    conversation: string;
  };
  imageAnalysis: ImageAnalysis;
  result: AssessmentResult;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"]

export default function Dashboard() {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null)
  const [activeTab, setActiveTab] = useState("report")

  useEffect(() => {
    // Fetch data from localStorage
    const storedData = localStorage.getItem("assessmentData")
    
    if (storedData) {
      const parsedData: AssessmentData = JSON.parse(storedData)
      setAssessmentData(parsedData)
    }
  }, [])

  if (!assessmentData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center p-6">
            <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
            <p className="text-lg text-center text-gray-700">
              No assessment data found. Please complete the assessment first.
            </p>
            <Button className="mt-4">Go to Assessment</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { formData, imageAnalysis, result } = assessmentData
  const { probableDiseases, advice, remedies } = result

  const riskLevel = probableDiseases[0]?.chance || 0
  let riskColor = "bg-green-500"
  if (riskLevel > 30) riskColor = "bg-yellow-500"
  if (riskLevel > 60) riskColor = "bg-red-500"

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-6xl mx-auto shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold">Health Risk Dashboard</CardTitle>
            <Badge variant="secondary" className="text-lg">
              Risk Level: {riskLevel}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="report" className="flex items-center justify-center">
                <FileText className="w-5 h-5 mr-2" />
                Report
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center justify-center">
                <Activity className="w-5 h-5 mr-2" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="remedies" className="flex items-center justify-center">
                <Pill className="w-5 h-5 mr-2" />
                Remedies
              </TabsTrigger>
            </TabsList>

            <TabsContent value="report" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Heart className="w-6 h-6 mr-2 text-red-500" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Name: <span className="font-normal">{formData.name}</span></p>
                      <p className="font-semibold">Gender: <span className="font-normal">{formData.gender}</span></p>
                    </div>
                    <div>
                      <p className="font-semibold">Age: <span className="font-normal">{formData.age}</span></p>
                      <p className="font-semibold">Conversation Summary: <span className="font-normal">{formData.conversation}</span></p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Zap className="w-6 h-6 mr-2 text-yellow-500" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">Overall Risk</span>
                      <span className="font-semibold">{riskLevel}%</span>
                    </div>
                    <Progress value={riskLevel} className={riskColor} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Probable Diseases</h4>
                      <ul className="list-disc list-inside">
                        {probableDiseases.map((disease, index) => (
                          <li key={index}>
                            {disease.disease} - {disease.chance}%
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={probableDiseases}
                            dataKey="chance"
                            nameKey="disease"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {probableDiseases.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Activity className="w-6 h-6 mr-2 text-blue-500" />
                    Image Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Modality: <span className="font-normal">{imageAnalysis.modality || "n/a"}</span></p>
                      <p className="font-semibold">Organ: <span className="font-normal">{imageAnalysis.organ || "n/a"}</span></p>
                      <p className="font-semibold">Analysis: <span className="font-normal">{imageAnalysis.analysis|| "n/a"}</span></p>
                    </div>
                    <div>
                      {imageAnalysis.abnormalities && (
                        <p className="font-semibold">Abnormalities: <span className="font-normal">{imageAnalysis.abnormalities.description}</span></p>
                      )}
                      {imageAnalysis.treatment && (
                        <p className="font-semibold">Treatment: <span className="font-normal">{imageAnalysis.treatment.if_abnormalities_present}</span></p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Disease Probability Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={probableDiseases}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="disease" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="chance" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="remedies" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <Pill className="w-6 h-6 mr-2 text-green-500" />
                    Remedies and Advice
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="remedies">
                      <AccordionTrigger>Recommended Remedies</AccordionTrigger>
                      <AccordionContent>
                        <p>{remedies}</p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="advice">
                      <AccordionTrigger>Professional Advice</AccordionTrigger>
                      <AccordionContent>
                        <p>{advice}</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}