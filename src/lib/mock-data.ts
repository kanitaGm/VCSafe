import type { User, VCSDevice } from './types';

export const mockUsers: User[] = [
  { id: 'user-1', name: 'นายสมชาย รักความปลอดภัย', employeeId: 'T001', role: 'Technician' },
  { id: 'user-2', name: 'นางสาวใจดี มีเมตตา', employeeId: 'S001', role: 'Supervisor' },
];

export const mockDevices: VCSDevice[] = [
  {
    id: 'vcs-001',
    name: 'VCS-Main-01',
    location: 'อาคาร 1, ชั้น 2, ห้องไฟฟ้าหลัก',
    status: 'ENERGIZED',
    currentLock: null,
    history: [],
  },
  {
    id: 'vcs-002',
    name: 'VCS-Sub-A-05',
    location: 'อาคาร 1, ชั้น 3, โซน A',
    status: 'LOCKED-OUT',
    currentLock: {
      lockedBy: mockUsers[0],
      lockTimestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
      contactNumber: '081-234-5678',
      workPermitNo: 'WP-2567-07-28-001',
      jobDescription: 'ซ่อมบำรุงระบบสายพานลำเลียง',
    },
    history: [
      {
        id: 'log-001',
        lockedBy: mockUsers[0],
        lockTimestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
        unlockedBy: null,
        unlockTimestamp: null,
        contactNumber: '081-234-5678',
        workPermitNo: 'WP-2567-07-28-001',
        jobDescription: 'ซ่อมบำรุงระบบสายพานลำเลียง',
      }
    ],
  },
  {
    id: 'vcs-003',
    name: 'VCS-Pump-Ctrl-03',
    location: 'โรงสูบน้ำ, อาคาร B',
    status: 'ENERGIZED',
    currentLock: null,
    history: [
       {
        id: 'log-002',
        lockedBy: mockUsers[0],
        lockTimestamp: new Date('2024-07-25T10:00:00Z'),
        unlockedBy: mockUsers[0],
        unlockTimestamp: new Date('2024-07-25T16:30:00Z'),
        contactNumber: '081-234-5678',
        workPermitNo: 'WP-2567-07-25-005',
        jobDescription: 'เปลี่ยนซีลปั๊มน้ำ',
      }
    ],
  },
    {
    id: 'vcs-004',
    name: 'VCS-HVAC-07',
    location: 'อาคาร 2, ดาดฟ้า',
    status: 'ENERGIZED',
    currentLock: null,
    history: [],
  },
];
