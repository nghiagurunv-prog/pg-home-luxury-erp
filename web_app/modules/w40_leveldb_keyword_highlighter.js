/**
 * PG Home Luxury - Hệ Thống Quản Trị & Giám Sát Dòng Tiền Zalo LevelDB
 * Module: W40 LevelDB Cash-Flow Keyword Auto-Highlighter
 * File: web_app/modules/w40_leveldb_keyword_highlighter.js
 *
 * Nhiệm vụ: Tự động phân tích, quét và tô sáng (Highlighter) các từ khóa nhạy cảm
 * về dòng tiền, công nợ và chuỗi cung ứng trong dữ liệu LevelDB Zalo:
 *   - "chuyển khoản"
 *   - "UNC"
 *   - "công nợ"
 *   - "tạm ứng"
 *   - "phát sinh"
 *   - "giao ván"
 *   - "trả hàng"
 *
 * Tuân thủ Kỷ Luật Thép PG Home: An toàn XSS, không đè vỡ DOM, hỗ trợ Dark/Light Theme.
 */

(function (global) {
  'use strict';

  // 1. Cấu hình danh mục từ khóa nhạy cảm
  var KEYWORD_DEFINITIONS = [
    {
      id: 'ck',
      keyword: 'chuyển khoản',
      aliases: ['chuyen khoan', 'ck', 'chuyển khoản qua', 'đã ck'],
      category: 'DÒNG TIỀN / THANH TOÁN',
      color: '#10b981', // Emerald 500
      bgColor: 'rgba(16, 185, 129, 0.18)',
      borderColor: '#059669',
      badgeText: 'Chuyển Khoản',
      icon: '💸',
      severity: 'HIGH'
    },
    {
      id: 'unc',
      keyword: 'UNC',
      aliases: ['unc', 'ủy nhiệm chi', 'uy nhiem chi'],
      category: 'NGÂN HÀNG / CHỨNG TỪ',
      color: '#06b6d4', // Cyan 500
      bgColor: 'rgba(6, 182, 212, 0.18)',
      borderColor: '#0891b2',
      badgeText: 'Ủy Nhiệm Chi (UNC)',
      icon: '🏦',
      severity: 'CRITICAL'
    },
    {
      id: 'congno',
      keyword: 'công nợ',
      aliases: ['cong no', 'nợ cũ', 'đối soát công nợ', 'chốt nợ'],
      category: 'CÔNG NỢ / PHẢI THU - TRẢ',
      color: '#ef4444', // Red 500
      bgColor: 'rgba(239, 68, 68, 0.20)',
      borderColor: '#dc2626',
      badgeText: 'Công Nợ',
      icon: '⚠️',
      severity: 'CRITICAL'
    },
    {
      id: 'tamung',
      keyword: 'tạm ứng',
      aliases: ['tam ung', 'ứng tiền', 'ứng trước'],
      category: 'TẠM ỨNG / DÒNG TIỀN RA',
      color: '#f59e0b', // Amber 500
      bgColor: 'rgba(245, 158, 11, 0.18)',
      borderColor: '#d97706',
      badgeText: 'Tạm Ứng',
      icon: '⚡',
      severity: 'HIGH'
    },
    {
      id: 'phatsinh',
      keyword: 'phát sinh',
      aliases: ['phat sinh', 'chi phí phát sinh', 'hạng mục phát sinh'],
      category: 'CHI PHÍ / PHÁT SINH CÔNG TRÌNH',
      color: '#8b5cf6', // Violet 500
      bgColor: 'rgba(139, 92, 246, 0.18)',
      borderColor: '#7c3aed',
      badgeText: 'Phát Sinh',
      icon: '📌',
      severity: 'MEDIUM'
    },
    {
      id: 'giaovan',
      keyword: 'giao ván',
      aliases: ['giao van', 'hạ ván', 'nhận ván', 'xe ván'],
      category: 'VẬT TƯ / NHÀ MÁY SẢN XUẤT',
      color: '#3b82f6', // Blue 500
      bgColor: 'rgba(59, 130, 246, 0.18)',
      borderColor: '#2563eb',
      badgeText: 'Giao Ván',
      icon: '🪵',
      severity: 'MEDIUM'
    },
    {
      id: 'trahang',
      keyword: 'trả hàng',
      aliases: ['tra hang', 'thu hồi', 'đổi trả', 'trả ván lỗi'],
      category: 'KHO / ĐỔI TRẢ VẬT TƯ',
      color: '#f97316', // Orange 500
      bgColor: 'rgba(249, 115, 22, 0.18)',
      borderColor: '#ea580c',
      badgeText: 'Trả Hàng',
      icon: '🔄',
      severity: 'HIGH'
    }
  ];

  // 2. Tiện ích xử lý chuỗi & Regex an toàn XSS
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Khởi tạo Regex bắt nhanh toàn bộ các từ khóa & bí danh
  var allPatterns = [];
  var keywordMap = {};

  KEYWORD_DEFINITIONS.forEach(function (def) {
    // Đăng ký từ khóa chính
    var terms = [def.keyword].concat(def.aliases || []);
    terms.forEach(function (term) {
      var escaped = escapeRegex(term);
      allPatterns.push(escaped);
      keywordMap[term.toLowerCase()] = def;
    });
  });

  // Sort từ dài nhất trước để tránh nuốt match
  allPatterns.sort(function (a, b) {
    return b.length - a.length;
  });

  var MASTER_REGEX = new RegExp('(' + allPatterns.join('|') + ')', 'gi');

  // 3. CSS Style nhúng tự động cho giao diện PG Home
  var CSS_STYLES = [
    '/* PG Home - W40 LevelDB Cash-Flow Keyword Highlighter */',
    '.pg-kw-highlight {',
    '  display: inline-block;',
    '  padding: 1px 6px;',
    '  margin: 0 1px;',
    '  border-radius: 4px;',
    '  font-weight: 600;',
    '  font-size: 0.9em;',
    '  border: 1px solid transparent;',
    '  cursor: pointer;',
    '  position: relative;',
    '  transition: all 0.18s ease-in-out;',
    '  text-decoration: none;',
    '}',
    '.pg-kw-highlight:hover {',
    '  transform: translateY(-1px);',
    '  box-shadow: 0 2px 6px rgba(0,0,0,0.25);',
    '}',
    '.pg-kw-ck { background: rgba(16, 185, 129, 0.18); color: #10b981; border-color: #059669; }',
    '.pg-kw-unc { background: rgba(6, 182, 212, 0.18); color: #06b6d4; border-color: #0891b2; font-weight: 700; }',
    '.pg-kw-congno { background: rgba(239, 68, 68, 0.20); color: #ef4444; border-color: #dc2626; animation: pg-pulse-red 2.5s infinite; }',
    '.pg-kw-tamung { background: rgba(245, 158, 11, 0.18); color: #f59e0b; border-color: #d97706; }',
    '.pg-kw-phatsinh { background: rgba(139, 92, 246, 0.18); color: #8b5cf6; border-color: #7c3aed; }',
    '.pg-kw-giaovan { background: rgba(59, 130, 246, 0.18); color: #3b82f6; border-color: #2563eb; }',
    '.pg-kw-trahang { background: rgba(249, 115, 22, 0.18); color: #f97316; border-color: #ea580c; }',
    '@keyframes pg-pulse-red {',
    '  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }',
    '  50% { box-shadow: 0 0 0 4px rgba(239, 68, 68, 0); }',
    '}',
    '.pg-kw-badge {',
    '  display: inline-flex;',
    '  align-items: center;',
    '  gap: 4px;',
    '  font-size: 0.75rem;',
    '  padding: 2px 8px;',
    '  border-radius: 9999px;',
    '  font-weight: 700;',
    '  margin: 2px;',
    '}'
  ].join('\n');

  function injectStyles() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('pg-w40-highlighter-styles')) return;
    var style = document.createElement('style');
    style.id = 'pg-w40-highlighter-styles';
    style.type = 'text/css';
    style.appendChild(document.createTextNode(CSS_STYLES));
    document.head.appendChild(style);
  }

  // 4. Hàm tìm thông tin định nghĩa của từ khóa
  function getDefinition(matchedText) {
    if (!matchedText) return null;
    var lower = matchedText.toLowerCase();
    if (keywordMap[lower]) return keywordMap[lower];

    // Fallback tìm tương đối
    for (var i = 0; i < KEYWORD_DEFINITIONS.length; i++) {
      var d = KEYWORD_DEFINITIONS[i];
      if (d.keyword.toLowerCase() === lower) return d;
      if (d.aliases) {
        for (var j = 0; j < d.aliases.length; j++) {
          if (d.aliases[j].toLowerCase() === lower) return d;
        }
      }
    }
    return null;
  }

  // 5. Hàm tô sáng văn bản (String -> HTML String an toàn)
  function highlightText(rawText, options) {
    if (rawText === null || rawText === undefined) return '';
    var text = String(rawText);
    var opts = options || {};
    var enableTooltips = opts.tooltips !== false;

    // Reset regex index
    MASTER_REGEX.lastIndex = 0;

    var parts = [];
    var lastIdx = 0;
    var match;

    while ((match = MASTER_REGEX.exec(text)) !== null) {
      var matchStart = match.index;
      var matchEnd = MASTER_REGEX.lastIndex;
      var matchedStr = match[0];

      // Đẩy phần text thường trước match (escaped)
      if (matchStart > lastIdx) {
        parts.push(escapeHtml(text.slice(lastIdx, matchStart)));
      }

      var def = getDefinition(matchedStr);
      var cls = def ? 'pg-kw-' + def.id : 'pg-kw-highlight';
      var category = def ? def.category : 'DÒNG TIỀN';
      var badge = def ? def.badgeText : matchedStr;
      var icon = def ? def.icon : '🔍';

      var tooltipAttr = enableTooltips
        ? ' title="' + escapeHtml(icon + ' [' + category + '] ' + badge) + '"'
        : '';
      var dataAttr = ' data-keyword="' + escapeHtml(matchedStr) + '" data-cat="' + escapeHtml(category) + '"';

      parts.push(
        '<mark class="pg-kw-highlight ' + cls + '"' + tooltipAttr + dataAttr + '>' +
        escapeHtml(matchedStr) +
        '</mark>'
      );

      lastIdx = matchEnd;
    }

    // Đẩy phần còn lại
    if (lastIdx < text.length) {
      parts.push(escapeHtml(text.slice(lastIdx)));
    }

    return parts.join('');
  }

  // 6. Hàm trích xuất các từ khóa xuất hiện trong chuỗi (Statistics & Match Report)
  function detectKeywords(rawText) {
    if (!rawText) return { total: 0, matches: [], counts: {} };
    var text = String(rawText);
    MASTER_REGEX.lastIndex = 0;

    var matches = [];
    var counts = {};
    var match;

    while ((match = MASTER_REGEX.exec(text)) !== null) {
      var matchedStr = match[0];
      var def = getDefinition(matchedStr);
      var keyId = def ? def.id : matchedStr.toLowerCase();

      counts[keyId] = (counts[keyId] || 0) + 1;
      matches.push({
        text: matchedStr,
        index: match.index,
        definition: def || null,
        category: def ? def.category : 'DÒNG TIỀN'
      });
    }

    return {
      total: matches.length,
      matches: matches,
      counts: counts
    };
  }

  // 7. Hàm quét và tô sáng cấu trúc dữ liệu JSON LevelDB Zalo
  //    (như zalo_leveldb_intel.json, log snippets, feed records)
  function scanIntel(intelData) {
    var summary = {
      timestamp: new Date().toISOString(),
      matchedKeywordsTotal: 0,
      breakdown: {},
      sensitiveAlerts: []
    };

    KEYWORD_DEFINITIONS.forEach(function (def) {
      summary.breakdown[def.id] = {
        keyword: def.keyword,
        category: def.category,
        severity: def.severity,
        occurrences: 0,
        foundIn: []
      };
    });

    function recursiveScan(item, path) {
      if (item === null || item === undefined) return;

      if (typeof item === 'string') {
        var res = detectKeywords(item);
        if (res.total > 0) {
          summary.matchedKeywordsTotal += res.total;
          res.matches.forEach(function (m) {
            var defId = m.definition ? m.definition.id : null;
            if (defId && summary.breakdown[defId]) {
              summary.breakdown[defId].occurrences++;
              if (summary.breakdown[defId].foundIn.indexOf(path) === -1) {
                summary.breakdown[defId].foundIn.push(path);
              }
            }
            summary.sensitiveAlerts.push({
              path: path,
              keyword: m.text,
              category: m.category,
              snippet: item.length > 120 ? item.substring(0, 120) + '...' : item
            });
          });
        }
      } else if (Array.isArray(item)) {
        item.forEach(function (sub, idx) {
          recursiveScan(sub, path + '[' + idx + ']');
        });
      } else if (typeof item === 'object') {
        Object.keys(item).forEach(function (k) {
          recursiveScan(item[k], path ? path + '.' + k : k);
        });
      }
    }

    recursiveScan(intelData, 'root');
    return summary;
  }

  // 8. Hàm tạo HTML Badges tóm tắt số lượng từ khóa phát hiện
  function renderSummaryBadges(countsMap) {
    var counts = countsMap || {};
    var badges = [];

    KEYWORD_DEFINITIONS.forEach(function (def) {
      var c = counts[def.id] || counts[def.keyword] || 0;
      if (c > 0) {
        badges.push(
          '<span class="pg-kw-badge pg-kw-' + def.id + '">' +
          def.icon + ' ' + def.badgeText + ': <strong>' + c + '</strong>' +
          '</span>'
        );
      }
    });

    if (badges.length === 0) {
      return '<span style="color:#64748b; font-size:0.8rem; font-style:italic;">Không có từ khóa nhạy cảm</span>';
    }
    return badges.join(' ');
  }

  // 9. Hàm áp dụng Highlighter cho 1 DOM Element an toàn (không phá vỡ DOM cây)
  function highlightDomElement(rootElement, options) {
    if (typeof document === 'undefined' || !rootElement) return 0;
    injectStyles();

    var walker = document.createTreeWalker(
      rootElement,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          if (!node || !node.nodeValue) return NodeFilter.FILTER_REJECT;
          var parent = node.parentNode;
          if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || parent.classList.contains('pg-kw-highlight'))) {
            return NodeFilter.FILTER_REJECT;
          }
          MASTER_REGEX.lastIndex = 0;
          return MASTER_REGEX.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
        }
      },
      false
    );

    var nodesToReplace = [];
    var currentNode;
    while ((currentNode = walker.nextNode())) {
      nodesToReplace.push(currentNode);
    }

    var replacedCount = 0;
    nodesToReplace.forEach(function (textNode) {
      var raw = textNode.nodeValue;
      var html = highlightText(raw, options);
      if (html !== escapeHtml(raw)) {
        var span = document.createElement('span');
        span.className = 'pg-kw-container';
        span.innerHTML = html;
        if (textNode.parentNode) {
          textNode.parentNode.replaceChild(span, textNode);
          replacedCount++;
        }
      }
    });

    return replacedCount;
  }

  // 10. Self-Test chẩn đoán & nghiệm thu
  function selfTest() {
    var testSample = [
      'Hôm nay anh Nghĩa đã chuyển khoản đặt cọc 20 triệu.',
      'Kế toán gửi gấp UNC ngân hàng cho bên An Cường.',
      'Yêu cầu rà soát công nợ thợ và nhà cung cấp tuần này.',
      'Anh Hòa xin tạm ứng 3.000.000 đ tiền công lắp đặt.',
      'Phát sinh thêm 2 tủ đầu giường bo cong phòng ngủ master.',
      'NCC Quốc Tâm báo chiều nay giao ván MDF chống ẩm qua xưởng.',
      'Xưởng làm thủ tục trả hàng 3 tấm ván xước bề mặt cho nhà xe.'
    ].join(' | ');

    var detected = detectKeywords(testSample);
    var highlightedHtml = highlightText(testSample);

    var requiredKeywords = [
      'chuyển khoản',
      'UNC',
      'công nợ',
      'tạm ứng',
      'phát sinh',
      'giao ván',
      'trả hàng'
    ];

    var passedAll = true;
    var checkReport = {};

    requiredKeywords.forEach(function (kw) {
      var found = detected.matches.some(function (m) {
        return m.text.toLowerCase() === kw.toLowerCase();
      });
      checkReport[kw] = found ? 'PASS' : 'FAIL';
      if (!found) passedAll = false;
    });

    return {
      status: passedAll ? 'ALL_PASSED' : 'SOME_FAILED',
      totalMatches: detected.total,
      checks: checkReport,
      sampleHighlightedPreview: highlightedHtml
    };
  }

  // Xuất Module ra đối tượng toàn cục
  var ModuleExports = {
    version: '1.0.0-w40',
    name: 'W40 LevelDB Cash-Flow Keyword Auto-Highlighter',
    keywords: KEYWORD_DEFINITIONS,
    highlightText: highlightText,
    detectKeywords: detectKeywords,
    scanIntel: scanIntel,
    highlightDomElement: highlightDomElement,
    renderSummaryBadges: renderSummaryBadges,
    injectStyles: injectStyles,
    getCssStyles: function () { return CSS_STYLES; },
    selfTest: selfTest
  };

  if (typeof window !== 'undefined') {
    window.PG_Modules_W40 = ModuleExports;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModuleExports;
  }

  if (typeof global !== 'undefined' && !global.PG_Modules_W40) {
    global.PG_Modules_W40 = ModuleExports;
  }

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
