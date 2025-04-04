"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';

export default function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [donorName, setDonorName] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error) console.error('Error fetching campaign:', error);
      else setCampaign(data);
    };

    if (id) fetchCampaign();
  }, [id]);

  const handleDonate = async (e) => {
    e.preventDefault();

    let proof_url = null;

    if (proofFile) {
      const fileExt = proofFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${campaign.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('proofs')
        .upload(filePath, proofFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('proofs')
        .getPublicUrl(filePath);

      proof_url = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from('donations').insert([
      {
        donor_name: donorName || null,
        user_id: null,
        campaign_id: campaign.id,
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        proof_url,
      },
    ]);

    if (error) {
      console.error('Donation error:', error);
    } else {
      setSuccessMsg('✅ Thank you! Your donation has been recorded.');
      setAmount('');
      setPaymentMethod('');
      setDonorName('');
      setProofFile(null);
    }
  };

  if (!campaign) return <div className="p-6">Loading campaign...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 flex items-center justify-center min-h-screen">
      <div className="bg-gray-50 p-8 rounded-3xl shadow-2xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <img
              src={campaign.image_url}
              alt={campaign.title}
              className="rounded-xl w-full h-72 object-cover"
            />
            <h1 className="text-3xl font-bold mt-6">{campaign.title}</h1>
            <p className="text-gray-700 my-4">{campaign.description}</p>
            <div className="text-sm text-gray-500">
              📅 {campaign.start_date} → {campaign.end_date}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 my-4">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${(campaign.current_amount / campaign.target_amount) * 100}%` }}
              />
            </div>
            <div className="text-sm font-medium">
              RM {campaign.current_amount} / RM {campaign.target_amount}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-purple-600 text-white w-full px-6 py-3 rounded-xl hover:bg-purple-700"
            >
              {showForm ? 'Close Form' : 'Donate Now'}
            </button>

            {showForm && (
              <form onSubmit={handleDonate} className="space-y-4 mt-6" encType="multipart/form-data">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  className="w-full p-3 rounded-xl bg-gray-100 placeholder-gray-500 border-none"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Enter amount (e.g. 50)"
                  className="w-full p-3 rounded-xl bg-gray-100 placeholder-gray-500 border-none"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <select
                  className="w-full p-3 rounded-xl bg-gray-100 placeholder-gray-500 border-none"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="">Select Payment Method</option>
                  <option value="QR Pay">QR Pay</option>
                  <option value="FPX">FPX</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-3 rounded-xl bg-gray-100 placeholder-gray-500 border-none"
                  onChange={(e) => setProofFile(e.target.files[0])}
                />
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700">
                  Submit Donation
                </button>
                {successMsg && <p className="text-green-600 font-medium">{successMsg}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}