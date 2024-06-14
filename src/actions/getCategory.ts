'use client';

import { usePathname } from 'next/navigation';

export default function GetCategory() {
  try {
    const pathname = usePathname();
    const category = pathname.split('/').filter(Boolean).pop();

    return category;
  } catch (error) {
    console.error(error);
  }
}
