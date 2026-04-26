import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect the root domain to the Admin Dashboard
  redirect('/admin');
}
