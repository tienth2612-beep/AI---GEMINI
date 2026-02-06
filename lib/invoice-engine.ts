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
    const date = new Date().toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
    
    // Đã sửa CSS để responsive tốt hơn (p-6, text sizes, max-width)
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
             @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
             body { font-family: 'Inter', sans-serif; }
             /* Ẩn thanh cuộn cho gọn */
             ::-webkit-scrollbar { width: 0px; background: transparent; }
          </style>
        </head>
        <body class="bg-gray-50 min-h-screen p-4 flex justify-center">
          <div class="w-full max-w-2xl bg-white p-6 md:p-10 rounded-2xl border border-gray-200 shadow-sm">
            
            <div class="flex justify-between items-start mb-10">
               <div>
                  <h1 class="text-3xl font-black text-slate-900 uppercase tracking-tight">Invoice</h1>
                  <span class="text-xs font-bold text-gray-400 tracking-widest">#INV-${Date.now().toString().slice(-4)}</span>
               </div>
               <div class="text-right">
                  <div class="font-bold text-blue-600 text-lg">AI CORP.</div>
                  <div class="text-[10px] text-gray-400 font-semibold uppercase">Silicon Valley, USA</div>
               </div>
            </div>
  
            <div class="flex flex-col md:flex-row justify-between gap-8 mb-10 p-6 bg-slate-50 rounded-xl">
               <div>
                  <p class="text-[10px] uppercase font-bold text-gray-400 mb-1">Billed To</p>
                  <p class="font-bold text-slate-800 text-lg">${name}</p>
               </div>
               <div class="md:text-right">
                  <p class="text-[10px] uppercase font-bold text-gray-400 mb-1">Date</p>
                  <p class="font-bold text-slate-800">${date}</p>
               </div>
            </div>
  
            <table class="w-full text-sm mb-8">
              <thead>
                <tr class="border-b border-gray-200 text-left text-[10px] uppercase text-gray-400 font-bold">
                  <th class="py-3">Description</th>
                  <th class="py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(i => `
                  <tr class="border-b border-gray-50">
                    <td class="py-4 font-semibold text-slate-700">${i.desc}</td>
                    <td class="py-4 text-right font-bold text-slate-900">$${i.price.toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
  
            <div class="flex justify-end items-center gap-4 pt-4">
               <span class="text-xs font-bold text-gray-400 uppercase">Total</span>
               <span class="text-3xl font-black text-blue-600">$${total.toLocaleString()}</span>
            </div>
  
            <div class="mt-12 pt-6 border-t border-gray-100 text-center">
               <p class="text-[10px] text-gray-400 font-medium">Thank you for your business.</p>
            </div>
  
          </div>
        </body>
      </html>
    `;
  }