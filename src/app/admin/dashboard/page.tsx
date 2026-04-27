import type { Metadata } from 'next';
import Link from 'next/link';
import { Users, BookOpen, Heart, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { worksApi } from '@/lib/api/works';
import { membersApi } from '@/lib/api/members';
import { formatDate, WORK_TYPE_LABELS } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false },
};

export default async function DashboardPage() {
  const [worksResult, membersResult] = await Promise.allSettled([
    worksApi.list({}),
    membersApi.list({}),
  ]);

  const allWorks = worksResult.status === 'fulfilled' ? worksResult.value : [];
  const allMembers = membersResult.status === 'fulfilled' ? membersResult.value : [];

  const currentYear = new Date().getFullYear();
  const worksThisYear = allWorks.filter((w) => {
    if (!w.completionDate) return false;
    return new Date(w.completionDate).getFullYear() === currentYear;
  }).length;

  const totalLikes = allWorks.reduce((sum, w) => sum + w.likeCount, 0);

  const recentWorks = [...allWorks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 10);

  const stats = [
    { label: 'Total Members', value: allMembers.length, icon: Users, href: '/admin/members' },
    { label: 'Total Works', value: allWorks.length, icon: BookOpen, href: '/admin/works' },
    { label: `Works in ${currentYear}`, value: worksThisYear, icon: BookOpen, href: '/admin/works' },
    { label: 'Total Likes', value: totalLikes, icon: Heart, href: null },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href="/admin/members/new">
              <Plus className="h-4 w-4" />
              Add Member
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/works/new">
              <Plus className="h-4 w-4" />
              Add Work
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) =>
          stat.href ? (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="font-serif text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-serif text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ),
        )}
      </div>

      {/* Recent works */}
      <div>
        <h2 className="mb-4 font-serif text-xl font-semibold">Recent Activity</h2>
        <Card>
          <div className="divide-y">
            {recentWorks.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">No works yet.</div>
            ) : (
              recentWorks.map((work) => (
                <div key={work._id} className="flex items-center gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/works/${work._id}`}
                      className="font-medium hover:text-primary truncate block"
                    >
                      {work.title}
                    </Link>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {WORK_TYPE_LABELS[work.type]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Updated {formatDate(work.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/works/${work._id}`}>Edit</Link>
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
