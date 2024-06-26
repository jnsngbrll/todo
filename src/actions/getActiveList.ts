import { usePathname } from 'next/navigation';

export default function GetActiveList() {
  const pathname = usePathname();
  const activeList = pathname.split('/').filter(Boolean).pop();

  return activeList;
}
