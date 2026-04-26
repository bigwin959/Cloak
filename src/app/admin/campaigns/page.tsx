import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import CampaignCard from './CampaignCard';

export const dynamic = 'force-dynamic';

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: 'desc' }
  });

  async function createCampaign(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const moneyUrl = formData.get('moneyUrl') as string;
    const cloakUrl = formData.get('cloakUrl') as string;

    if (!name || !slug || !moneyUrl || !cloakUrl) return;

    try {
      await prisma.campaign.create({
        data: { name, slug, moneyUrl, cloakUrl }
      });
      revalidatePath('/admin/campaigns');
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  }

  async function deleteCampaign(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    if (!id) return;
    await prisma.campaign.delete({ where: { id } });
    revalidatePath('/admin/campaigns');
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-white">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Campaign Sets</h1>
        <p className="text-gray-400">Manage your dynamic cloaking traffic sets mapped to external domains.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 border border-slate-800 bg-slate-900/50 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Create New Set</h3>
            <form action={createCampaign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Campaign Name</label>
                <input required type="text" name="name" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="FB Ad Group 1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tracking Slug</label>
                <div className="flex bg-slate-800 border border-slate-700 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500">
                  <span className="px-3 py-2 text-slate-500 text-sm border-r border-slate-700 bg-slate-800/50">/go/</span>
                  <input required type="text" name="slug" className="w-full bg-transparent p-2 text-sm outline-none" placeholder="fb-ad-1" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Money Domain (Human Target)</label>
                <input required type="url" name="moneyUrl" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="https://my-real-offer.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Cloak Domain (Bot Target)</label>
                <input required type="url" name="cloakUrl" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="https://my-safe-game.com" />
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 mt-4 rounded-lg transition-all shadow-lg hover:shadow-emerald-500/20">
                Generate Campaign
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-panel p-6 border border-slate-800 bg-slate-900/50 rounded-xl min-h-[400px]">
             <h3 className="text-lg font-semibold mb-4">Active Campaigns</h3>
             
             {campaigns.length === 0 ? (
               <div className="flex items-center justify-center h-64 border border-dashed border-slate-700 rounded-xl">
                 <div className="text-center">
                    <p className="text-slate-400 mb-2">No campaigns created yet.</p>
                    <p className="text-sm text-slate-500">Use the form to create your first tracking set.</p>
                 </div>
               </div>
             ) : (
               <div className="space-y-4">
                 {campaigns.map(camp => (
                   <CampaignCard key={camp.id} camp={camp} deleteAction={deleteCampaign} />
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
