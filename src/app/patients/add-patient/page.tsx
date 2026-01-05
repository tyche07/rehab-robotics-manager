'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import type { NewPatient } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  age: z.coerce.number().min(0, {
    message: 'Age must be a positive number.',
  }),
  condition: z.string().min(2, {
    message: 'Condition must be at least 2 characters.',
  }),
  medicalHistory: z.string().min(10, {
    message: 'Medical history must be at least 10 characters.',
  }),
  therapyGoals: z.string().min(10, {
    message: 'Therapy goals must be at least 10 characters.',
  }),
   avatarUrl: z.string().url({ message: "Please enter a valid URL." }),
   dataAiHint: z.string().optional(),
});

export default function AddPatientPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: 0,
      condition: '',
      medicalHistory: '',
      therapyGoals: '',
      avatarUrl: 'https://picsum.photos/seed/new/100/100',
      dataAiHint: 'person portrait'
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !user?.uid) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be signed in to add a patient.',
        });
        return;
    }
    setIsSubmitting(true);

    try {
      const newPatient: NewPatient = {
        ...values,
        therapyGoals: values.therapyGoals.split('\n').filter(goal => goal.trim() !== ''),
        sessions: [],
      };

      const patientsCollection = collection(firestore, 'users', user.uid, 'patients');
      const docRef = await addDoc(patientsCollection, newPatient);

      toast({
        title: 'Patient Added',
        description: `${values.name} has been added to your patient list.`,
      });

      router.push(`/patients/${docRef.id}`);
    } catch (error) {
      console.error('Error adding document: ', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem saving the patient. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Patient</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="58" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Post-Stroke Hemiparesis" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical History</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe patient's relevant medical history..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="therapyGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Therapy Goals</FormLabel>
                  <FormControl>
                    <Textarea placeholder="List each goal on a new line..." {...field} />
                  </FormControl>
                   <FormDescription>
                    Enter one therapy goal per line.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                        <Input placeholder="https://picsum.photos/seed/..." {...field} />
                    </FormControl>
                    <FormDescription>
                        You can use a service like picsum.photos for random placeholders.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <Button type="submit" disabled={isSubmitting || !user}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                'Add Patient'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
