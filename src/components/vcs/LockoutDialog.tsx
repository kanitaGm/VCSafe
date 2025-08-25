"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import type { VCSDevice } from '@/lib/types';

const formSchema = z.object({
  contactNumber: z.string().min(9, { message: 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง' }),
  workPermitNo: z.string().min(1, { message: 'กรุณากรอกเลขที่ใบอนุญาตทำงาน' }),
  jobDescription: z.string().min(5, { message: 'กรุณาอธิบายลักษณะงาน' }).max(200),
  confirmation: z.literal(true, {
    errorMap: () => ({ message: 'คุณต้องยืนยันการคล้องกุญแจ' }),
  }),
});

export function LockoutDialog({ children, device }: { children: React.ReactNode; device: VCSDevice }) {
  const [open, setOpen] = useState(false);
  const { lockOut, currentUser } = useApp();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactNumber: '',
      workPermitNo: '',
      jobDescription: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { contactNumber, workPermitNo, jobDescription } = values;
    lockOut(device.id, { contactNumber, workPermitNo, jobDescription });
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>ดำเนินการตัดพลังงาน (Lock-out)</DialogTitle>
              <DialogDescription>
                กรอกข้อมูลสำหรับ {device.name}. ผู้ดำเนินการ: {currentUser.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>เบอร์โทรศัพท์ติดต่อกลับ</FormLabel>
                    <FormControl>
                      <Input placeholder="08X-XXX-XXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workPermitNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>เลขที่ใบอนุญาตทำงาน (Work Permit No.)</FormLabel>
                    <FormControl>
                      <Input placeholder="WP-XXXX-XX-XX-XXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ลักษณะงานที่ทำ</FormLabel>
                    <FormControl>
                      <Textarea placeholder="เช่น ซ่อมบำรุง, ตรวจสอบประจำปี..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        ข้าพเจ้าได้ทำการสับสวิตช์และคล้องกุญแจส่วนตัวเรียบร้อยแล้ว
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>ยกเลิก</Button>
              <Button type="submit">ยืนยันการ Lock-out</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
