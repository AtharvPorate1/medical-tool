"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

const ResultPage: React.FC = () => {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        setResult(parsedData);
      } catch (error) {
        console.error('Error parsing result data:', error);
      }
    }
  }, [searchParams]);

  if (!result) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Assessment Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {result.probableDiseases.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold">Probable Diseases:</h3>
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
            <h3 className="text-xl font-semibold">Remedies:</h3>
            <p>{result.remedies}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Advice:</h3>
            <p>{result.advice}</p>
          </div>

          {result.imageAnalysis && (
            <div>
              <h3 className="text-xl font-semibold">Image Analysis:</h3>
              <ul className="list-disc pl-5">
                <li>Modality: {result.imageAnalysis.modality}</li>
                <li>Organ: {result.imageAnalysis.organ}</li>
                <li>Analysis: {result.imageAnalysis.analysis}</li>
                {result.imageAnalysis.abnormalities && <li>Abnormalities: {result.imageAnalysis.abnormalities}</li>}
                {result.imageAnalysis.treatment && <li>Treatment: {result.imageAnalysis.treatment}</li>}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultPage;