'use server';

import { cookies } from 'next/headers';

export async function login(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'Ddjdurjoy3@bjcu';
  
  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', { 
      httpOnly: true, 
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });
    return { success: true };
  }
  
  return { success: false, error: 'Invalid password' };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}
