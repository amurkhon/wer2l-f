'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likesApi } from '@/lib/api/likes';
import { generateAnonymousId } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  workId: string;
  initialCount: number;
}

const ANON_ID_KEY = 'lab_anonymous_id';
const LIKED_KEY = 'lab_liked_works';

function getAnonId(): string {
  let id = localStorage.getItem(ANON_ID_KEY);
  if (!id) {
    id = generateAnonymousId();
    localStorage.setItem(ANON_ID_KEY, id);
  }
  return id;
}

function getLikedWorks(): Set<string> {
  try {
    const raw = localStorage.getItem(LIKED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function setLikedWorks(set: Set<string>): void {
  localStorage.setItem(LIKED_KEY, JSON.stringify([...set]));
}

export function LikeButton({ workId, initialCount }: LikeButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const queryClient = useQueryClient();

  useEffect(() => {
    setMounted(true);
    const liked = getLikedWorks();
    setHasLiked(liked.has(workId));
  }, [workId]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (wasLiked: boolean) => {
      const anonId = getAnonId();
      if (wasLiked) {
        await likesApi.unlike(workId, anonId);
      } else {
        await likesApi.like(workId, anonId);
      }
    },
    onMutate: (wasLiked: boolean) => {
      setHasLiked(!wasLiked);
      setCount((c) => (wasLiked ? c - 1 : c + 1));
    },
    onSuccess: (_data, wasLiked) => {
      const liked = getLikedWorks();
      if (wasLiked) {
        liked.delete(workId);
      } else {
        liked.add(workId);
      }
      setLikedWorks(liked);
      void queryClient.invalidateQueries({ queryKey: ['works', workId] });
    },
    onError: (_err, wasLiked) => {
      setHasLiked(wasLiked);
      setCount((c) => (wasLiked ? c + 1 : c - 1));
    },
  });

  if (!mounted) {
    return (
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Heart className="h-4 w-4" />
        {initialCount}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => !isPending && mutate(hasLiked)}
      disabled={isPending}
      aria-label={hasLiked ? 'Unlike this work' : 'Like this work'}
      className={cn(
        'flex items-center gap-1.5 text-sm transition-colors',
        hasLiked
          ? 'text-rose-500 hover:text-rose-600'
          : 'text-muted-foreground hover:text-rose-500',
        isPending && 'opacity-60',
      )}
    >
      <Heart className={cn('h-4 w-4', hasLiked && 'fill-current')} />
      {count}
    </button>
  );
}
