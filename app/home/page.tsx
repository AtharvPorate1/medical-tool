"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormInputs {
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  conversation: string;
}

interface ProbableDisease {
  disease: string;
  chance: number;
}

interface ImageAnalysis {
  modality: string;
  organ: string;
  analysis: string;
  abnormalities?: string;
  treatment?: string;
}

interface AssessmentResult {
  probableDiseases: ProbableDisease[];
  remedies: string;
  advice: string;
  imageAnalysis: ImageAnalysis | null;
}

const HealthRiskAssessmentPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysis | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  

  const analyzeImage = async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze the image');
      }

      const { analysis }: { analysis: ImageAnalysis } = await response.json();
      setImageAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError('Failed to analyze the image. Please try again.');
    }
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Check if an image is provided and analyze it first
    if (image) {
      await analyzeImage(image);
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('gender', data.gender);
    formData.append('age', data.age.toString());
    formData.append('conversation', data.conversation);
    if (imageAnalysis) {
      formData.append('imageAnalysis', JSON.stringify(imageAnalysis));
    }

    try {
      const response = await fetch('/api/health-insights', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process the health assessment');
      }

      const result: AssessmentResult = await response.json();
      setResult(result);
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('An error occurred while processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Health Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Patient Name</Label>
              <Input id="name" {...register('name', { required: 'Name is required' })} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup defaultValue="female">
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
              </RadioGroup>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input type="number" id="age" {...register('age', { required: 'Age is required', min: 0 })} />
              {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="conversation">Conversation Summary</Label>
              <Textarea id="conversation" {...register('conversation', { required: 'Conversation summary is required' })} rows={5} />
              {errors.conversation && <p className="text-red-500 text-sm">{errors.conversation.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Medical Image (Optional)</Label>
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                'Submit Assessment'
              )}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {imageAnalysis && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold">Image Analysis</h3>
              <ul className="list-disc pl-5">
                <li>Modality: {imageAnalysis.modality}</li>
                <li>Organ: {imageAnalysis.organ}</li>
                <li>Analysis: {imageAnalysis.analysis}</li>
                {imageAnalysis.abnormalities && <li>Abnormalities: {imageAnalysis.abnormalities}</li>}
                {imageAnalysis.treatment && <li>Treatment: {imageAnalysis.treatment}</li>}
              </ul>
            </div>
          )}

          {result && (
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold">Assessment Results</h3>
              
              {result.probableDiseases.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium">Probable Diseases:</h4>
                  <ul className="list-disc pl-5">
                    {result.probableDiseases.map((diseaseObj, index) => (
                      <li key={index}>
                        {diseaseObj.disease} - {diseaseObj.chance}%
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-lg font-medium">Remedies:</h4>
                <p>{result.remedies}</p>
              </div>
              
              <div>
                <h4 className="text-lg font-medium">Advice:</h4>
                <p>{result.advice}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthRiskAssessmentPage;
