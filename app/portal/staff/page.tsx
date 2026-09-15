import { getSession } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import StaffLogin from './staff-login';
import StaffWorkspace from './staff-workspace';

export default async function StaffPage(){
  const session=await getSession();
  if(!session) return <StaffLogin/>;
  if(session.role!=='staff' && session.role!=='admin') redirect('/portal');
  return <StaffWorkspace fullName={session.fullName} role={session.role}/>;
}
