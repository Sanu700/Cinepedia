
'use client';

import { useState, useEffect } from 'react';
import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc, getFirestore } from 'firebase/firestore';

export function useAdminStatus() {
  const { user, isUserLoading } = useUser();
  const firestore = getFirestore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const adminRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'admins', user.uid);
  }, [firestore, user]);

  const { data: adminDoc, isLoading: isAdminDocLoading } = useDoc(adminRef);

  useEffect(() => {
    if (isUserLoading || isAdminDocLoading) {
      setIsLoading(true);
      return;
    }

    if (!user) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    setIsAdmin(adminDoc ? true : false);
    setIsLoading(false);

  }, [user, isUserLoading, adminDoc, isAdminDocLoading]);

  return { isAdmin, isLoading };
}
