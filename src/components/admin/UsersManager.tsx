'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import type { User, Member } from '@/types';
import { createUserSchema, type CreateUserFormValues } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { formatDate } from '@/lib/utils';

interface UsersManagerProps {
  initialUsers: User[];
  members: Member[];
}

function UserRow({
  user,
  onDelete,
}: {
  user: User;
  onDelete: (id: string) => Promise<void>;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <div className="flex items-center gap-4 py-3">
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{user.email}</div>
        <div className="mt-0.5 flex items-center gap-2">
          <Badge variant={user.accessLevel === 'admin' ? 'default' : 'secondary'} className="text-xs">
            {user.accessLevel}
          </Badge>
          {user.lastLogin && (
            <span className="text-xs text-muted-foreground">
              Last login: {formatDate(user.lastLogin)}
            </span>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive"
        onClick={() => setDeleteOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{user.email}</strong>? This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={async () => {
                setDeleting(true);
                await onDelete(user._id).finally(() => {
                  setDeleting(false);
                  setDeleteOpen(false);
                });
              }}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function UsersManager({ initialUsers, members }: UsersManagerProps) {
  const [users, setUsers] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { email: '', password: '', accessLevel: 'editor', memberId: '' },
  });

  const handleCreate = async (values: CreateUserFormValues) => {
    const payload = {
      ...values,
      memberId: values.memberId || undefined,
    };
    const res = await fetch('/api/proxy/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    const newUser = await res.json() as User;
    setUsers((prev) => [...prev, newUser]);
    form.reset();
    setShowForm(false);
    toast({ title: 'User created' });
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/proxy/users/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      toast({ title: 'Error', description: 'Failed to delete user', variant: 'destructive' });
      return;
    }
    setUsers((prev) => prev.filter((u) => u._id !== id));
    toast({ title: 'User deleted' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Users ({users.length})</CardTitle>
          <Button size="sm" onClick={() => setShowForm((s) => !s)}>
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (values) => {
                try {
                  await handleCreate(values);
                } catch {
                  toast({ title: 'Error', description: 'Failed to create user', variant: 'destructive' });
                }
              })}
              className="mb-4 rounded-lg border bg-muted/30 p-4 space-y-3"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="user@university.edu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Min 8 characters" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accessLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Level *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="memberId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Linked Member</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="None" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {members.map((m) => (
                            <SelectItem key={m._id} value={m._id}>
                              {m.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create User
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        )}

        {users.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No users yet.</p>
        ) : (
          <div className="divide-y">
            {users.map((user) => (
              <UserRow key={user._id} user={user} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
