"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Activity, Move3d, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { BiometricCard } from './biometric-card';
import { Textarea } from '@/components/ui/textarea';
import type { Patient, SessionDataPoint } from '@/lib/types';
import { AiRecommendationDialog } from './ai-recommendation-dialog';
import { adjustTherapyParameters } from '@/ai/flows/real-time-therapy-adjustment';
import type { TherapyParametersOutput } from '@/ai/flows/real-time-therapy-adjustment';
import { useToast } from '@/hooks/use-toast';

interface SessionControlsProps {
  patient: Patient;
  onDataPoint: (data: SessionDataPoint[]) => void;
}

export function SessionControls({ patient, onDataPoint }: SessionControlsProps) {
  const { toast } = useToast();
  const [sessionStage, setSessionStage] = useState('warm-up');
  const [heartRate, setHeartRate] = useState(75);
  const [muscleLoad, setMuscleLoad] = useState(20);
  const [rangeOfMotion, setRangeOfMotion] = useState(45);
  const [robotResistance, setRobotResistance] = useState([15]);
  const [therapistNotes, setTherapistNotes] = useState('');
  const [sessionData, setSessionData] = useState<SessionDataPoint[]>([]);

  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<TherapyParametersOutput | null>(null);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  
  const addDataPoint = useCallback(() => {
    const newDataPoint: SessionDataPoint = {
      time: sessionData.length * 2,
      heartRate: Math.round(heartRate),
      muscleLoad: Math.round(muscleLoad),
      rangeOfMotion: rangeOfMotion,
      robotResistance: robotResistance[0],
    };
    const updatedData = [...sessionData, newDataPoint].slice(-30); // Keep last 30 data points
    setSessionData(updatedData);
    onDataPoint(updatedData);
  }, [heartRate, muscleLoad, onDataPoint, rangeOfMotion, robotResistance, sessionData]);


  useEffect(() => {
    const dataInterval = setInterval(() => {
        addDataPoint();
    }, 2000);

    const biometricInterval = setInterval(() => {
      setHeartRate(hr => Math.min(120, Math.max(70, hr + (Math.random() - 0.5) * 4)));
      setMuscleLoad(ml => Math.min(100, Math.max(0, ml + (Math.random() - 0.5) * 5)));
    }, 2000);

    return () => {
        clearInterval(dataInterval);
        clearInterval(biometricInterval);
    };
  }, [addDataPoint]);
  
  const handleGetAiRecommendation = async () => {
    setIsLoadingAi(true);
    try {
      const result = await adjustTherapyParameters({
        heartRate: Math.round(heartRate),
        muscleLoad: Math.round(muscleLoad),
        rangeOfMotion,
        robotResistance: robotResistance[0],
        sessionStage,
        therapistNotes,
      });
      setAiRecommendation(result);
      setIsAiDialogOpen(true);
    } catch (error) {
      console.error("AI adjustment failed:", error);
      toast({
        variant: "destructive",
        title: "AI Recommendation Failed",
        description: "Could not get a recommendation from the AI. Please try again.",
      });
    } finally {
      setIsLoadingAi(false);
    }
  };
  
  const applyAiRecommendation = () => {
    if (aiRecommendation) {
        setRobotResistance([aiRecommendation.adjustedRobotResistance]);
        setRangeOfMotion(aiRecommendation.adjustedRangeOfMotion);
        setIsAiDialogOpen(false);
        toast({
            title: "AI Parameters Applied",
            description: "Robot resistance and range of motion have been updated.",
        });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <BiometricCard
          icon={<Heart className="h-6 w-6 text-red-500" />}
          title="Heart Rate"
          value={Math.round(heartRate)}
          unit=" bpm"
          valueClassName={heartRate > 110 ? 'text-red-500' : ''}
        />
        <BiometricCard
          icon={<Activity className="h-6 w-6 text-primary" />}
          title="Muscle Load"
          value={Math.round(muscleLoad)}
          unit="%"
          valueClassName={muscleLoad > 80 ? 'text-destructive' : ''}
        />
        <BiometricCard
          icon={<Move3d className="h-6 w-6 text-green-500" />}
          title="Range of Motion"
          value={rangeOfMotion}
          unit="°"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
            <Label htmlFor="robot-resistance" className="text-lg font-semibold">Robot Resistance</Label>
            <div className="flex items-center gap-4">
                <Slider
                id="robot-resistance"
                min={0}
                max={100}
                step={1}
                value={robotResistance}
                onValueChange={setRobotResistance}
                />
                <span className="w-20 text-right font-semibold">{robotResistance[0]}%</span>
            </div>
        </div>
        <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
            <Label htmlFor="range-of-motion" className="text-lg font-semibold">Target Range of Motion</Label>
            <div className="flex items-center gap-4">
                <Slider
                id="range-of-motion"
                min={0}
                max={180}
                step={1}
                value={[rangeOfMotion]}
                onValueChange={(val) => setRangeOfMotion(val[0])}
                />
                <span className="w-20 text-right font-semibold">{rangeOfMotion}°</span>
            </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
           <Label htmlFor="therapist-notes" className="text-lg font-semibold">Therapist Notes</Label>
           <Textarea 
             id="therapist-notes" 
             placeholder="Enter observations..."
             value={therapistNotes}
             onChange={(e) => setTherapistNotes(e.target.value)}
             className="min-h-[100px]"
           />
           <Button onClick={handleGetAiRecommendation} disabled={isLoadingAi} className="w-full">
             <Bot className="mr-2 h-4 w-4" />
             {isLoadingAi ? "Analyzing..." : "Get AI Recommendation"}
           </Button>
        </div>
      </div>
       {aiRecommendation && (
        <AiRecommendationDialog
          isOpen={isAiDialogOpen}
          onOpenChange={setIsAiDialogOpen}
          recommendation={aiRecommendation}
          onApply={applyAiRecommendation}
        />
      )}
    </div>
  );
}
