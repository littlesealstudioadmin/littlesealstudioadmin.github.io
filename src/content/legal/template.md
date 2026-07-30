---
draft: true # 이 파일은 템플릿입니다. 복사한 뒤 false 로 바꿔야 발행됩니다.
project: template # URL 경로가 됩니다 — /privacy/template, /terms/template. projects-config 의 id 와 맞추세요.
appName: 앱 이름
eyebrow: APP NAME · 앱 이름 # 헤더 카드 위에 작게 표시. 생략하면 appName 이 쓰입니다.
kind: privacy # privacy(개인정보처리방침) 또는 terms(이용약관)
summary: 헤더 카드와 검색엔진 설명에 쓰이는 한두 문장 요약.
updatedAt: 2026년 1월 1일
---

새 프로젝트의 법적 문서를 만들려면:

1. 이 파일을 `<프로젝트id>-privacy.md`, `<프로젝트id>-terms.md` 로 복사한다.
2. frontmatter 를 채우고 `draft` 를 지우거나 `false` 로 바꾼다.
3. 본문을 마크다운으로 작성한다. 섹션 제목은 `## 1. 제목` 형식을 쓴다.

문의 이메일은 site-config.json 에서 자동으로 붙으므로 본문에 적지 않아도 됩니다.
같은 프로젝트에 privacy 와 terms 가 둘 다 있으면 페이지 상단에서 서로 링크됩니다.

**주의: 스토어 심사에 제출한 URL 은 project 값을 바꾸면 깨집니다.**
