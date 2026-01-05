"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot } from 'lucide-react';
import type { TherapyParametersOutput } from '@/ai/flows/real-time-therapy-adjustment';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface AiRecommendationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  recommendation: TherapyParametersOutput;
  onApply: () => void;
}

export function AiRecommendationDialog({ isOpen, onOpenChange, recommendation, onApply }: AiRecommendationDialogProps) {
  const { adjustedRobotResistance, adjustedRangeOfMotion, recommendation: recommendationText } = recommendation;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <span>AI-Powered Recommendation</span>
          </DialogTitle>
          <DialogDescription>
            Based on real-time data, here are the suggested parameter adjustments.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <Card>
            <CardHeader className="p-4 pb-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Robot Resistance</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-2xl font-bold">{adjustedRobotResistance}%</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="p-4 pb-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Range of Motion</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <p className="text-2xl font-bold">{adjustedRangeOfMotion}°</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h4 className="font-semibold">Justification & Notes</h4>
          <p className="mt-2 rounded-md border bg-secondary/50 p-3 text-sm text-secondary-foreground">{recommendationText}</p>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Dismiss
          </Button>
          <Button onClick={onApply}>
            Apply Adjustments
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
