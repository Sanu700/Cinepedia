
'use client';

import { useState, useEffect } from 'react';
import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc, getFirestore } from 'firebase/firestore';

export function useAdminStatus() {
  const { user, isUserLoading } = useUser();
  const firestore = getFirestore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the document reference. It will be null until `user` is available.
  const adminRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'admins', user.uid);
  }, [firestore, user]);

  // useDoc hook to fetch the admin document.
  const { data: adminDoc, isLoading: isAdminDocLoading } = useDoc(adminRef);

  useEffect(() => {
    // We should only make a final decision once ALL loading is complete.
    if (isUserLoading || isAdminDocLoading) {
      setIsLoading(true);
      return; // Wait until all data sources are resolved.
    }

    // After loading, if we have a user and the admin document exists, they are an admin.
    if (user && adminDoc) {
      setIsAdmin(true);
    } else {
      // Otherwise, they are not an admin.
      setIsAdmin(false);
    }

    // Loading is complete.
    setIsLoading(false);

  }, [user, isUserLoading, adminDoc, isAdminDocLoading]);

  return { isAdmin, isLoading };
}
