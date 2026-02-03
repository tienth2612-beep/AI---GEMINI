export const generateSmartInvoiceData = (aiResponse: string) => {
  try {
    const dataMatch = aiResponse.match(/\[DATA\]([\s\S]*?)\[\/DATA\]/);
    if (dataMatch) {
      const raw = JSON.parse(dataMatch[1].trim());
      return renderProInvoice(raw.customer, raw.items);
    }
  } catch (e) { console.error(e); }
  return renderProInvoice("Demo Client", [{ desc: "AI Infrastructure", price: 1200 }]);
};

function renderProInvoice(name: string, items: any[]) {
  const total = items.reduce((s, i) => s + i.price, 0);
  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>body { font-family: 'Inter', sans-serif; letter-spacing: -0.02em; }</style>
      </head>
      <body class="bg-white p-6 md:p-16 text-left">
        <div class="max-w-4xl mx-auto border border-gray-100 p-8 md:p-20 rounded-[3rem] shadow-[0_30px_80px_rgba(0,0,0,0.05)]">
          <div class="flex flex-col md:flex-row justify-between mb-24 gap-10">
            <div>
              <div class="w-16 h-16 bg-blue-600 rounded-[22px] mb-8 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-100 italic">A</div>
              <h1 class="text-6xl font-[900] text-gray-900 tracking-[ -0.05em] leading-none mb-4 uppercase italic">Invoice</h1>
              <p class="text-gray-400 font-bold text-sm tracking-widest font-mono">#${Date.now().toString().slice(-6)}</p>
            </div>
            <div class="text-left md:text-right">
               <p class="text-gray-900 text-xl font-black mb-2 tracking-tighter">AI AGENT TECH CORP</p>
               <p class="text-gray-400 text-sm font-semibold uppercase tracking-widest leading-relaxed">Global Innovation Hub<br/>Palo Alto, California</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
            <div class="text-left">
              <p class="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-6">Billed To</p>
              <p class="text-3xl font-black text-gray-900 leading-[1.1] break-words">${name}</p>
              <p class="text-gray-400 mt-2 font-bold uppercase text-xs tracking-widest">Enterprise Partner</p>
            </div>
            <div class="text-left md:text-right">
              <p class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Issued Date</p>
              <p class="text-xl font-black text-gray-800">${new Date().toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</p>
              <div class="inline-block mt-4 px-4 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100">Status: Verified</div>
            </div>
          </div>

          <div class="overflow-x-auto mb-20">
            <table class="w-full text-sm">
              <tr class="border-b-2 border-gray-900 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th class="pb-6 text-left">Service Description</th>
                <th class="text-right pb-6">Amount</th>
              </tr>
              ${items.map(i => `
                <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td class="py-10">
                    <p class="font-extrabold text-gray-900 text-xl tracking-tight">${i.desc}</p>
                    <p class="text-gray-400 mt-1 font-bold text-xs uppercase tracking-widest">Strategic AI Integration</p>
                  </td>
                  <td class="text-right py-10 font-[900] text-gray-900 text-2xl tracking-tighter">$${i.price.toLocaleString()}</td>
                </tr>
              `).join('')}
            </table>
          </div>

          <div class="flex flex-col md:flex-row justify-between items-center gap-10 bg-slate-50 p-12 rounded-[2.5rem] border border-gray-100 shadow-inner">
            <div class="text-left">
              <p class="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2 font-bold">Total Amount Due</p>
              <p class="text-gray-400 text-sm font-medium">All local and international taxes included.</p>
            </div>
            <p class="text-6xl md:text-7xl font-[1000] text-blue-600 tracking-[-0.07em] leading-none italic">$${total.toLocaleString()}</p>
          </div>
          
          <div class="mt-24 pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p class="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">Digital Certified Document</p>
            <div class="flex gap-4">
               <div class="w-8 h-8 bg-gray-50 rounded-lg"></div>
               <div class="w-8 h-8 bg-gray-50 rounded-lg"></div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}