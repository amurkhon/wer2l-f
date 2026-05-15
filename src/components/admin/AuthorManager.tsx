'use client';

import { useState, useCallback } from 'react';
import { SafeImage } from '@/components/shared/SafeImage';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Trash2,
  UserPlus,
  Loader2,
  User,
  Save,
  RotateCcw,
} from 'lucide-react';
import type { AuthorshipWithMember, Member, AuthorshipRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { AUTHORSHIP_ROLE_LABELS } from '@/lib/utils';

interface AuthorManagerProps {
  workId: string;
  initialAuthors: AuthorshipWithMember[];
  allMembers: Member[];
}

interface DraftAuthor extends AuthorshipWithMember {
  isNew?: boolean;
  isRemoved?: boolean;
}

const ROLES: AuthorshipRole[] = ['first', 'corresponding', 'co_author', 'advisor', 'contributor'];

function SortableAuthorRow({
  author,
  onRoleChange,
  onContributionChange,
  onRemove,
}: {
  author: DraftAuthor;
  onRoleChange: (id: string, role: AuthorshipRole) => void;
  onContributionChange: (id: string, text: string) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: author._id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const initials = author.member.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border bg-background p-3"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted-foreground"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <SafeImage
        src={author.member.profileImage}
        alt={author.member.fullName}
        width={32}
        height={32}
        className="h-8 w-8 rounded-full object-cover shrink-0"
        fallback={
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
            {initials}
          </div>
        }
      />

      <span className="w-40 min-w-0 shrink-0 truncate text-sm font-medium">
        {author.member.fullName}
      </span>

      <Select
        value={author.role}
        onValueChange={(val) => onRoleChange(author._id, val as AuthorshipRole)}
      >
        <SelectTrigger className="h-8 w-40 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ROLES.map((r) => (
            <SelectItem key={r} value={r} className="text-xs">
              {AUTHORSHIP_ROLE_LABELS[r]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        className="h-8 flex-1 text-xs"
        placeholder="Contribution (optional)"
        value={author.contribution ?? ''}
        onChange={(e) => onContributionChange(author._id, e.target.value)}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 text-destructive hover:text-destructive"
        onClick={() => onRemove(author._id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function AuthorManager({ workId, initialAuthors, allMembers }: AuthorManagerProps) {
  const [authors, setAuthors] = useState<DraftAuthor[]>(() =>
    [...initialAuthors].sort((a, b) => a.order - b.order),
  );
  const [saving, setSaving] = useState(false);
  const [memberPickerOpen, setMemberPickerOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const addedMemberIds = new Set(authors.map((a) => a.memberId));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setAuthors((prev) => {
      const oldIndex = prev.findIndex((a) => a._id === active.id);
      const newIndex = prev.findIndex((a) => a._id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleRoleChange = useCallback((id: string, role: AuthorshipRole) => {
    setAuthors((prev) => prev.map((a) => (a._id === id ? { ...a, role } : a)));
  }, []);

  const handleContributionChange = useCallback((id: string, text: string) => {
    setAuthors((prev) =>
      prev.map((a) => (a._id === id ? { ...a, contribution: text } : a)),
    );
  }, []);

  const handleRemove = useCallback((id: string) => {
    setAuthors((prev) => prev.filter((a) => a._id !== id));
  }, []);

  const handleAddMember = (member: Member) => {
    const newAuthor: DraftAuthor = {
      _id: `new-${member._id}`,
      workId,
      memberId: member._id,
      member,
      order: authors.length + 1,
      role: 'co_author',
      contribution: undefined,
      isNew: true,
    };
    setAuthors((prev) => [...prev, newAuthor]);
    setMemberPickerOpen(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const currentIds = new Set(authors.map((a) => a._id));

      const toRemove = initialAuthors.filter((a) => !currentIds.has(a._id));
      const toAdd = authors.filter((a) => a.isNew);

      for (const a of toRemove) {
        const res = await fetch(`/api/proxy/works/${workId}/authors/${a._id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error(`Failed to remove author ${a.member.fullName}`);
      }

      const newAuthorships: { tempId: string; real: AuthorshipWithMember }[] = [];
      for (const a of toAdd) {
        const res = await fetch(`/api/proxy/works/${workId}/authors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            memberId: a.memberId,
            order: a.order,
            role: a.role,
            contribution: a.contribution || undefined,
          }),
        });
        if (!res.ok) throw new Error(`Failed to add author ${a.member.fullName}`);
        const real = await res.json() as AuthorshipWithMember;
        newAuthorships.push({ tempId: a._id, real });
      }

      let finalAuthors = authors.map((a) => {
        const resolved = newAuthorships.find((n) => n.tempId === a._id);
        return resolved ? { ...a, ...resolved.real, isNew: false } : a;
      });

      const orderItems = finalAuthors.map((a, i) => ({
        authorshipId: a._id,
        order: i + 1,
      }));

      if (orderItems.length > 0) {
        const res = await fetch(`/api/proxy/works/${workId}/authors/order`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: orderItems }),
        });
        if (!res.ok) throw new Error('Failed to reorder authors');
      }

      finalAuthors = finalAuthors.map((a, i) => ({ ...a, order: i + 1, isNew: false }));
      setAuthors(finalAuthors);
      toast({ title: 'Authors saved' });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save authors',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setAuthors([...initialAuthors].sort((a, b) => a.order - b.order));
  };

  const hasChanges =
    authors.some((a) => a.isNew) ||
    initialAuthors.some((a) => !authors.find((b) => b._id === a._id)) ||
    authors.some((a, i) => {
      const orig = initialAuthors.find((b) => b._id === a._id);
      return orig && (orig.role !== a.role || orig.order !== i + 1 || orig.contribution !== a.contribution);
    });

  const availableMembers = allMembers.filter((m) => !addedMemberIds.has(m._id));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Authors</CardTitle>
          <div className="flex gap-2">
            {hasChanges && (
              <Button type="button" variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={saving || !hasChanges}
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Authors
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {authors.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No authors yet. Add one below.
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={authors.map((a) => a._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {authors.map((author) => (
                  <SortableAuthorRow
                    key={author._id}
                    author={author}
                    onRoleChange={handleRoleChange}
                    onContributionChange={handleContributionChange}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <Popover open={memberPickerOpen} onOpenChange={setMemberPickerOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" size="sm" className="w-full">
              <UserPlus className="h-4 w-4" />
              Add Author
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search members..." />
              <CommandList>
                <CommandEmpty>No members found.</CommandEmpty>
                <CommandGroup>
                  {availableMembers.map((member) => (
                    <CommandItem
                      key={member._id}
                      onSelect={() => handleAddMember(member)}
                      className="flex items-center gap-2"
                    >
                      <SafeImage
                        src={member.profileImage}
                        alt={member.fullName}
                        width={24}
                        height={24}
                        className="h-6 w-6 rounded-full object-cover"
                        fallback={
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                            <User className="h-3 w-3" />
                          </div>
                        }
                      />
                      <div>
                        <div className="text-sm font-medium">{member.fullName}</div>
                        <div className="text-xs text-muted-foreground capitalize">{member.role}</div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
}
