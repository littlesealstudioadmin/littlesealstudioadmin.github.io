// Pagefind UI Development Mock
// This file is served during 'npm run dev' to prevent 404 console errors and simulate a working search UI.
// During 'npm run build', this file is copied to 'dist/' but then overwritten by the actual Pagefind CLI indexer.

class MockPagefindModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        .modal-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(2px);
          z-index: 99999;
          justify-content: center;
          align-items: flex-start;
          padding-top: 15vh;
          font-family: 'Pretendard', sans-serif;
          box-sizing: border-box;
        }
        .modal-overlay.active {
          display: flex;
        }
        .modal-content {
          background: #ffffff;
          color: #000000;
          border: 2px solid #000000;
          width: 90%;
          max-width: 600px;
          padding: 24px;
          box-shadow: 8px 8px 0px #000000;
          border-radius: 0px;
          position: relative;
          box-sizing: border-box;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #000000;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .modal-title {
          font-size: 14px;
          font-weight: 700;
          font-family: monospace;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .close-btn {
          background: transparent;
          border: 1px solid #000000;
          cursor: pointer;
          font-family: monospace;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: bold;
          border-radius: 0px;
          transition: all 0.15s ease;
        }
        .close-btn:hover {
          background: #000000;
          color: #ffffff;
        }
        .search-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #000000;
          border-radius: 0px;
          font-size: 16px;
          box-sizing: border-box;
          outline: none;
          font-family: 'Pretendard', sans-serif;
          background: #fafafa;
        }
        .search-input:focus {
          background: #ffffff;
          box-shadow: 3px 3px 0px #000000;
        }
        .dev-notice {
          margin-top: 8px;
          font-size: 11px;
          color: #666666;
          font-family: monospace;
          text-align: right;
        }
        .results-container {
          margin-top: 18px;
          max-height: 280px;
          overflow-y: auto;
          box-sizing: border-box;
        }
        .result-item {
          padding: 12px;
          border: 1px solid #000000;
          margin-bottom: 8px;
          display: block;
          text-decoration: none;
          color: inherit;
          background: #ffffff;
          transition: all 0.15s ease;
          box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.15);
        }
        .result-item:hover {
          background: #f5f5f5;
          box-shadow: 4px 4px 0px #000000;
          transform: translate(-1px, -1px);
        }
        .result-title {
          font-weight: 700;
          color: #000000;
          font-size: 14px;
          font-family: 'Pretendard', sans-serif;
        }
        .result-snippet {
          font-size: 12px;
          color: #333333;
          margin-top: 6px;
          line-height: 1.5;
        }
      </style>
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <span class="modal-title">통합 검색</span>
            <button class="close-btn">닫기</button>
          </div>
          <input type="text" class="search-input" placeholder="검색어를 입력하세요 (Manifesto, 브루탈리스트, ERP 등)..." />
          <div class="results-container"></div>
        </div>
      </div>
    `;

    this.overlay = this.shadowRoot.querySelector('.modal-overlay');
    this.closeBtn = this.shadowRoot.querySelector('.close-btn');
    this.input = this.shadowRoot.querySelector('.search-input');
    this.resultsContainer = this.shadowRoot.querySelector('.results-container');

    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    this.input.addEventListener('input', (e) => this.handleSearch(e.target.value));

    // Listen for Escape key
    this._onKeyDown = (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    };
    document.addEventListener('keydown', this._onKeyDown);
  }

  disconnectedCallback() {
    if (this._onKeyDown) {
      document.removeEventListener('keydown', this._onKeyDown);
    }
  }

  open() {
    this.isOpen = true;
    this.overlay.classList.add('active');
    setTimeout(() => this.input.focus(), 50);
  }

  close() {
    this.isOpen = false;
    this.overlay.classList.remove('active');
    this.input.value = '';
    this.resultsContainer.innerHTML = '';
  }

  handleSearch(query) {
    if (!query.trim()) {
      this.resultsContainer.innerHTML = '';
      return;
    }

    const mockData = [
      {
        title: "The Little Seal Studio Manifesto: Digital Architecture & Tactile UI (리틀실스튜디오 선언문)",
        url: "/blog/littleseal-manifesto",
        snippet: "리틀실스튜디오의 철학: 공공 전산망 수준의 견고한 기술 안정성 위에 최상의 디테일을 더하는 비즈니스 파트너..."
      },
      {
        title: "Building Monochromatic User Interfaces with Astro 6 and Tailwind v4 (브루탈리스트 UI 가이드)",
        url: "/blog/astro-6-brutalist",
        snippet: "전자정부프레임워크를 넘어 Astro 6와 Tailwind v4를 결합하여 설계하는 0px 둥글기 극단적 브루탈리스트 모던 웹..."
      },
      {
        title: "Nofilter.space Broadsheet Project (노필터 스페이스 프로젝트)",
        url: "/projects/nofilter",
        snippet: "신문 인쇄물 질감의 고대비 흑백 브루탈리스트 그리드로 구현한 디지털 에디토리얼 퍼블리싱 플랫폼 케이스 스터디..."
      },
      {
        title: "Tactile Text Editor Project (타이포그래피 텍스트 에디터)",
        url: "/projects/tactile",
        snippet: "타이포그래피 중심의 산만함이 완전히 배제된 리치 웹 텍스트 쓰기 도구 제작 내역..."
      },
      {
        title: "Orbit Interaction Engine Project (오빗 인터랙션 엔진)",
        url: "/projects/orbit",
        snippet: "고성능 물리 연산 기반의 마이크로 인터랙션 구현 라이브러리 및 사이드 프로젝트 내역..."
      }
    ];

    const filtered = mockData.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) || 
      item.snippet.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      this.resultsContainer.innerHTML = '<div style="padding: 16px 12px; font-size: 13px; color: #666; text-align: center; border: 1px dashed #000;">일치하는 검색 결과가 없습니다.</div>';
      return;
    }

    this.resultsContainer.innerHTML = filtered.map(item => `
      <a href="${item.url}" class="result-item">
        <div class="result-title">${item.title}</div>
        <div class="result-snippet">${item.snippet}</div>
      </a>
    `).join('');
  }
}

if (!customElements.get("pagefind-modal")) {
  customElements.define("pagefind-modal", MockPagefindModal);
}
