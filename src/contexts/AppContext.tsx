"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User, VCSDevice } from '@/lib/types';
import { mockUsers, mockDevices } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface AppContextType {
  currentUser: User;
  devices: VCSDevice[];
  getDeviceById: (id: string) => VCSDevice | undefined;
  lockOut: (deviceId: string, data: { contactNumber: string; workPermitNo: string; jobDescription: string; }) => void;
  unlock: (deviceId: string) => void;
  registerVCS: (data: { name: string; location: string }) => void;
  deleteVCS: (deviceId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser] = useState<User>(mockUsers[0]); // Default to technician
  const [devices, setDevices] = useState<VCSDevice[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const storedDevices = localStorage.getItem('vcs-devices');
    if (storedDevices) {
      setDevices(JSON.parse(storedDevices));
    } else {
      setDevices(mockDevices);
    }
  }, []);

  useEffect(() => {
    // This effect ensures that any change to the `devices` state is persisted to localStorage.
    // It will run after initial load and after any function that calls setDevices.
    // We check if devices is not empty to avoid overwriting localStorage with an empty array during initialization.
    if (devices.length > 0 || localStorage.getItem('vcs-devices')) {
      localStorage.setItem('vcs-devices', JSON.stringify(devices));
    }
  }, [devices]);

  const getDeviceById = (id: string) => {
    return devices.find(device => device.id === id);
  };

  const lockOut = (deviceId: string, data: { contactNumber: string; workPermitNo: string; jobDescription: string; }) => {
    let success = false;
    let deviceToLock: VCSDevice | null = null;
  
    setDevices(prevDevices => {
      const newDevices = prevDevices.map(device => {
        if (device.id === deviceId && device.status === 'ENERGIZED') {
          const lockTimestamp = new Date();
          const newLock = {
            lockedBy: currentUser,
            lockTimestamp,
            ...data,
          };
          const newHistoryEntry = {
            id: `log-${new Date().getTime()}`,
            lockedBy: currentUser,
            lockTimestamp,
            unlockedBy: null,
            unlockTimestamp: null,
            ...data
          };
          success = true;
          deviceToLock = device;
          return {
            ...device,
            status: 'LOCKED-OUT',
            currentLock: newLock,
            history: [newHistoryEntry, ...device.history],
          };
        }
        return device;
      });
      return newDevices;
    });

    if (success && deviceToLock) {
        toast({
            title: "ล็อคเอาท์สำเร็จ",
            description: `${deviceToLock.name} ถูกตัดพลังงานโดย ${currentUser.name}`,
            variant: "default",
        });
    }
  };

  const unlock = (deviceId: string) => {
    let success = false;
    let unlockedDeviceName: string | undefined;
    let unauthorizedAttempt = false;

    setDevices(prevDevices => {
      const newDevices = prevDevices.map(device => {
        if (device.id === deviceId && device.status === 'LOCKED-OUT') {
            if (device.currentLock?.lockedBy.id === currentUser.id) {
                const unlockTimestamp = new Date();
                unlockedDeviceName = device.name;
                success = true;
                return {
                    ...device,
                    status: 'ENERGIZED',
                    currentLock: null,
                    history: device.history.map((log, index) => 
                    index === 0 ? { ...log, unlockedBy: currentUser, unlockTimestamp } : log
                    ),
                };
            } else {
                unauthorizedAttempt = true;
            }
        }
        return device;
      });
      return newDevices;
    });

    if (success && unlockedDeviceName) {
        toast({
            title: "ปลดล็อคสำเร็จ",
            description: `${unlockedDeviceName} กลับมาพร้อมใช้งาน`,
            className: 'bg-accent text-accent-foreground border-accent',
        });
    } else if (unauthorizedAttempt) {
        toast({
            title: "เกิดข้อผิดพลาด",
            description: "คุณไม่มีสิทธิ์ปลดล็อคอุปกรณ์นี้",
            variant: "destructive",
        });
    }
  };

  const registerVCS = (data: { name: string; location: string }) => {
    const newDevice: VCSDevice = {
      id: `vcs-${new Date().getTime()}`,
      name: data.name,
      location: data.location,
      status: 'ENERGIZED',
      currentLock: null,
      history: [],
    };
    setDevices(prevDevices => [...prevDevices, newDevice]);
    toast({
        title: "ลงทะเบียนสำเร็จ",
        description: `อุปกรณ์ ${data.name} ถูกเพิ่มในระบบเรียบร้อยแล้ว`,
    });
  };

  const deleteVCS = (deviceId: string) => {
    const deviceToDelete = devices.find(d => d.id === deviceId);
    if (deviceToDelete) {
      setDevices(prevDevices => prevDevices.filter(device => device.id !== deviceId));
      toast({
        title: 'ลบอุปกรณ์สำเร็จ',
        description: `อุปกรณ์ ${deviceToDelete.name} ได้ถูกลบออกจากระบบแล้ว`,
        variant: 'destructive',
      });
      router.push('/');
    } else {
         toast({
            title: "เกิดข้อผิดพลาด",
            description: "ไม่พบอุปกรณ์ที่ต้องการลบ",
            variant: "destructive",
        });
    }
  };


  return (
    <AppContext.Provider value={{ currentUser, devices, getDeviceById, lockOut, unlock, registerVCS, deleteVCS }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
