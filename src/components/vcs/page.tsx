interface DevicePageProps {
  params: { id: string };
}

// ✅ เพิ่ม generateStaticParams
export async function generateStaticParams() {
  // สมมติคุณมี ID จาก API หรือ config:
  /*
  const ids = ['1', '2', '3']; // หรือดึงจากไฟล์/DB ตอน build
  return ids.map((id) => ({ id }));*/
  return [];
}

export default function DevicePage({ params }: DevicePageProps) {
  return <div>Device ID: {params.id}</div>;
}
