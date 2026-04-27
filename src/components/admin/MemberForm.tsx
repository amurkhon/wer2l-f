'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { memberSchema, type MemberFormValues } from '@/lib/schemas';
import type { Member } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// Switch imported but not currently used in MemberForm
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MemberFormProps {
  member?: Member;
  onSubmit: (values: MemberFormValues) => Promise<void>;
}

export function MemberForm({ member, onSubmit }: MemberFormProps) {
  const router = useRouter();

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      fullName: member?.fullName ?? '',
      role: member?.role ?? 'researcher',
      status: member?.status ?? 'active',
      biography: member?.biography ?? '',
      profileImage: member?.profileImage ?? '',
      socialLinks: {
        email: member?.socialLinks.email ?? '',
        linkedin: member?.socialLinks.linkedin ?? '',
        googleScholar: member?.socialLinks.googleScholar ?? '',
        orcid: member?.socialLinks.orcid ?? '',
        personalSite: member?.socialLinks.personalSite ?? '',
      },
      joinedDate: member?.joinedDate
        ? new Date(member.joinedDate).toISOString().split('T')[0] ?? ''
        : '',
      leftDate: member?.leftDate
        ? new Date(member.leftDate).toISOString().split('T')[0]
        : undefined,
    },
  });

  const handleSubmit = async (values: MemberFormValues) => {
    try {
      await onSubmit(values);
      toast({ title: member ? 'Member updated' : 'Member created' });
      router.push('/admin/members');
      router.refresh();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Something went wrong',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="professor">Professor</SelectItem>
                      <SelectItem value="researcher">Researcher</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="alumni">Alumni</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="alumni">Alumni</SelectItem>
                      <SelectItem value="emeritus">Emeritus</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="joinedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Joined Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leftDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Left Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Profile Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="biography"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Biography</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Short biography..." {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ['socialLinks.email', 'Email', 'email'],
                ['socialLinks.linkedin', 'LinkedIn URL', 'text'],
                ['socialLinks.googleScholar', 'Google Scholar URL', 'text'],
                ['socialLinks.orcid', 'ORCID URL', 'text'],
                ['socialLinks.personalSite', 'Personal Site URL', 'text'],
              ] as const
            ).map(([name, label, inputType]) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input
                        type={inputType}
                        placeholder={inputType === 'email' ? 'jane@university.edu' : 'https://...'}
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {member ? 'Update Member' : 'Create Member'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
