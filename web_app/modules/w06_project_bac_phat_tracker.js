/**
 * =========================================================================================
 * MODULE W06: THEO DÕI CHUYÊN SÂU HỢP ĐỒNG & CÔNG NỢ BÁC PHÁT (ĐƯỜNG 26/03)
 * Phân hệ Quản trị Dự án, Tiến độ Thi công & Thu hồi Dòng tiền Két sắt PG Home
 * Chuẩn hóa theo Master SOP 4.0 & Hiến Pháp Kỷ Luật Thép PG Home Luxury
 * =========================================================================================
 */

(function (window) {
  'use strict';

  const PROJECT_DATA = {
    metadata: {
      projectId: "g8149011240458184403",
      projectName: "Thiết kế nhà Bác Phát Đường 26/03",
      customerName: "Bác Phát (Nguyễn Đăng Phát)",
      address: "Đường 26/03, TP. Hà Tĩnh",
      auditTimestamp: "2026-11-07 10:36:01",
      latestFieldAuditDate: "2026-11-06",
      standard: "Master SOP 4.0 & Quy chuẩn quản trị PG Home"
    },
    financials: {
      contractValue: 220000000,
      contractValueFormatted: "220.000.000 đ",
      advancePaymentPhase1: 110000000,
      advancePaymentPhase1Formatted: "110.000.000 đ",
      advancePaymentPhase1Ratio: 0.5,
      advancePaymentPhase1RatioFormatted: "50.0%",
      actualProgressPercent: 95.0,
      actualProgressFormatted: "95.0%",
      remainingReceivablePhase2: 110000000,
      remainingReceivablePhase2Formatted: "110.000.000 đ",
      debtRecoveryStatus: "URGENT_HANDOVER_ALERT",
      summary: "Đã tạm ứng đợt 1 (50%), công trình đạt 95% tiến độ thực tế tại hiện trường ngày 06/11/2026, chuẩn bị nghiệm thu bàn giao để quyết toán thu hồi nốt 110.000.000 đ đợt 2."
    },
    stakeholders: [
      {
        uid: "4548339759561286106",
        name: "Nguyễn Đăng Phát",
        role: "Chủ đầu tư / Bác Phát",
        type: "client",
        filesShared: 88,
        avatar: "https://s160-26-ava-talk.zadn.vn/1/872069b55d871bd061a7949613b48442.jpg?key=ReyHDGlTbx5i6TymdN1k5A&time=1799139105"
      },
      {
        uid: "7617747951538527859",
        name: "Phú Gia Hiệp G",
        role: "Sale Admin & Quản lý Dự án",
        type: "pghome_sale",
        filesShared: 67,
        avatar: "https://s160-26-ava-talk.zadn.vn/52/52d19be1711a464d94f1fbfc7ec835d4.jpg?key=ssV4TZv1JiJl3RfW6cW-WA&time=1796173678"
      },
      {
        uid: "1266851172782015824",
        name: "Thái Pg Home 2026",
        role: "Kỹ thuật Xưởng & Giám sát Hiện trường",
        type: "pghome_tech",
        filesShared: 73,
        avatar: "https://s120-ava-talk.zadn.vn/4/c/2/e/2/120/1463ecf8ef5408f129c182047a6b97bf.jpg"
      },
      {
        uid: "1193413708528852811",
        name: "Thu Hương",
        role: "Đại diện Gia đình Bác Phát",
        type: "family",
        filesShared: 26,
        avatar: "https://s160-26-ava-talk.zadn.vn/16/3ea665c3c4ed68d413df3be7ed0bbf8f.jpg?key=U599bs8SLuFud45anivgQw&time=1797427685"
      },
      {
        uid: "4179747197760224197",
        name: "Hà My",
        role: "Thành viên Gia đình Bác Phát",
        type: "family",
        filesShared: 5,
        avatar: "https://s120-26-ava-talk.zadn.vn/132/a084dff6514e1b9b65eca0f0a2584c81.jpg?key=OgTaAkFstZZTB0RS3BEiEQ&time=1795911013"
      }
    ],
    technicalDrawings: [
      { rev: 1, date: "26/09/2026", pages: 3, note: "Bản vẽ sơ bộ phương án ốp Nan và Vách cốt xanh Melamine Thái Lan" },
      { rev: 2, date: "28/09/2026", pages: 3, note: "Hiệu chỉnh kích thước thực tế hiện trường Mục 3 & Mục 2" },
      { rev: 3, date: "05/10/2026", pages: 2, note: "Chốt quy cách vật liệu ván MDF chống ẩm phủ Melamine cao cấp" },
      { rev: 4, date: "06/10/2026", pages: 2, note: "Phê duyệt phương án kết cấu chịu lực và hoàn thiện nẹp chỉ" },
      { rev: 5, date: "12/10/2026", pages: 2, note: "Cập nhật giải pháp phụ kiện & đường điện âm theo chủ nhà" },
      { rev: 6, date: "16/10/2026", pages: 2, note: "Bản vẽ gia công chốt xưởng chuyển máy CNC PG Home cắt ván" }
    ],
    fieldAuditNov06: {
      date: "06/11/2026 (15:58 - 16:02)",
      totalFiles: 19,
      inspector: "Thái Pg Home (Giám sát trưởng)",
      summary: "Đã hoàn thành lắp dựng hệ vách nan, tủ kệ và đồ gỗ nội thất chính. Đang hoàn thiện các chi tiết ron chỉ và vệ sinh công nghiệp trước bàn giao.",
      milestone: "95% hoàn thành - Sẵn sàng nghiệm thu kỹ thuật"
    }
  };

  const PG_Modules_W06 = {
    id: "w06_project_bac_phat_tracker",
    name: "Theo Dõi Chuyên Sâu Hợp Đồng & Công Nợ Bác Phát",
    version: "1.0.0",
    data: PROJECT_DATA,

    /**
     * Render widget ra DOM
     */
    render: function (containerId) {
      const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
      if (!container) {
        console.warn(`[W06] Container "${containerId}" không tìm thấy.`);
        return;
      }
      container.innerHTML = this.getHTML();
      this.bindEvents(container);
    },

    /**
     * Trả về chuỗi HTML giao diện dashboard chuẩn PG Home Luxury
     */
    getHTML: function () {
      const d = this.data;
      return `
        <div class="pg-w06-card bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-2xl border border-amber-500/30 max-w-5xl mx-auto font-sans">
          
          <!-- HEADER BANNER -->
          <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/20 shrink-0">
                BP
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    Đang Triển Khai (95%)
                  </span>
                  <span class="text-xs text-slate-400">Mã DA: ${d.metadata.projectId.slice(0, 10)}...</span>
                </div>
                <h2 class="text-2xl font-bold text-white mt-1 tracking-tight">${d.metadata.projectName}</h2>
                <p class="text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></p>
                  ${d.metadata.address} | Khách hàng: <strong class="text-slate-200">${d.metadata.customerName}</strong>
                </p>
              </div>
            </div>
            
            <div class="text-right flex flex-col justify-end">
              <span class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Quy Chuẩn Quản Trị</span>
              <span class="text-sm font-medium text-amber-400 flex items-center justify-end gap-1">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Master SOP 4.0 - PG Home
              </span>
              <span class="text-xs text-slate-500 mt-1">Đối soát hiện trường: ${d.metadata.latestFieldAuditDate}</span>
            </div>
          </div>

          <!-- CẢNH BÁO BẢO VỆ DÒNG TIỀN (RED ALERT - HARD REQUIREMENT) -->
          <div class="mt-6 bg-gradient-to-r from-red-950/80 via-rose-900/60 to-red-950/80 border-2 border-red-500/70 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div class="absolute -right-8 -top-8 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/40">
                <svg class="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <div class="flex-1">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <h4 class="text-base font-bold text-red-300 uppercase tracking-wide flex items-center gap-2">
                    Cảnh Báo Kỷ Luật Dòng Tiền: Thu Hồi Công Nợ Đợt Nghiệm Thu Bàn Giao
                  </h4>
                  <span class="px-2 py-0.5 rounded text-xs font-bold bg-red-500 text-white animate-pulse">
                    CHỐT THU ĐỢT 2: 110.000.000 đ
                  </span>
                </div>
                <p class="text-sm text-red-100/90 mt-1 leading-relaxed">
                  Công trình đã đạt <strong>95% tiến độ thực địa</strong> ngày 06/11/2026. Tuân thủ <em>Hiến pháp Kỷ luật thép & Sổ tay 03</em>: Sale Admin (Hiệp) và Kỹ thuật (Thái) chuẩn bị ngay <strong>Biên bản nghiệm thu kỹ thuật</strong> để Bác Phát ký xác nhận và <strong>thu hồi dứt điểm 110.000.000 đ còn lại (50%)</strong> ngay tại thời điểm bàn giao, không để nợ tồn đọng phát sinh vượt quá 60 phút!
                </p>
              </div>
            </div>
          </div>

          <!-- 4 KPI CARDS -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            
            <!-- KPI 1 -->
            <div class="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
              <span class="text-xs text-slate-400 font-medium">Giá Trị Hợp Đồng</span>
              <div class="mt-2">
                <div class="text-2xl font-extrabold text-white">${d.financials.contractValueFormatted}</div>
                <div class="text-xs text-slate-400 mt-1">Hợp đồng trọn gói nội thất</div>
              </div>
              <div class="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-amber-400 h-full rounded-full w-full"></div>
              </div>
            </div>

            <!-- KPI 2 -->
            <div class="bg-slate-800/70 border border-emerald-500/40 rounded-xl p-4 flex flex-col justify-between">
              <div class="flex justify-between items-center">
                <span class="text-xs text-emerald-400 font-semibold">Đã Tạm Ứng Đợt 1</span>
                <span class="text-xs bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">${d.financials.advancePaymentPhase1RatioFormatted}</span>
              </div>
              <div class="mt-2">
                <div class="text-2xl font-extrabold text-emerald-400">${d.financials.advancePaymentPhase1Formatted}</div>
                <div class="text-xs text-slate-400 mt-1">Đã vào két an toàn PG Home</div>
              </div>
              <div class="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-emerald-500 h-full rounded-full" style="width: 50%;"></div>
              </div>
            </div>

            <!-- KPI 3 -->
            <div class="bg-slate-800/70 border border-sky-500/40 rounded-xl p-4 flex flex-col justify-between">
              <div class="flex justify-between items-center">
                <span class="text-xs text-sky-400 font-semibold">Tiến Độ Thi Công</span>
                <span class="text-xs bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-bold">${d.financials.actualProgressFormatted}</span>
              </div>
              <div class="mt-2">
                <div class="text-2xl font-extrabold text-sky-400">95.0%</div>
                <div class="text-xs text-slate-400 mt-1">Lắp ráp & hoàn thiện thực địa</div>
              </div>
              <div class="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-sky-400 h-full rounded-full" style="width: 95%;"></div>
              </div>
            </div>

            <!-- KPI 4 -->
            <div class="bg-slate-800/70 border border-rose-500/60 rounded-xl p-4 flex flex-col justify-between">
              <div class="flex justify-between items-center">
                <span class="text-xs text-rose-400 font-semibold">Công Nợ Thu Hồi Đợt 2</span>
                <span class="text-xs bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-bold">50.0%</span>
              </div>
              <div class="mt-2">
                <div class="text-2xl font-extrabold text-rose-400">${d.financials.remainingReceivablePhase2Formatted}</div>
                <div class="text-xs text-rose-300/80 mt-1">Quyết toán khi bàn giao</div>
              </div>
              <div class="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div class="bg-rose-500 h-full rounded-full animate-pulse" style="width: 50%;"></div>
              </div>
            </div>

          </div>

          <!-- MAIN DETAILS SECTION: 2 COLUMNS -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            
            <!-- LEFT COLUMN: THÀNH VIÊN DỰ ÁN & TIẾN ĐỘ THỰC ĐỊA (7 cols) -->
            <div class="lg:col-span-7 space-y-6">
              
              <!-- NHẬT KÝ ĐỐI SOÁT HIỆN TRƯỜNG NGÀY 06/11/2026 -->
              <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                <div class="flex items-center justify-between pb-3 border-b border-slate-700">
                  <h3 class="font-bold text-slate-100 flex items-center gap-2">
                    <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Tiến Độ Hiện Trường (Cập Nhật 06/11/2026)
                  </h3>
                  <span class="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-semibold border border-amber-500/30">
                    19 File Ảnh Mới Nhất
                  </span>
                </div>
                <div class="mt-4 space-y-3">
                  <div class="flex items-start gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <div class="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
                    <div class="text-sm">
                      <span class="font-semibold text-slate-200">Hoàn thiện 95% khối lượng đồ gỗ:</span>
                      <p class="text-slate-400 text-xs mt-0.5">Vách ốp nan trang trí MDF Thái Lan chống ẩm cốt xanh, hệ tủ trang trí, đồ gỗ nội thất chính đã lắp dựng xong.</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <div class="w-2.5 h-2.5 rounded-full bg-sky-400 mt-1.5 shrink-0"></div>
                    <div class="text-sm">
                      <span class="font-semibold text-slate-200">Giai đoạn hiện tại:</span>
                      <p class="text-slate-400 text-xs mt-0.5">Kiểm tra phụ kiện ray trượt, bản lề, ron hoàn thiện bề mặt và dọn dẹp vệ sinh trước buổi lễ bàn giao chính thức.</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <div class="w-2.5 h-2.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></div>
                    <div class="text-sm">
                      <span class="font-semibold text-rose-300">Nhiệm vụ trọng tâm kế tiếp:</span>
                      <p class="text-slate-400 text-xs mt-0.5">Hiệp (Sale) và Thái (Kỹ thuật) phối hợp chốt lịch nghiệm thu với Bác Phát và gia đình (Hương, My) để ký biên bản và nhận chuyển khoản 110.000.000 đ.</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- THÀNH VIÊN BAN DỰ ÁN & NHÓM ZALO -->
              <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                <div class="flex items-center justify-between pb-3 border-b border-slate-700">
                  <h3 class="font-bold text-slate-100 flex items-center gap-2">
                    <svg class="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    Thành Viên Tham Gia (Nhóm Zalo 259 Tệp Media)
                  </h3>
                  <span class="text-xs text-slate-400">Zalo Group ID: ...${d.metadata.projectId.slice(-6)}</span>
                </div>
                
                <div class="mt-3 divide-y divide-slate-800">
                  ${d.stakeholders.map(s => `
                    <div class="py-2.5 flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600">
                          <img src="${s.avatar}" alt="${s.name}" class="w-full h-full object-cover" onerror="this.src=''; this.parentElement.innerText='${s.name.slice(0, 2).toUpperCase()}';" />
                        </div>
                        <div>
                          <div class="font-semibold text-sm text-slate-200">${s.name}</div>
                          <div class="text-xs text-slate-400">${s.role}</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <span class="text-xs px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700">
                          ${s.filesShared} tệp
                        </span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

            </div>

            <!-- RIGHT COLUMN: LỊCH SỬ HIỆU CHỈNH BẢN VẼ & HÀNH ĐỘNG (5 cols) -->
            <div class="lg:col-span-5 space-y-6">
              
              <!-- 6 ĐỢT HIỆU CHỈNH BẢN VẼ KỸ THUẬT -->
              <div class="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                <div class="flex items-center justify-between pb-3 border-b border-slate-700">
                  <h3 class="font-bold text-slate-100 flex items-center gap-2">
                    <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    Lịch Sử Bản Vẽ Kỹ Thuật (6 Revisions)
                  </h3>
                  <span class="text-xs text-amber-400 font-semibold">Chốt Ván Thái Lan</span>
                </div>
                
                <div class="mt-4 space-y-2.5 text-xs">
                  ${d.technicalDrawings.map(t => `
                    <div class="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-start gap-2.5">
                      <span class="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono font-bold shrink-0">
                        Rev ${t.rev}
                      </span>
                      <div class="flex-1">
                        <div class="flex items-center justify-between">
                          <span class="font-semibold text-slate-300">Bản vẽ ${t.date} (${t.pages} trang)</span>
                        </div>
                        <p class="text-slate-400 text-xs mt-0.5 leading-snug">${t.note}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- KHỐI HÀNH ĐỘNG DÀNH CHO BAN GIÁM ĐỐC & SALE -->
              <div class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5">
                <h3 class="font-bold text-slate-100 text-sm mb-3">Tác Vụ Nghiệm Thu & Quyết Toán</h3>
                <div class="space-y-2.5">
                  <button id="btn-w06-handover-protocol" class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Tạo Biên Bản Nghiệm Thu (Đợt 2: 110M)
                  </button>

                  <button id="btn-w06-notify-team" class="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-2">
                    <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                    Gửi Lệnh Nhắc Sale (Hiệp) & Kỹ Thuật (Thái)
                  </button>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                  <p class="leading-relaxed">
                    <strong>Thông tin pháp lý:</strong> Hộ Kinh Doanh Phú Gia - Nội Thất & Xây Dựng (MST: 042203002931). Địa chỉ: Ngõ 49 Trương Quốc Dụng, P. Thành Sen, TP. Hà Tĩnh. Hotline: 0986.722.324.
                  </p>
                </div>
              </div>

            </div>

          </div>

          <!-- MODAL / ALERT CONTAINER (ẨN MẶC ĐỊNH) -->
          <div id="w06-action-modal" class="hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
              <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 id="w06-modal-title" class="font-bold text-amber-400 text-lg">Thông Báo Nghiệm Thu</h4>
                <button id="btn-w06-modal-close" class="text-slate-400 hover:text-white">&times;</button>
              </div>
              <div id="w06-modal-body" class="mt-4 text-sm text-slate-300 leading-relaxed"></div>
              <div class="mt-6 flex justify-end">
                <button id="btn-w06-modal-confirm" class="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm">
                  Đã Hiểu & Thực Hiện
                </button>
              </div>
            </div>
          </div>

        </div>
      `;
    },

    /**
     * Bắt các sự kiện click, tương tác giao diện
     */
    bindEvents: function (container) {
      const modal = container.querySelector('#w06-action-modal');
      const modalTitle = container.querySelector('#w06-modal-title');
      const modalBody = container.querySelector('#w06-modal-body');
      const btnClose = container.querySelector('#btn-w06-modal-close');
      const btnConfirm = container.querySelector('#btn-w06-modal-confirm');
      const btnProtocol = container.querySelector('#btn-w06-handover-protocol');
      const btnNotify = container.querySelector('#btn-w06-notify-team');

      const showModal = (title, content) => {
        if (!modal) return;
        modalTitle.innerText = title;
        modalBody.innerHTML = content;
        modal.classList.remove('hidden');
      };

      const hideModal = () => {
        if (modal) modal.classList.add('hidden');
      };

      if (btnClose) btnClose.onclick = hideModal;
      if (btnConfirm) btnConfirm.onclick = hideModal;

      if (btnProtocol) {
        btnProtocol.onclick = () => {
          showModal(
            "Biên Bản Nghiệm Thu & Lệnh Thu Hồi Công Nợ Đợt 2",
            `
              <div class="space-y-3">
                <p><strong>Công trình:</strong> Thiết kế nhà Bác Phát Đường 26/03</p>
                <p><strong>Khách hàng:</strong> Nguyễn Đăng Phát (Bác Phát)</p>
                <p><strong>Khối lượng nghiệm thu:</strong> 95% hoàn thiện tại hiện trường (Vách cốt xanh, hệ nan trang trí, tủ kệ phòng khách - ngủ).</p>
                <div class="p-3 bg-red-950/60 border border-red-500/50 rounded-lg text-red-200">
                  <strong>Số tiền thu hồi đợt 2: 110.000.000 VNĐ</strong><br/>
                  <em>Thời hạn hoàn tất: Ngay khi hai bên ký biên bản bàn giao kỹ thuật.</em>
                </div>
                <p class="text-xs text-slate-400">Đại diện PG Home: Hiệp (Sale) & Thái (Kỹ thuật) phụ trách thu tiền vào tài khoản pháp lý Hộ Kinh Doanh Phú Gia.</p>
              </div>
            `
          );
        };
      }

      if (btnNotify) {
        btnNotify.onclick = () => {
          showModal(
            "Lệnh Điều Phối Đội Ngũ Dự Án Bác Phát",
            `
              <div class="space-y-2 text-sm">
                <p class="text-emerald-400 font-semibold">Đã khởi tạo thông báo nội bộ:</p>
                <ul class="list-disc pl-5 space-y-1 text-slate-300 text-xs">
                  <li><strong>Sale Admin (Hiệp):</strong> Gọi điện Bác Phát, hẹn lịch nghiệm thu chính xác và gửi số tài khoản công nợ đợt 2 (110.000.000 đ).</li>
                  <li><strong>Giám sát hiện trường (Thái):</strong> Rà soát kỹ từng góc vách nan, kiểm tra phụ kiện tay nắm, bản lề, quét dọn sạch bụi gỗ.</li>
                </ul>
              </div>
            `
          );
        };
      }
    }
  };

  // Gán vào window theo yêu cầu hệ thống
  window.PG_Modules_W06 = PG_Modules_W06;

  // Tự động render nếu có thẻ chứa tương ứng
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
      const target = document.getElementById('module-w06-bac-phat-container');
      if (target) {
        PG_Modules_W06.render(target);
      }
    });
  }

})(typeof window !== 'undefined' ? window : this);
