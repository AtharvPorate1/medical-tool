"use client"

import React, { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2, Mic, MicOff, Upload, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'

interface FormInputs {
  name: string
  gender: 'male' | 'female' | 'other'
  age: number
  conversation: string
}

interface ProbableDisease {
  disease: string
  chance: number
}

interface ImageAnalysis {
  modality: string
  organ: string
  analysis: string
  abnormalities?: string
  treatment?: string
}

interface AssessmentResult {
  probableDiseases: ProbableDisease[]
  remedies: string
  advice: string
  imageAnalysis: ImageAnalysis | null
}

const HealthRiskAssessmentPage: React.FC = () => {
  const { register, handleSubmit, setValue, watch, formState: { errors, isValid } } = useForm<FormInputs>()
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [assessmentData, setAssessmentData] = useState<{
    formData: FormInputs | null
    imageAnalysis: ImageAnalysis | null
    result: AssessmentResult | null
  }>({
    formData: null,
    imageAnalysis: null,
    result: null
  })

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()
  console.log(resetTranscript)
  useEffect(() => {
    setValue('conversation', transcript)
  }, [transcript, setValue])

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening()
    } else {
      SpeechRecognition.startListening({ continuous: true })
    }
  }

  const analyzeImage = async (imageFile: File) => {
    const formData = new FormData()
    formData.append('image', imageFile)

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze the image')
      }

      const { analysis }: { analysis: ImageAnalysis } = await response.json()
      return analysis
    } catch (error) {
      console.error('Error analyzing image:', error)
      throw new Error('Failed to analyze the image. Please try again.')
    }
  }

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true)
    setError(null)

    let imageAnalysisResult = null

    try {
      if (image) {
        imageAnalysisResult = await analyzeImage(image)
      }

      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => formData.append(key, value.toString()))
      if (imageAnalysisResult) {
        formData.append('imageAnalysis', JSON.stringify(imageAnalysisResult))
      }

      const response = await fetch('/api/health-insights', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process the health assessment')
      }

      const result: AssessmentResult = await response.json()
      
      const fullAssessmentData = {
        formData: data,
        imageAnalysis: imageAnalysisResult,
        result: result
      }

      localStorage.setItem('assessmentData', JSON.stringify(fullAssessmentData))
      setAssessmentData(fullAssessmentData)
      window.location.href = '/result'
    } catch (error) {
      console.error('Error processing assessment:', error)
      setError('An error occurred while processing your request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0])
    }
  }

  useEffect(() => {
    const savedData = localStorage.getItem('assessmentData')
    if (savedData) {
      setAssessmentData(JSON.parse(savedData))
    }
  }, [])

  if (!browserSupportsSpeechRecognition) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Browser doesn&apos;t support speech recognition.
        </AlertDescription>
      </Alert>
    )
  }

  const watchedFields = watch()
  const progress = Object.values(watchedFields).filter(Boolean).length / Object.keys(watchedFields).length * 100

  return (
    <div className="container mx-auto max-w-3xl p-4">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center">Health Risk Assessment</CardTitle>
          <CardDescription className="text-center text-white/80">Complete the form below for your personalized health insights</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg">Patient Name</Label>
              <Input id="name" {...register('name', { required: 'Name is required' })} className="text-lg" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-lg">Gender</Label>
              <RadioGroup defaultValue="female">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" {...register('gender')} />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" {...register('gender')} />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" {...register('gender')} />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-lg">Age</Label>
              <Input type="number" id="age" {...register('age', { required: 'Age is required', min: 0 })} className="text-lg" />
              {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="conversation" className="text-lg">Conversation Summary</Label>
              <div className="flex items-center space-x-2">
                <Textarea 
                  id="conversation" 
                  {...register('conversation', { required: 'Conversation summary is required' })} 
                  rows={5} 
                  className="text-lg"
                />
                <Button 
                  type="button" 
                  onClick={toggleListening}
                  variant="outline"
                  className="h-full"
                >
                  {listening ? <MicOff className="h-6 w-6 text-red-500" /> : <Mic className="h-6 w-6 text-blue-500" />}
                </Button>
              </div>
              {errors.conversation && <p className="text-red-500 text-sm">{errors.conversation.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-lg">Medical Image (Optional)</Label>
              <div className="flex items-center space-x-2">
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="text-lg" />
                <Button type="button" variant="outline" onClick={() => document.getElementById('image')?.click()}>
                  <Upload className="h-5 w-5 mr-2" />
                  Upload
                </Button>
              </div>
              {image && <p className="text-sm text-green-600">Image uploaded: {image.name}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-lg">Form Completion</Label>
              <Progress value={progress} className="w-full" />
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button type="submit" className="w-full text-lg py-6" disabled={loading || !isValid}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing
                  </>
                ) : (
                  'Submit Assessment'
                )}
              </Button>
            </motion.div>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!loading && !error && assessmentData.result && (
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-semibold mb-4">Assessment Results:</h3>
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <pre className="whitespace-pre-wrap overflow-auto max-h-96 text-sm">
                    {JSON.stringify(assessmentData, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default HealthRiskAssessmentPage