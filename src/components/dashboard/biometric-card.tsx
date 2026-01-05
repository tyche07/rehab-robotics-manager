import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BiometricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit: string;
  className?: string;
  valueClassName?: string;
}

export function BiometricCard({ icon, title, value, unit, className, valueClassName }: BiometricCardProps) {
  return (
    <Card className={cn("text-center", className)}>
      <CardHeader className="pb-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg font-medium text-muted-foreground">{title}</CardTitle>
        <p className={cn("mt-1 text-4xl font-bold", valueClassName)}>
          {value}
          <span className="text-xl font-medium text-muted-foreground">{unit}</span>
        </p>
      </CardContent>
    </Card>
  );
}
