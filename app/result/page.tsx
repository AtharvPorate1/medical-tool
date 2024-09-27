"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface DiagnosisResult {
  id: string;
  patientName: string;
  patientGender: string;
  patientAge: number;
  symptoms: string;
  analysis: string;
}

const ResultPage = () => {
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      fetchResult(params.id as string);
    }
  }, [params.id]);

  const fetchResult = async (diagnosisId: string) => {
    try {
      const response = await fetch(`/api/get-diagnosis/${diagnosisId}`);
      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        console.error('Failed to fetch diagnosis result');
      }
    } catch (error) {
      console.error('Error fetching diagnosis result:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!result) {
    return <div className="container mx-auto p-4">Diagnosis result not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Diagnosis Result</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Patient Information</h2>
          <p><strong>Name:</strong> {result.patientName}</p>
          <p><strong>Gender:</strong> {result.patientGender}</p>
          <p><strong>Age:</strong> {result.patientAge}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Symptoms</h2>
          <p>{result.symptoms}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Analysis</h2>
          <div className="whitespace-pre-wrap">{result.analysis}</div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;