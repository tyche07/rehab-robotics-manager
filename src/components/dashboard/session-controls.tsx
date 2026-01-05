
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, Activity, Move3d, Bot, ShieldCheck, Zap, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { BiometricCard } from './biometric-card';
import { Textarea } from '@/components/ui/textarea';
import type { Patient, SessionDataPoint, Session } from '@/lib/types';
import { AiRecommendationDialog } from './ai-recommendation-dialog';
import { adjustTherapyParameters } from '@/ai/flows/real-time-therapy-adjustment';
import type { TherapyParametersOutput } from '@/ai/flows/real-time-therapy-adjustment';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useFirestore, useUser } from '@/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';


interface SessionControlsProps {
  patient: Patient;
  onDataPoint: (data: SessionDataPoint[]) => void;
}

export function SessionControls({ patient, onDataPoint }: SessionControlsProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionStage, setSessionStage] = useState('warm-up');
  const [heartRate, setHeartRate] = useState(75);
  const [muscleLoad, setMuscleLoad] = useState(20);
  const [rangeOfMotion, setRangeOfMotion] = useState(45);
  const [robotResistance, setRobotResistance] = useState([15]);
  const [therapistNotes, setTherapistNotes] = useState('');
  const [sessionData, setSessionData] = useState<SessionDataPoint[]>([]);

  const sessionStartTime = useRef<Date | null>(null);

  const [controlMode, setControlMode] = useState('impedance');
  const [actuationSystem, setActuationSystem] = useState('sea');
  const [safetyStatus, setSafetyStatus] = useState('normal'); // normal, warning, error

  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<TherapyParametersOutput | null>(null);
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  
  const addDataPoint = useCallback(() => {
    setSessionData(currentData => {
       const newDataPoint: SessionDataPoint = {
        time: currentData.length * 2,
        heartRate: Math.round(heartRate),
        muscleLoad: Math.round(muscleLoad),
        rangeOfMotion: rangeOfMotion,
        robotResistance: robotResistance[0],
      };
      const updatedData = [...currentData, newDataPoint].slice(-30);
      onDataPoint(updatedData);
      return updatedData;
    });
  }, [heartRate, muscleLoad, onDataPoint, rangeOfMotion, robotResistance]);


  useEffect(() => {
    let dataInterval: NodeJS.Timeout | null = null;
    let biometricInterval: NodeJS.Timeout | null = null;

    if (isSessionActive) {
      dataInterval = setInterval(() => {
          addDataPoint();
      }, 2000);

      biometricInterval = setInterval(() => {
        setHeartRate(hr => Math.min(120, Math.max(70, hr + (Math.random() - 0.5) * 4)));
        setMuscleLoad(ml => {
          const newMl = Math.min(100, Math.max(0, ml + (Math.random() - 0.45) * 8));
          if (newMl > 95) setSafetyStatus('error');
          else if (newMl > 85) setSafetyStatus('warning');
          else setSafetyStatus('normal');
          return newMl;
        });
      }, 1500);
    }

    return () => {
        if (dataInterval) clearInterval(dataInterval);
        if (biometricInterval) clearInterval(biometricInterval);
    };
  }, [isSessionActive, addDataPoint]);
  
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
  
  const handleEmergencyStop = () => {
    setIsSessionActive(false);
    setSafetyStatus('error');
    toast({
        variant: "destructive",
        title: "Emergency Stop Activated",
        description: "The session has been immediately halted.",
    });
  }

  const handleSessionToggle = async () => {
    if (isSessionActive) {
      // Ending the session
      setIsSessionActive(false);
      onDataPoint([]); 

      if (sessionData.length > 0 && firestore && user?.uid && sessionStartTime.current) {
        const sessionEndTime = new Date();
        const durationInMinutes = Math.round((sessionEndTime.getTime() - sessionStartTime.current.getTime()) / 60000);

        const newSession: Session = {
          id: uuidv4(),
          date: new Date().toISOString(),
          duration: durationInMinutes,
          notes: therapistNotes,
          data: sessionData.map(dp => ({
            time: dp.time,
            rangeOfMotion: dp.rangeOfMotion,
            robotResistance: dp.robotResistance,
            muscleLoad: dp.muscleLoad
          }))
        };
        
        try {
          const patientDocRef = doc(firestore, 'users', user.uid, 'patients', patient.id);
          await updateDoc(patientDocRef, {
            sessions: arrayUnion(newSession)
          });
          toast({
            title: "Session Saved",
            description: `Session data for ${patient.name} has been saved successfully.`,
          });
          setTherapistNotes(''); // Clear notes after saving
        } catch (error) {
          console.error("Error saving session:", error);
          toast({
            variant: "destructive",
            title: "Failed to Save Session",
            description: "There was an error saving the session data to the database.",
          });
        }
      }
    } else {
      // Starting a new session
      setSessionData([]); 
      onDataPoint([]);
      sessionStartTime.current = new Date();
      setIsSessionActive(true);
    }
  }

  // Dynamically import v4 from uuid
  useEffect(() => {
    import('uuid').then(module => {
      // You can now use module.v4 if needed elsewhere, but this ensures it's loaded.
    }).catch(error => {
      console.error("Failed to load uuid module", error);
    });
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Robot Control & IoT Layer</CardTitle>
          <div className="mt-2 flex flex-wrap items-center gap-4">
             <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <span className="font-medium">IoT Status:</span>
                <Badge variant={isSessionActive ? "default" : "outline"} className="bg-green-600/20 text-green-400 border-green-600/30">Connected (WebSocket)</Badge>
            </div>
             <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="font-medium">Safety Supervisor:</span>
                <Badge variant={safetyStatus === 'normal' ? 'default' : safetyStatus === 'warning' ? 'secondary': 'destructive'} 
                className={
                  safetyStatus === 'normal' ? 'bg-green-600/20 text-green-400 border-green-600/30' : 
                  safetyStatus === 'warning' ? 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30' :
                  'bg-red-600/20 text-red-400 border-red-600/30'
                }>
                    {safetyStatus === 'normal' ? 'All Systems Nominal' : safetyStatus === 'warning' ? 'High Force Detected' : 'Threshold Exceeded'}
                </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="control-mode">Control Mode</Label>
                <Select value={controlMode} onValueChange={setControlMode} disabled={!isSessionActive}>
                  <SelectTrigger id="control-mode">
                    <SelectValue placeholder="Select control mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pid">PID Control</SelectItem>
                    <SelectItem value="impedance">Impedance Control</SelectItem>
                    <SelectItem value="admittance">Admittance Control</SelectItem>
                  </SelectContent>
                </Select>
              </div>
               <div className="space-y-2">
                <Label htmlFor="actuation-system">Actuation System</Label>
                <Select value={actuationSystem} onValueChange={setActuationSystem} disabled={!isSessionActive}>
                  <SelectTrigger id="actuation-system">
                    <SelectValue placeholder="Select actuation system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sea">Series Elastic Actuator (SEA)</SelectItem>
                    <SelectItem value="bldc">Brushless DC Motor (BLDC)</SelectItem>
                    <SelectItem value="hydraulic">Hydraulic Actuator</SelectItem>
                    <SelectItem value="pneumatic">Pneumatic Muscle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-end gap-2">
                <Button onClick={handleSessionToggle} className="w-full" variant={isSessionActive ? 'secondary' : 'default'}>
                  {isSessionActive ? 'End & Save Session' : 'Start Session'}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <XCircle className="mr-2 h-4 w-4" /> Emergency Stop
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to activate the Emergency Stop?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will immediately and forcefully halt all robotic movement and end the current session. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleEmergencyStop}>Confirm Stop</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
        </CardContent>
      </Card>

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
          valueClassName={muscleLoad > 85 ? 'text-yellow-400' : ''}
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
                disabled={!isSessionActive}
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
                disabled={!isSessionActive}
                />
                <span className="w-20 text-right font-semibold">{rangeOfMotion}°</span>
            </div>
        </div>
      </div>
      
      <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
         <Label htmlFor="therapist-notes" className="text-lg font-semibold">Therapist Notes</Label>
         <Textarea 
           id="therapist-notes" 
           placeholder="Enter observations about the session, patient feedback, or events..."
           value={therapistNotes}
           onChange={(e) => setTherapistNotes(e.target.value)}
           className="min-h-[100px]"
         />
         <Button onClick={handleGetAiRecommendation} disabled={isLoadingAi || !isSessionActive} className="w-full">
           <Bot className="mr-2 h-4 w-4" />
           {isLoadingAi ? "Analyzing..." : "Get AI Recommendation"}
         </Button>
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
