"use client"

import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircuitBoard, Lock, Unlock, PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';

export function VCSDashboardClient() {
  const { devices } = useApp();

  return (
    <>
    <div className="flex justify-end">
        <Link href="/vcs/register">
          <Button>
            <PlusCircle className="mr-2" />
            ลงทะเบียน VCS
          </Button>
        </Link>
    </div>
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
      {devices.map((device) => (
        <Link href={`/vcs/${device.id}`} key={device.id}>
          <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">{device.name}</CardTitle>
              <CircuitBoard className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <div>
                <CardDescription className="text-xs">{device.location}</CardDescription>
              </div>
              <div className="mt-4">
                {device.status === 'LOCKED-OUT' ? (
                  <Badge variant="destructive" className="text-sm w-full justify-center py-1">
                    <Lock className="mr-2 h-4 w-4" />
                    LOCKED-OUT
                  </Badge>
                ) : (
                  <Badge className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm w-full justify-center py-1">
                    <Unlock className="mr-2 h-4 w-4" />
                    ENERGIZED
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
    </>
  );
}
