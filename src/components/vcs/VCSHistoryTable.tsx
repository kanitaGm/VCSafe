"use client";

import type { LockoutLog } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function VCSHistoryTable({ history }: { history: LockoutLog[] }) {
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ประวัติการ Lockout/Tagout</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">ไม่มีประวัติการดำเนินการ</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
        <CardHeader>
          <CardTitle>ประวัติการ Lockout/Tagout</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>ใบอนุญาตทำงาน</TableHead>
                    <TableHead>ผู้ล็อค</TableHead>
                    <TableHead>เวลาล็อค</TableHead>
                    <TableHead>ผู้ปลดล็อค</TableHead>
                    <TableHead>เวลาปลดล็อค</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {history.map((log) => (
                    <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.workPermitNo}</TableCell>
                        <TableCell>{log.lockedBy.name}</TableCell>
                        <TableCell>{new Date(log.lockTimestamp).toLocaleString('th-TH')}</TableCell>
                        <TableCell>{log.unlockedBy?.name || '-'}</TableCell>
                        <TableCell>
                        {log.unlockTimestamp ? new Date(log.unlockTimestamp).toLocaleString('th-TH') : 'ยังไม่ปลดล็อค'}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
