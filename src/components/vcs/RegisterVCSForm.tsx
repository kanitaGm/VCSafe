"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(3, { message: 'ชื่อ VCS ต้องมีอย่างน้อย 3 ตัวอักษร' }),
  location: z.string().min(3, { message: 'กรุณากรอกชื่อเครื่องจักรหรือสถานที่ติดตั้ง' }),
});

export function RegisterVCSForm() {
  const { registerVCS } = useApp();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      location: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    registerVCS(values);
    form.reset();
    router.push('/');
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>ข้อมูลอุปกรณ์</CardTitle>
            <CardDescription>กรอกข้อมูลของ VCS ที่ต้องการเพิ่มเข้าระบบ</CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>ชื่อ VCS</FormLabel>
                            <FormControl>
                            <Input placeholder="เช่น VCS-Main-02" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>เครื่องจักร / สถานที่ติดตั้ง</FormLabel>
                            <FormControl>
                            <Input placeholder="เช่น เครื่องจักรฝ่ายผลิต A, ห้องควบคุมหลัก" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter>
                     <Button type="submit">
                        <PlusCircle className="mr-2" />
                        เพิ่มอุปกรณ์
                    </Button>
                </CardFooter>
            </form>
        </Form>
    </Card>
  );
}
