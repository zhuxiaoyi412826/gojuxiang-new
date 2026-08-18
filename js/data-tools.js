// =============================================
// 数据与图表工具 (Data & Chart Tools)
// =============================================

const DataTools = {
  // ---------------------------------------------
  // 1. Excel/CSV 格式互转与预览
  // ---------------------------------------------
  'excel-csv-convert': {
    parsedData: { headers: [], rows: [] },
    currentWorkbook: null,
    
    render() {
      return `
        <div class="tool-section">
          <div class="tool-section-title">1. 输入或导入数据 (支持 Excel [.xlsx, .xls], CSV, TSV, JSON, 多行文本)</div>
          <div class="tool-controls" style="margin-bottom: 0.75rem;">
            <div class="tool-control-group">
              <label>分隔符:</label>
              <select id="csvDelimiter" onchange="DataTools['excel-csv-convert'].parseInput()">
                <option value="auto">自动识别</option>
                <option value=",">逗号 (,)</option>
                <option value="\t">Tab 制表符 (\t)</option>
                <option value=";">分号 (;)</option>
                <option value="|">竖线 (|)</option>
              </select>
            </div>
            <div class="tool-control-group">
              <label>首行为表头:</label>
              <input type="checkbox" id="csvHasHeader" checked onchange="DataTools['excel-csv-convert'].parseInput()">
            </div>
            <button class="tool-btn secondary" onclick="DataTools['excel-csv-convert'].loadSample()">加载示例数据</button>
            <button class="tool-btn secondary" onclick="DataTools['excel-csv-convert'].clearAll()">清空</button>
          </div>

          <div class="file-drop-zone" id="csvDropZone" 
               onclick="document.getElementById('csvFileInput').click()"
               ondragover="event.preventDefault(); this.classList.add('drag-over');"
               ondragleave="this.classList.remove('drag-over');"
               ondrop="DataTools['excel-csv-convert'].handleDrop(event)">
            <input type="file" id="csvFileInput" accept=".xlsx,.xls,.csv,.tsv,.json,.txt" style="display:none" onchange="DataTools['excel-csv-convert'].handleFileSelect(event)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:32px;height:32px;color:var(--text-tertiary);margin-bottom:0.5rem;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <div>点击上传文件，或将 <strong>Excel (.xlsx, .xls)</strong> / CSV / TSV / JSON 文件拖拽至此处</div>
            <div style="font-size:0.75rem;color:var(--text-tertiary);margin-top:0.25rem;">支持格式: .xlsx, .xls, .csv, .tsv, .json, .txt</div>
          </div>

          <div id="excelSheetContainer" style="display:none;margin-top:0.75rem;align-items:center;gap:0.5rem;" class="tool-control-group">
            <label style="font-weight:600;color:var(--accent);">切换 Excel 工作表 (Sheet):</label>
            <select id="excelSheetSelect" onchange="DataTools['excel-csv-convert'].switchExcelSheet(this.value)" style="padding:0.35rem 0.6rem;border-radius:6px;border:1px solid var(--border-color);background:var(--bg-secondary);color:var(--text-primary);"></select>
          </div>

          <textarea id="csvInputText" class="tool-textarea" style="height: 140px; margin-top:0.75rem; font-family:var(--font-mono);" placeholder="在此粘贴 CSV、TSV 或 JSON 数组数据..." oninput="DataTools['excel-csv-convert'].parseInput()"></textarea>
        </div>

        <div class="tool-section" id="csvOutputSection">
          <div class="tool-section-title" style="display:flex;justify-content:space-between;align-items:center;">
            <span>2. 解析结果与多格式导出</span>
            <div id="csvStatsBadge" style="font-size:0.8rem;font-weight:normal;color:var(--text-tertiary);">尚未解析</div>
          </div>

          <div class="tool-tabs" id="csvResultTabs">
            <button class="tool-tab active" onclick="DataTools['excel-csv-convert'].switchTab('preview', this)">📊 表格预览</button>
            <button class="tool-tab" onclick="DataTools['excel-csv-convert'].switchTab('xlsx', this)">📗 Excel (.xlsx) 格式</button>
            <button class="tool-tab" onclick="DataTools['excel-csv-convert'].switchTab('csv', this)">📄 CSV 格式</button>
            <button class="tool-tab" onclick="DataTools['excel-csv-convert'].switchTab('json', this)">🧩 JSON 格式</button>
            <button class="tool-tab" onclick="DataTools['excel-csv-convert'].switchTab('html', this)">🌐 HTML 表格代码</button>
            <button class="tool-tab" onclick="DataTools['excel-csv-convert'].switchTab('markdown', this)">📝 Markdown 表格</button>
          </div>

          <div id="csvTabPreview" class="csv-tab-panel">
            <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;align-items:center;flex-wrap:wrap;">
              <input type="text" id="csvSearchFilter" class="tool-input" placeholder="搜索表格内容..." style="width:220px;" oninput="DataTools['excel-csv-convert'].filterTable()">
              <button class="tool-btn secondary" onclick="DataTools['excel-csv-convert'].cleanTrim()">修剪两端空格</button>
              <button class="tool-btn secondary" onclick="DataTools['excel-csv-convert'].cleanDeduplicate()">去除重复行</button>
              <button class="tool-btn secondary" onclick="DataTools['excel-csv-convert'].cleanEmptyRows()">过滤空行</button>
            </div>
            <div style="overflow-x:auto;max-height:380px;border:1px solid var(--border-color);border-radius:8px;" id="csvTableContainer">
              <div style="padding:2rem;text-align:center;color:var(--text-tertiary);">暂无表格数据，请在上方输入或上传</div>
            </div>
          </div>

          <div id="csvTabXlsx" class="csv-tab-panel" style="display:none;">
            <div class="tool-controls" style="margin-bottom:0.75rem;">
              <button class="tool-btn primary" onclick="DataTools['excel-csv-convert'].downloadFile('xlsx')">导出 Excel (.xlsx) 文件</button>
            </div>
            <div style="padding:1.25rem;background:var(--bg-secondary);border-radius:8px;border:1px solid var(--border-color);color:var(--text-secondary);font-size:0.88rem;line-height:1.6;">
              💡 导出说明：点击“导出 Excel (.xlsx) 文件”按钮，即可将当前解析整理好的表格数据保存为标准的 <strong>Microsoft Excel (.xlsx)</strong> 文件。
            </div>
          </div>

          <div id="csvTabCsv" class="csv-tab-panel" style="display:none;">
            <div class="tool-controls" style="margin-bottom:0.5rem;">
              <button class="tool-btn primary" onclick="DataTools['excel-csv-convert'].downloadFile('csv')">导出 CSV 文件</button>
              <button class="tool-btn secondary" onclick="copyText(document.getElementById('csvOutputText').value)">复制 CSV 内容</button>
            </div>
            <textarea id="csvOutputText" class="tool-textarea" readonly style="height:220px;font-family:var(--font-mono);"></textarea>
          </div>

          <div id="csvTabJson" class="csv-tab-panel" style="display:none;">
            <div class="tool-controls" style="margin-bottom:0.5rem;">
              <button class="tool-btn primary" onclick="DataTools['excel-csv-convert'].downloadFile('json')">导出 JSON 文件</button>
              <button class="tool-btn secondary" onclick="copyText(document.getElementById('jsonOutputText').value)">复制 JSON 内容</button>
            </div>
            <textarea id="jsonOutputText" class="tool-textarea" readonly style="height:220px;font-family:var(--font-mono);"></textarea>
          </div>

          <div id="csvTabHtml" class="csv-tab-panel" style="display:none;">
            <div class="tool-controls" style="margin-bottom:0.5rem;">
              <button class="tool-btn primary" onclick="DataTools['excel-csv-convert'].downloadFile('html')">导出 HTML 文件</button>
              <button class="tool-btn secondary" onclick="copyText(document.getElementById('htmlOutputText').value)">复制 HTML 代码</button>
            </div>
            <textarea id="htmlOutputText" class="tool-textarea" readonly style="height:220px;font-family:var(--font-mono);"></textarea>
          </div>

          <div id="csvTabMarkdown" class="csv-tab-panel" style="display:none;">
            <div class="tool-controls" style="margin-bottom:0.5rem;">
              <button class="tool-btn secondary" onclick="copyText(document.getElementById('mdOutputText').value)">复制 Markdown 代码</button>
            </div>
            <textarea id="mdOutputText" class="tool-textarea" readonly style="height:220px;font-family:var(--font-mono);"></textarea>
          </div>
        </div>
      `;
    },

    loadSample() {
      const sample = `姓名,部门,月度销售额,达成率,状态
张伟,华东销售部,125000,115%,优秀
李娜,华北销售部,98000,98%,合格
王强,华南销售部,142000,128%,优秀
赵敏,西南事业部,86000,86%,待提升
陈杰,华东销售部,110000,105%,优秀`;
      const sheetContainer = document.getElementById('excelSheetContainer');
      if (sheetContainer) sheetContainer.style.display = 'none';
      this.currentWorkbook = null;
      document.getElementById('csvInputText').value = sample;
      this.parseInput();
    },

    clearAll() {
      document.getElementById('csvInputText').value = '';
      const sheetContainer = document.getElementById('excelSheetContainer');
      if (sheetContainer) sheetContainer.style.display = 'none';
      this.currentWorkbook = null;
      this.parsedData = { headers: [], rows: [] };
      this.renderOutputs();
    },

    handleFileSelect(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.processFile(file);
      e.target.value = '';
    },

    handleDrop(e) {
      e.preventDefault();
      const zone = document.getElementById('csvDropZone');
      if (zone) zone.classList.remove('drag-over');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        this.processFile(e.dataTransfer.files[0]);
      }
    },

    processFile(file) {
      const fileName = file.name.toLowerCase();
      const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

      if (isExcel) {
        if (typeof XLSX === 'undefined') {
          showToast('Excel 解析库未完成加载，请刷新页面后重试', 'error');
          return;
        }
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            this.currentWorkbook = workbook;

            const sheetContainer = document.getElementById('excelSheetContainer');
            const sheetSelect = document.getElementById('excelSheetSelect');
            if (sheetContainer && sheetSelect) {
              if (workbook.SheetNames.length > 1) {
                sheetSelect.innerHTML = workbook.SheetNames.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('');
                sheetContainer.style.display = 'flex';
              } else {
                sheetContainer.style.display = 'none';
              }
            }

            const firstSheetName = workbook.SheetNames[0];
            this.loadWorkbookSheet(firstSheetName);
            showToast(`成功解析 Excel 文件: ${file.name}`, 'success');
          } catch (err) {
            showToast('Excel 文件解析失败：' + err.message, 'error');
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        const sheetContainer = document.getElementById('excelSheetContainer');
        if (sheetContainer) sheetContainer.style.display = 'none';
        this.currentWorkbook = null;

        const reader = new FileReader();
        reader.onload = (evt) => {
          document.getElementById('csvInputText').value = evt.target.result;
          this.parseInput();
          showToast(`成功解析文件: ${file.name}`, 'success');
        };
        reader.readAsText(file);
      }
    },

    switchExcelSheet(sheetName) {
      if (!this.currentWorkbook) return;
      this.loadWorkbookSheet(sheetName);
    },

    loadWorkbookSheet(sheetName) {
      if (!this.currentWorkbook || !this.currentWorkbook.Sheets[sheetName]) return;
      const sheet = this.currentWorkbook.Sheets[sheetName];
      const rawSheetData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

      if (!rawSheetData || rawSheetData.length === 0) {
        document.getElementById('csvInputText').value = '';
        this.parsedData = { headers: [], rows: [] };
        this.renderOutputs();
        return;
      }

      const csvLines = rawSheetData.map(row => {
        return row.map(cell => {
          const str = cell !== undefined && cell !== null ? String(cell) : '';
          return str.includes(',') || str.includes('\n') || str.includes('"')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        }).join(',');
      });

      document.getElementById('csvInputText').value = csvLines.join('\n');
      this.parseInput();
    },

    parseInput() {
      const text = document.getElementById('csvInputText').value.trim();
      if (!text) {
        this.parsedData = { headers: [], rows: [] };
        this.renderOutputs();
        return;
      }

      // 尝试是否为 JSON 格式
      if (text.startsWith('[') && text.endsWith(']')) {
        try {
          const jsonArr = JSON.parse(text);
          if (Array.isArray(jsonArr) && jsonArr.length > 0) {
            if (typeof jsonArr[0] === 'object' && !Array.isArray(jsonArr[0])) {
              const headers = Object.keys(jsonArr[0]);
              const rows = jsonArr.map(item => headers.map(h => item[h] !== undefined ? String(item[h]) : ''));
              this.parsedData = { headers, rows };
              this.renderOutputs();
              return;
            } else if (Array.isArray(jsonArr[0])) {
              const hasHeader = document.getElementById('csvHasHeader').checked;
              let headers = [];
              let rows = [];
              if (hasHeader) {
                headers = jsonArr[0].map(v => String(v));
                rows = jsonArr.slice(1).map(r => r.map(v => String(v)));
              } else {
                headers = jsonArr[0].map((_, i) => `列 ${i + 1}`);
                rows = jsonArr.map(r => r.map(v => String(v)));
              }
              this.parsedData = { headers, rows };
              this.renderOutputs();
              return;
            }
          }
        } catch (err) {
          // 不是合法 JSON，继续尝试按 delimiter 解析
        }
      }

      // 按行切割分隔符
      let delimiter = document.getElementById('csvDelimiter').value;
      if (delimiter === 'auto') {
        if (text.includes('\t')) delimiter = '\t';
        else if (text.includes(';')) delimiter = ';';
        else if (text.includes('|')) delimiter = '|';
        else delimiter = ',';
      }

      const rawLines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      if (rawLines.length === 0) {
        this.parsedData = { headers: [], rows: [] };
        this.renderOutputs();
        return;
      }

      const parseCsvLine = (line) => {
        const result = [];
        let cur = '';
        let inQuote = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"' || char === "'") {
            inQuote = !inQuote;
          } else if (char === delimiter && !inQuote) {
            result.push(cur.trim());
            cur = '';
          } else {
            cur += char;
          }
        }
        result.push(cur.trim());
        return result;
      };

      const parsedLines = rawLines.map(parseCsvLine);
      const hasHeader = document.getElementById('csvHasHeader').checked;

      let headers = [];
      let rows = [];

      if (hasHeader && parsedLines.length > 0) {
        headers = parsedLines[0];
        rows = parsedLines.slice(1);
      } else {
        const maxCols = Math.max(...parsedLines.map(l => l.length));
        headers = Array.from({ length: maxCols }, (_, i) => `列 ${i + 1}`);
        rows = parsedLines;
      }

      this.parsedData = { headers, rows };
      this.renderOutputs();
    },

    cleanTrim() {
      this.parsedData.headers = this.parsedData.headers.map(h => h.trim());
      this.parsedData.rows = this.parsedData.rows.map(row => row.map(cell => cell.trim()));
      this.renderOutputs();
    },

    cleanDeduplicate() {
      const seen = new Set();
      const uniqueRows = [];
      this.parsedData.rows.forEach(row => {
        const key = row.join('___');
        if (!seen.has(key)) {
          seen.add(key);
          uniqueRows.push(row);
        }
      });
      this.parsedData.rows = uniqueRows;
      this.renderOutputs();
    },

    cleanEmptyRows() {
      this.parsedData.rows = this.parsedData.rows.filter(row => row.some(cell => cell.trim() !== ''));
      this.renderOutputs();
    },

    filterTable() {
      this.renderOutputs(false);
    },

    renderOutputs(updateCodeTexts = true) {
      const { headers, rows } = this.parsedData;
      const statsBadge = document.getElementById('csvStatsBadge');
      if (statsBadge) {
        statsBadge.textContent = `共 ${headers.length} 列，${rows.length} 行数据`;
      }

      // 表格预览
      const tableContainer = document.getElementById('csvTableContainer');
      const searchVal = (document.getElementById('csvSearchFilter')?.value || '').toLowerCase().trim();

      if (tableContainer) {
        if (headers.length === 0 && rows.length === 0) {
          tableContainer.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--text-tertiary);">暂无表格数据，请在上方输入或上传</div>`;
        } else {
          let filteredRows = rows;
          if (searchVal) {
            filteredRows = rows.filter(r => r.some(cell => cell.toLowerCase().includes(searchVal)));
          }

          let html = `<table class="csv-preview-table"><thead><tr><th style="width:50px;">#</th>`;
          headers.forEach(h => {
            html += `<th>${escapeHtml(h)}</th>`;
          });
          html += `</tr></thead><tbody>`;

          if (filteredRows.length === 0) {
            html += `<tr><td colspan="${headers.length + 1}" style="text-align:center;color:var(--text-tertiary);padding:1.5rem;">没有匹配到符合条件的数据行</td></tr>`;
          } else {
            filteredRows.forEach((row, idx) => {
              html += `<tr><td style="color:var(--text-tertiary);font-size:0.75rem;font-weight:600;">${idx + 1}</td>`;
              headers.forEach((_, colIdx) => {
                html += `<td>${escapeHtml(row[colIdx] || '')}</td>`;
              });
              html += `</tr>`;
            });
          }

          html += `</tbody></table>`;
          tableContainer.innerHTML = html;
        }
      }

      if (!updateCodeTexts) return;

      // 生成各种导出的文本
      // CSV Text
      let csvStr = headers.join(',') + '\n';
      rows.forEach(r => {
        csvStr += r.map(c => c.includes(',') ? `"${c.replace(/"/g, '""')}"` : c).join(',') + '\n';
      });
      const csvOut = document.getElementById('csvOutputText');
      if (csvOut) csvOut.value = csvStr.trim();

      // JSON Array
      const jsonArr = rows.map(r => {
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = r[i] !== undefined ? r[i] : '';
        });
        return obj;
      });
      const jsonOut = document.getElementById('jsonOutputText');
      if (jsonOut) jsonOut.value = JSON.stringify(jsonArr, null, 2);

      // HTML Table Code
      let htmlCode = `<table border="1" cellspacing="0" cellpadding="6">\n  <thead>\n    <tr>\n`;
      headers.forEach(h => { htmlCode += `      <th>${escapeHtml(h)}</th>\n`; });
      htmlCode += `    </tr>\n  </thead>\n  <tbody>\n`;
      rows.forEach(r => {
        htmlCode += `    <tr>\n`;
        headers.forEach((_, i) => {
          htmlCode += `      <td>${escapeHtml(r[i] || '')}</td>\n`;
        });
        htmlCode += `    </tr>\n`;
      });
      htmlCode += `  </tbody>\n</table>`;
      const htmlOut = document.getElementById('htmlOutputText');
      if (htmlOut) htmlOut.value = htmlCode;

      // Markdown Table
      let mdCode = `| ${headers.join(' | ')} |\n`;
      mdCode += `| ${headers.map(() => '---').join(' | ')} |\n`;
      rows.forEach(r => {
        mdCode += `| ${headers.map((_, i) => (r[i] || '').replace(/\|/g, '\\|')).join(' | ')} |\n`;
      });
      const mdOut = document.getElementById('mdOutputText');
      if (mdOut) mdOut.value = mdCode.trim();
    },

    switchTab(tabName, btnEl) {
      document.querySelectorAll('#csvResultTabs .tool-tab').forEach(b => b.classList.remove('active'));
      btnEl.classList.add('active');

      document.querySelectorAll('.csv-tab-panel').forEach(p => p.style.display = 'none');
      if (tabName === 'preview') document.getElementById('csvTabPreview').style.display = 'block';
      if (tabName === 'xlsx') document.getElementById('csvTabXlsx').style.display = 'block';
      if (tabName === 'csv') document.getElementById('csvTabCsv').style.display = 'block';
      if (tabName === 'json') document.getElementById('csvTabJson').style.display = 'block';
      if (tabName === 'html') document.getElementById('csvTabHtml').style.display = 'block';
      if (tabName === 'markdown') document.getElementById('csvTabMarkdown').style.display = 'block';
    },

    downloadFile(type) {
      const timestamp = new Date().toISOString().slice(0,10);
      if (type === 'csv') {
        const text = document.getElementById('csvOutputText').value;
        downloadFile(text, `data_export_${timestamp}.csv`, 'text/csv;charset=utf-8;');
      } else if (type === 'json') {
        const text = document.getElementById('jsonOutputText').value;
        downloadFile(text, `data_export_${timestamp}.json`, 'application/json;');
      } else if (type === 'html') {
        const text = document.getElementById('htmlOutputText').value;
        downloadFile(text, `data_export_${timestamp}.html`, 'text/html;');
      } else if (type === 'xlsx') {
        if (typeof XLSX === 'undefined') {
          showToast('Excel 导出支持未就绪，请重试', 'error');
          return;
        }
        if (!this.parsedData.headers || this.parsedData.headers.length === 0) {
          showToast('暂无数据可供导出', 'error');
          return;
        }
        const wsData = [this.parsedData.headers, ...this.parsedData.rows];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `data_export_${timestamp}.xlsx`);
        showToast('已成功导出 Excel (.xlsx) 文件', 'success');
      }
    }
  },

  // ---------------------------------------------
  // 2. Mermaid 流程图/架构图预览
  // ---------------------------------------------
  'mermaid-preview': {
    render() {
      return `
        <div class="mermaid-tool-container">
          <!-- 快捷模板选择与配置 -->
          <div class="tool-controls" style="margin-bottom:0.75rem;flex-wrap:wrap;gap:0.75rem;">
            <div class="tool-control-group">
              <label>预设图表模板:</label>
              <select id="mermaidPreset" onchange="DataTools['mermaid-preview'].loadPreset(this.value)">
                <option value="flowchart">流程图 (Flowchart)</option>
                <option value="sequence">时序图 (Sequence Diagram)</option>
                <option value="gantt">甘特图 (Gantt Chart)</option>
                <option value="state">状态图 (State Diagram)</option>
                <option value="class">类图 (Class Diagram)</option>
                <option value="er">实体关系图 (ER Diagram)</option>
                <option value="pie">饼图 (Pie Chart)</option>
              </select>
            </div>
            <div class="tool-control-group">
              <label>图表主题:</label>
              <select id="mermaidTheme" onchange="DataTools['mermaid-preview'].renderDiagram()">
                <option value="default">默认 (Default)</option>
                <option value="dark">暗黑 (Dark)</option>
                <option value="neutral">中性 (Neutral)</option>
                <option value="forest">清新绿 (Forest)</option>
              </select>
            </div>
            <button class="tool-btn primary" onclick="DataTools['mermaid-preview'].renderDiagram()">重新渲染</button>
            <button class="tool-btn secondary" onclick="DataTools['mermaid-preview'].exportSvg()">导出 SVG</button>
            <button class="tool-btn secondary" onclick="DataTools['mermaid-preview'].copySvgCode()">复制 SVG 代码</button>
          </div>

          <!-- 双栏布局：左文本源码，右实时图表 -->
          <div class="mermaid-split-layout">
            <div class="mermaid-editor-pane">
              <div class="mermaid-pane-header">Mermaid 代码编辑</div>
              <textarea id="mermaidInput" class="tool-textarea" style="height:420px;font-family:var(--font-mono);font-size:0.88rem;line-height:1.45;" oninput="DataTools['mermaid-preview'].debouncedRender()"></textarea>
            </div>

            <div class="mermaid-preview-pane">
              <div class="mermaid-pane-header" style="display:flex;justify-content:space-between;align-items:center;">
                <span>渲染视图预览</span>
                <div style="display:flex;gap:0.35rem;align-items:center;">
                  <button class="tool-btn secondary" style="padding:0.2rem 0.5rem;font-size:0.75rem;" onclick="DataTools['mermaid-preview'].zoom(1.2)">🔍+</button>
                  <button class="tool-btn secondary" style="padding:0.2rem 0.5rem;font-size:0.75rem;" onclick="DataTools['mermaid-preview'].zoom(0.8)">🔍-</button>
                  <button class="tool-btn secondary" style="padding:0.2rem 0.5rem;font-size:0.75rem;" onclick="DataTools['mermaid-preview'].resetZoom()">100%</button>
                </div>
              </div>
              <div id="mermaidRenderViewport" class="mermaid-viewport">
                <div id="mermaidTargetContainer" style="transform-origin: top left; transition: transform 0.2s ease;"></div>
              </div>
              <div id="mermaidErrorBox" class="mermaid-error-box" style="display:none;"></div>
            </div>
          </div>
        </div>
      `;
    },

    zoomLevel: 1,

    zoom(factor) {
      this.zoomLevel *= factor;
      const target = document.getElementById('mermaidTargetContainer');
      if (target) target.style.transform = `scale(${this.zoomLevel})`;
    },

    resetZoom() {
      this.zoomLevel = 1;
      const target = document.getElementById('mermaidTargetContainer');
      if (target) target.style.transform = `scale(1)`;
    },

    presets: {
      flowchart: `graph TD
    A[开始] --> B{是否已登录?}
    B -- 是 --> C[加载用户Dashboard]
    B -- 否 --> D[跳转登录页]
    D --> E[输入账号密码]
    E --> F{验证是否正确?}
    F -- 成功 --> C
    F -- 失败 --> G[提示密码错误]
    G --> D
    C --> H[结束]`,

      sequence: `sequenceDiagram
    autonumber
    actor User as 用户
    participant Client as 客户端App
    participant Auth as 认证服务器
    participant DB as 数据库

    User->>Client: 点击登录按钮
    Client->>Auth: POST /api/login (用户名/密码)
    Auth->>DB: 查询用户信息
    DB-->>Auth: 返回加密密码哈希
    Auth->>Auth: 校验 Hash 匹配
    Auth-->>Client: 返回 JWT Token
    Client-->>User: 登录成功，显示首页`,

      gantt: `gantt
    title 在线工具箱 V2.0 项目实施进度图
    dateFormat  YYYY-MM-DD
    section 需求与架构
    技术选型 & 概念设计   :a1, 2026-08-01, 3d
    UI 框架与主题设定     :a2, after a1, 4d
    section 核心开发
    数据与图表模块        :2026-08-08, 5d
    CSS 样式生成器        :2026-08-11, 4d
    section 测试与发布
    功能测试与 Bug 修复   :2026-08-15, 3d
    正式部署上线          :2026-08-18, 1d`,

      state: `stateDiagram-v2
    [*] --> 待付款
    待付款 --> 已取消: 超时未支付 / 用户取消
    待付款 --> 已支付: 完成付款
    已支付 --> 待发货: 商家确认订单
    待发货 --> 运输中: 快递揽收包裹
    运输中 --> 已签收: 买家签收
    已签收 --> 已完成: 确认收货
    已完成 --> [*]`,

      class: `classDiagram
    class User {
      +String userId
      +String name
      +String email
      +login() Boolean
      +logout() Void
    }
    class Order {
      +String orderId
      +Double amount
      +Date createTime
      +pay() Boolean
    }
    User "1" --> "*" Order : 创建`,

      er: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    PRODUCT ||--o{ LINE-ITEM : "ordered in"
    CUSTOMER {
        string id
        string name
        string email
    }
    ORDER {
        string id
        string orderDate
    }
    PRODUCT {
        string id
        string name
        double price
    }`,

      pie: `pie title 用户常用编程语言占比调查
    "TypeScript / JS" : 42.5
    "Python" : 28.0
    "Java" : 12.5
    "Go" : 9.0
    "Rust / C++" : 8.0`
    },

    timer: null,

    debouncedRender() {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => this.renderDiagram(), 300);
    },

    loadPreset(key) {
      const code = this.presets[key] || this.presets.flowchart;
      document.getElementById('mermaidInput').value = code;
      this.renderDiagram();
    },

    async ensureMermaidLoaded() {
      if (window.mermaid) return true;
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
        script.onload = () => {
          if (window.mermaid) {
            window.mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' });
          }
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.head.appendChild(script);
      });
    },

    async renderDiagram() {
      const code = (document.getElementById('mermaidInput')?.value || '').trim();
      const container = document.getElementById('mermaidTargetContainer');
      const errBox = document.getElementById('mermaidErrorBox');

      if (!container) return;

      if (!code) {
        container.innerHTML = '<div style="padding:3rem;text-align:center;color:var(--text-tertiary);">请输入 Mermaid 语法代码</div>';
        if (errBox) errBox.style.display = 'none';
        return;
      }

      // 如果尚未加载默认初次赋值
      if (!document.getElementById('mermaidInput').value) {
        document.getElementById('mermaidInput').value = this.presets.flowchart;
      }

      const theme = document.getElementById('mermaidTheme')?.value || 'default';

      const loaded = await this.ensureMermaidLoaded();
      if (!loaded || !window.mermaid) {
        // Fallback: 如果网络打不开 CDN，提供提示
        if (errBox) {
          errBox.style.display = 'block';
          errBox.textContent = '未能加载 CDN 渲染引擎，请检查网络后重试。';
        }
        return;
      }

      try {
        if (errBox) errBox.style.display = 'none';
        window.mermaid.initialize({
          startOnLoad: false,
          theme: theme,
          securityLevel: 'loose'
        });

        const id = 'mermaid-svg-' + Date.now();
        const { svg } = await window.mermaid.render(id, code);
        container.innerHTML = svg;
      } catch (err) {
        if (errBox) {
          errBox.style.display = 'block';
          errBox.textContent = 'Mermaid 语法错误:\n' + (err.message || String(err));
        }
      }
    },

    exportSvg() {
      const container = document.getElementById('mermaidTargetContainer');
      const svgEl = container?.querySelector('svg');
      if (!svgEl) {
        alert('暂无渲染完成的 SVG 图像');
        return;
      }
      const svgData = new XMLSerializer().serializeToString(svgEl);
      downloadFile(svgData, `mermaid_diagram_${Date.now()}.svg`, 'image/svg+xml;charset=utf-8;');
    },

    copySvgCode() {
      const container = document.getElementById('mermaidTargetContainer');
      const svgEl = container?.querySelector('svg');
      if (!svgEl) {
        alert('暂无渲染完成的 SVG 图像');
        return;
      }
      const svgData = new XMLSerializer().serializeToString(svgEl);
      copyText(svgData);
    }
  },

  // ---------------------------------------------
  // 3. 数据对比与差值分析
  // ---------------------------------------------
  'data-diff-analyzer': {
    render() {
      return `
        <div class="tool-section">
          <div class="tool-controls" style="margin-bottom:0.75rem;">
            <div class="tool-control-group">
              <label>分析模式:</label>
              <select id="diffMode" onchange="DataTools['data-diff-analyzer'].analyze()">
                <option value="set">1. 集合与元素比对 (交集/并集/差集/重复项)</option>
                <option value="numeric">2. 数值列表比对 (各项差值与变化率 %)</option>
                <option value="line">3. 逐行与文本变化列表比对</option>
              </select>
            </div>
            <button class="tool-btn secondary" onclick="DataTools['data-diff-analyzer'].loadSample()">加载示例数据</button>
            <button class="tool-btn secondary" onclick="DataTools['data-diff-analyzer'].swapInputs()">交换 A 与 B</button>
            <button class="tool-btn secondary" onclick="DataTools['data-diff-analyzer'].clearAll()">清空</button>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;" class="diff-input-grid">
            <div>
              <label style="font-size:0.88rem;font-weight:600;margin-bottom:0.35rem;display:block;color:var(--text-primary);">数据源 A (基准):</label>
              <textarea id="diffInputA" class="tool-textarea" style="height:160px;font-family:var(--font-mono);" placeholder="每行一个元素，或数值列表..." oninput="DataTools['data-diff-analyzer'].analyze()"></textarea>
            </div>
            <div>
              <label style="font-size:0.88rem;font-weight:600;margin-bottom:0.35rem;display:block;color:var(--text-primary);">数据源 B (对比):</label>
              <textarea id="diffInputB" class="tool-textarea" style="height:160px;font-family:var(--font-mono);" placeholder="每行一个元素，或数值列表..." oninput="DataTools['data-diff-analyzer'].analyze()"></textarea>
            </div>
          </div>
        </div>

        <div class="tool-section" id="diffResultSection">
          <div class="tool-section-title">分析结果与统计指标</div>
          <div id="diffSummaryCards" class="diff-summary-cards">
            <div class="diff-stat-card"><div class="stat-num" id="statCountA">0</div><div class="stat-label">数据 A 总数</div></div>
            <div class="diff-stat-card"><div class="stat-num" id="statCountB">0</div><div class="stat-label">数据 B 总数</div></div>
            <div class="diff-stat-card"><div class="stat-num" id="statIntersection">0</div><div class="stat-label">共有交集项</div></div>
            <div class="diff-stat-card"><div class="stat-num" id="statSimilarity">0%</div><div class="stat-label">相似度 (Jaccard)</div></div>
          </div>

          <div id="diffResultContainer" style="margin-top:1rem;">
            <!-- 动态分析内容 -->
          </div>
        </div>
      `;
    },

    loadSample() {
      const mode = document.getElementById('diffMode').value;
      if (mode === 'numeric') {
        document.getElementById('diffInputA').value = `1200\n1850\n2400\n3100\n1900\n4200`;
        document.getElementById('diffInputB').value = `1350\n1700\n2800\n3100\n2150\n3900`;
      } else {
        document.getElementById('diffInputA').value = `苹果\n香蕉\n葡萄\n西瓜\n芒果\n水蜜桃`;
        document.getElementById('diffInputB').value = `香蕉\n西瓜\n荔枝\n芒果\n车厘子\n猕猴桃`;
      }
      this.analyze();
    },

    swapInputs() {
      const a = document.getElementById('diffInputA').value;
      const b = document.getElementById('diffInputB').value;
      document.getElementById('diffInputA').value = b;
      document.getElementById('diffInputB').value = a;
      this.analyze();
    },

    clearAll() {
      document.getElementById('diffInputA').value = '';
      document.getElementById('diffInputB').value = '';
      this.analyze();
    },

    analyze() {
      const textA = (document.getElementById('diffInputA')?.value || '').trim();
      const textB = (document.getElementById('diffInputB')?.value || '').trim();
      const mode = document.getElementById('diffMode')?.value || 'set';

      const linesA = textA ? textA.split(/\r?\n/).map(s => s.trim()).filter(Boolean) : [];
      const linesB = textB ? textB.split(/\r?\n/).map(s => s.trim()).filter(Boolean) : [];

      const setA = new Set(linesA);
      const setB = new Set(linesB);

      const intersection = [...setA].filter(x => setB.has(x));
      const union = new Set([...setA, ...setB]);
      const similarity = union.size > 0 ? ((intersection.length / union.size) * 100).toFixed(1) : '0';

      document.getElementById('statCountA').textContent = linesA.length;
      document.getElementById('statCountB').textContent = linesB.length;
      document.getElementById('statIntersection').textContent = intersection.length;
      document.getElementById('statSimilarity').textContent = similarity + '%';

      const resContainer = document.getElementById('diffResultContainer');
      if (!resContainer) return;

      if (linesA.length === 0 && linesB.length === 0) {
        resContainer.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--text-tertiary);">在上方输入数据进行对比分析</div>`;
        return;
      }

      if (mode === 'set') {
        const onlyA = [...setA].filter(x => !setB.has(x));
        const onlyB = [...setB].filter(x => !setA.has(x));

        resContainer.innerHTML = `
          <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:1rem;" class="set-diff-grid">
            <div class="set-diff-box">
              <div class="set-box-title" style="color:var(--accent);">仅 A 独有 (A - B) : ${onlyA.length} 项</div>
              <textarea class="tool-textarea" readonly style="height:180px;font-family:var(--font-mono);font-size:0.85rem;">${onlyA.join('\n')}</textarea>
              <button class="tool-btn secondary" style="margin-top:0.35rem;width:100%;" onclick="copyText('${onlyA.join('\\n')}')">复制独有项</button>
            </div>

            <div class="set-diff-box">
              <div class="set-box-title" style="color:#10b981;">A 与 B 共有交集 (A ∩ B) : ${intersection.length} 项</div>
              <textarea class="tool-textarea" readonly style="height:180px;font-family:var(--font-mono);font-size:0.85rem;">${intersection.join('\n')}</textarea>
              <button class="tool-btn secondary" style="margin-top:0.35rem;width:100%;" onclick="copyText('${intersection.join('\\n')}')">复制共有项</button>
            </div>

            <div class="set-diff-box">
              <div class="set-box-title" style="color:#ef4444;">仅 B 独有 (B - A) : ${onlyB.length} 项</div>
              <textarea class="tool-textarea" readonly style="height:180px;font-family:var(--font-mono);font-size:0.85rem;">${onlyB.join('\n')}</textarea>
              <button class="tool-btn secondary" style="margin-top:0.35rem;width:100%;" onclick="copyText('${onlyB.join('\\n')}')">复制独有项</button>
            </div>
          </div>
        `;
      } else if (mode === 'numeric') {
        const numsA = linesA.map(v => parseFloat(v)).filter(v => !isNaN(v));
        const numsB = linesB.map(v => parseFloat(v)).filter(v => !isNaN(v));

        const maxLen = Math.max(numsA.length, numsB.length);
        let rowsHtml = '';
        let sumA = 0, sumB = 0;

        for (let i = 0; i < maxLen; i++) {
          const valA = numsA[i];
          const valB = numsB[i];
          const hasA = valA !== undefined;
          const hasB = valB !== undefined;

          if (hasA) sumA += valA;
          if (hasB) sumB += valB;

          let diffStr = '-';
          let percentStr = '-';
          let diffClass = '';

          if (hasA && hasB) {
            const diff = valB - valA;
            diffStr = (diff > 0 ? '+' : '') + diff.toFixed(2);
            if (valA !== 0) {
              const pct = ((diff / Math.abs(valA)) * 100).toFixed(1);
              percentStr = (pct > 0 ? '+' : '') + pct + '%';
            }
            if (diff > 0) diffClass = 'style="color:#10b981;font-weight:600;"';
            else if (diff < 0) diffClass = 'style="color:#ef4444;font-weight:600;"';
          }

          rowsHtml += `
            <tr>
              <td>${i + 1}</td>
              <td>${hasA ? valA : '<span style="color:var(--text-tertiary);">-</span>'}</td>
              <td>${hasB ? valB : '<span style="color:var(--text-tertiary);">-</span>'}</td>
              <td ${diffClass}>${diffStr}</td>
              <td ${diffClass}>${percentStr}</td>
            </tr>
          `;
        }

        const totalDiff = sumB - sumA;
        const totalPct = sumA !== 0 ? (((totalDiff) / Math.abs(sumA)) * 100).toFixed(1) + '%' : '-';

        resContainer.innerHTML = `
          <div style="overflow-x:auto;">
            <table class="csv-preview-table">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>基准值 A</th>
                  <th>对比值 B</th>
                  <th>数值变化 (B - A)</th>
                  <th>变化百分比</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
                <tr style="font-weight:bold;background:var(--bg-secondary);">
                  <td>合计汇总</td>
                  <td>${sumA.toFixed(2)}</td>
                  <td>${sumB.toFixed(2)}</td>
                  <td style="color:${totalDiff >= 0 ? '#10b981' : '#ef4444'};">${(totalDiff >= 0 ? '+' : '') + totalDiff.toFixed(2)}</td>
                  <td style="color:${totalDiff >= 0 ? '#10b981' : '#ef4444'};">${(parseFloat(totalPct) >= 0 ? '+' : '') + totalPct}</td>
                </tr>
              </tbody>
            </table>
          </div>
        `;
      } else if (mode === 'line') {
        const maxLen = Math.max(linesA.length, linesB.length);
        let html = '<div style="display:flex;flex-direction:column;gap:0.4rem;">';

        for (let i = 0; i < maxLen; i++) {
          const a = linesA[i];
          const b = linesB[i];

          if (a === b) {
            html += `
              <div class="line-diff-row same">
                <span class="line-num">${i + 1}</span>
                <span class="line-tag tag-same">相同</span>
                <span class="line-text">${escapeHtml(a)}</span>
              </div>
            `;
          } else if (a !== undefined && b !== undefined) {
            html += `
              <div class="line-diff-row mod">
                <span class="line-num">${i + 1}</span>
                <span class="line-tag tag-mod">修改</span>
                <div class="line-text-diff">
                  <div class="text-del">- ${escapeHtml(a)}</div>
                  <div class="text-add">+ ${escapeHtml(b)}</div>
                </div>
              </div>
            `;
          } else if (a !== undefined && b === undefined) {
            html += `
              <div class="line-diff-row del">
                <span class="line-num">${i + 1}</span>
                <span class="line-tag tag-del">删除</span>
                <span class="line-text">- ${escapeHtml(a)}</span>
              </div>
            `;
          } else {
            html += `
              <div class="line-diff-row add">
                <span class="line-num">${i + 1}</span>
                <span class="line-tag tag-add">新增</span>
                <span class="line-text">+ ${escapeHtml(b)}</span>
              </div>
            `;
          }
        }

        html += '</div>';
        resContainer.innerHTML = html;
      }
    }
  }
};
