'use client';

import { usePathname } from 'next/navigation';

export default function getCategory() {
  try {
    const pathname = usePathname();
    const category = pathname.split('/').filter(Boolean).pop();

    return category;
  } catch (error) {
    console.error(error);
  }
}
