"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LockoutDialog } from './LockoutDialog';
import { VCSHistoryTable } from './VCSHistoryTable';
import { ArrowLeft, Lock, Unlock, AlertTriangle, ShieldCheck, User, Calendar, Phone, FileText, Wrench, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';

export function VCSDetailClient({ deviceId }: { deviceId: string }) {
  const { getDeviceById, currentUser, unlock, deleteVCS } = useApp();
  const [isMounted, setIsMounted] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [unlockConfirmed, setUnlockConfirmed] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const device = getDeviceById(deviceId);

  if (!isMounted) {
    return <VCSDetailSkeleton />;
  }

  if (!device) {
    // notFound() will be triggered by the context if the device is deleted,
    // so we can just return null or a loading state.
    return null;
  }

  const handleUnlock = () => {
    if (unlockConfirmed) {
      unlock(device.id);
      setShowUnlockDialog(false);
      setUnlockConfirmed(false);
    }
  };

  const handleDelete = () => {
    deleteVCS(device.id);
    setShowDeleteDialog(false);
  };

  const canUnlock = device.status === 'LOCKED-OUT' && device.currentLock?.lockedBy.id === currentUser.id;

  return (
    <div className="container mx-auto max-w-4xl">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4">
        <ArrowLeft className="h-4 w-4" />
        กลับไปหน้า Dashboard
      </Link>

      {device.status === 'LOCKED-OUT' ? (
        <Alert variant="destructive" className="mb-6 shadow-lg">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-xl font-bold">ถูกตัดพลังงานอยู่ (LOCKED-OUT)</AlertTitle>
          <AlertDescription>อุปกรณ์นี้ถูกตัดการเชื่อมต่อและอยู่ในขั้นตอนซ่อมบำรุง ห้ามใช้งานเด็ดขาด</AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-6 shadow-lg bg-accent text-accent-foreground border-accent">
          <ShieldCheck className="h-5 w-5 text-accent-foreground" />
          <AlertTitle className="text-xl font-bold">พร้อมใช้งาน (ENERGIZED)</AlertTitle>
          <AlertDescription>อุปกรณ์นี้เชื่อมต่อกับระบบพลังงานและพร้อมใช้งาน</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="status">สถานะปัจจุบัน</TabsTrigger>
          <TabsTrigger value="history">ประวัติ</TabsTrigger>
        </TabsList>
        <TabsContent value="status">
          <Card>
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle>{device.name}</CardTitle>
                <CardDescription>{device.location}</CardDescription>
              </div>
               <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  ลบอุปกรณ์
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {device.status === 'LOCKED-OUT' && device.currentLock ? (
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3"><User className="h-4 w-4 mt-0.5 text-muted-foreground" /><span className="font-medium w-40 shrink-0">ผู้ดำเนินการ:</span> <span>{device.currentLock.lockedBy.name}</span></div>
                  <div className="flex items-start gap-3"><Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" /><span className="font-medium w-40 shrink-0">เวลาที่เริ่มตัดพลังงาน:</span> <span>{new Date(device.currentLock.lockTimestamp).toLocaleString('th-TH')}</span></div>
                  <div className="flex items-start gap-3"><Phone className="h-4 w-4 mt-0.5 text-muted-foreground" /><span className="font-medium w-40 shrink-0">เบอร์โทรติดต่อ:</span> <span>{device.currentLock.contactNumber}</span></div>
                  <div className="flex items-start gap-3"><FileText className="h-4 w-4 mt-0.5 text-muted-foreground" /><span className="font-medium w-40 shrink-0">เลขที่ใบอนุญาตทำงาน:</span> <span>{device.currentLock.workPermitNo}</span></div>
                  <div className="flex items-start gap-3"><Wrench className="h-4 w-4 mt-0.5 text-muted-foreground" /><span className="font-medium w-40 shrink-0">ลักษณะงานที่ทำ:</span> <span>{device.currentLock.jobDescription}</span></div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">ไม่มีข้อมูลการ Lock-out ในขณะนี้</p>
              )}

              <div className="pt-4">
                {device.status === 'ENERGIZED' ? (
                  <LockoutDialog device={device}>
                    <Button size="lg" className="w-full md:w-auto">
                      <Lock className="mr-2 h-4 w-4" />
                      ตัดพลังงาน (Lock-out)
                    </Button>
                  </LockoutDialog>
                ) : (
                  <Button size="lg" className="w-full md:w-auto" onClick={() => setShowUnlockDialog(true)} disabled={!canUnlock}>
                    <Unlock className="mr-2 h-4 w-4" />
                    จ่ายพลังงานคืน (Unlock)
                  </Button>
                )}
                 {!canUnlock && device.status === 'LOCKED-OUT' && (
                    <p className="text-xs text-destructive mt-2">เฉพาะ {device.currentLock?.lockedBy.name} เท่านั้นที่สามารถปลดล็อคได้</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <VCSHistoryTable history={device.history} />
        </TabsContent>
      </Tabs>
      
      {/* Unlock Dialog */}
      <AlertDialog open={showUnlockDialog} onOpenChange={(open) => {setShowUnlockDialog(open); if(!open) setUnlockConfirmed(false);}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการจ่ายพลังงานคืน (Unlock)</AlertDialogTitle>
            <AlertDialogDescription>
              โปรดยืนยันว่าคุณได้ทำการตรวจสอบความปลอดภัยทั้งหมดก่อนจ่ายพลังงานคืนให้กับอุปกรณ์ {device.name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-2 my-4 p-4 border rounded-md bg-background">
            <Checkbox id="unlock-confirm" checked={unlockConfirmed} onCheckedChange={(checked) => setUnlockConfirmed(!!checked)} />
            <Label htmlFor="unlock-confirm" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            ข้าพเจ้าได้ตรวจสอบพื้นที่และนำเครื่องมือ/บุคลากรทั้งหมดออกจากพื้นที่ทำงานแล้ว
            </Label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnlock} disabled={!unlockConfirmed}>
              ยืนยัน
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบอุปกรณ์</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ว่าต้องการลบอุปกรณ์ "{device.name}"? การกระทำนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              ยืนยันการลบ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


function VCSDetailSkeleton() {
    return (
        <div className="container mx-auto max-w-4xl">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-24 w-full mb-6" />

            <div className="w-full">
                <div className="flex space-x-1 rounded-md bg-muted p-1 mb-2 w-full">
                    <Skeleton className="h-8 flex-1" />
                    <Skeleton className="h-8 flex-1" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2 mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-2/3" />
                        </div>
                        <div className="pt-4">
                           <Skeleton className="h-12 w-48" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
