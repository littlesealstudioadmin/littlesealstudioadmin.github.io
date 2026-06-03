"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  RiFileTextLine, 
  RiFolderAddLine, 
  RiClipboardLine, 
  RiDownload2Line, 
  RiAddLine, 
  RiDeleteBinLine, 
  RiBookOpenLine,
  RiHammerLine,
  RiLockLine,
  RiLogoutBoxRLine,
  RiKeyLine,
  RiEyeLine
} from "@remixicon/react";

export default function CmsDashboard() {
  // --- 로그인 상태 관리 ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"blog" | "project">("blog");
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // --- 블로그 포스트 데이터 ---
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogCategory, setBlogCategory] = useState("engineering");
  const [blogTags, setBlogTags] = useState("Spring Boot, Oracle, Database");
  const [blogDate, setBlogDate] = useState("");
  const [blogBody, setBlogBody] = useState("");

  // --- 프로젝트 데이터 ---
  const [projectId, setProjectId] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectCategory, setProjectCategory] = useState("web");
  const [projectDate, setProjectDate] = useState("");
  const [projectStartDate, setProjectStartDate] = useState("");
  const [projectEndDate, setProjectEndDate] = useState("");
  const [projectInProgress, setProjectInProgress] = useState(false);
  const [projectTags, setProjectTags] = useState("Spring, MyBatis, Web");
  const [projectIntroduction, setProjectIntroduction] = useState("");
  
  // 동적 프로젝트 입력 항목들
  const [projectLinks, setProjectLinks] = useState<{ label: string; url: string }[]>([
    { label: "github", url: "https://github.com/" }
  ]);
  const [projectCapabilities, setProjectCapabilities] = useState<string[]>([
    "대용량 트랜잭션의 안정적인 처리 및 트랜잭션 격리수준 설정",
  ]);
  const [projectArchitecture, setProjectArchitecture] = useState<string[]>([
    "전자정부프레임워크(eGovFrame) 기반의 안정적인 인프라 설계",
  ]);

  // 오늘 날짜로 기본 세팅
  useEffect(() => {
    const today = format(new Date(), "dd-MM-yyyy");
    setBlogDate(today);
    setProjectDate(today);

    // 기본 시작/종료 연월
    setProjectStartDate(format(new Date(), "yyyy.MM"));
    setProjectEndDate(format(new Date(), "yyyy.MM"));

    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("admin_authenticated");
      if (auth === "true") {
        setIsLoggedIn(true);
      }
    }
  }, []);

  // --- 날짜/연월 포맷 변환기 ---
  // 내부 서식(DD-MM-YYYY)을 브라우저 달력 입력용(YYYY-MM-DD)으로 변환
  const toInputDate = (str: string) => {
    if (!str) return "";
    const parts = str.split("-");
    if (parts.length !== 3) return "";
    const [dd, mm, yyyy] = parts;
    return `${yyyy}-${mm}-${dd}`;
  };

  // 브라우저 달력 입력용(YYYY-MM-DD)을 내부 저장 서식(DD-MM-YYYY)으로 변환
  const fromInputDate = (str: string) => {
    if (!str) return "";
    const parts = str.split("-");
    if (parts.length !== 3) return "";
    const [yyyy, mm, dd] = parts;
    return `${dd}-${mm}-${yyyy}`;
  };

  // 내부 서식(YYYY.MM)을 브라우저 연월 입력용(YYYY-MM)으로 변환
  const toInputMonth = (str: string) => {
    if (!str) return "";
    return str.replace(".", "-");
  };

  // 브라우저 연월 입력용(YYYY-MM)을 내부 저장 서식(YYYY.MM)으로 변환
  const fromInputMonth = (str: string) => {
    if (!str) return "";
    return str.replace("-", ".");
  };

  // 한글 제목 입력 시 영어 주소명(Slug) 자동 변경
  const handleBlogTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setBlogTitle(title);
    
    // 간이 슬러그 변환
    const cleanSlug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9가-힣\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 50);
    setBlogSlug(cleanSlug);
  };

  const triggerCopyNotice = (msg: string) => {
    setCopySuccess(msg);
    setTimeout(() => setCopySuccess(null), 3000);
  };

  // --- 블로그 파일 마크다운 생성기 ---
  const getBlogMarkdown = () => {
    const tagsArray = blogTags.split(",").map(t => t.trim()).filter(Boolean);
    const tagsStr = JSON.stringify(tagsArray);
    
    return `---
draft: false
date: "${blogDate}"
title: "${blogTitle || "여기에 제목이 들어갑니다"}"
description: "${blogDescription || "여기에 한 줄 소개글이 들어갑니다."}"
category: "${blogCategory}"
tags: ${tagsStr}
author: "Little Seal Studio"
---

${blogBody || "여기에 본문 글을 마크다운 형식으로 편하게 작성해 보세요!"}
`;
  };

  const downloadBlogFile = () => {
    const md = getBlogMarkdown();
    const filename = `${blogSlug || "blog-post"}.md`;
    const element = document.createElement("a");
    const file = new Blob([md], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyBlogMarkdown = () => {
    navigator.clipboard.writeText(getBlogMarkdown());
    triggerCopyNotice("블로그 내용이 복사되었습니다!");
  };

  // --- 프로젝트 JSON 생성기 ---
  const getProjectJson = () => {
    const tagsArray = projectTags.split(",").map(t => t.trim()).filter(Boolean);
    
    const obj = {
      id: projectId || "my-new-project",
      data: {
        date: projectDate,
        startDate: projectStartDate || format(new Date(), "yyyy.MM"),
        endDate: projectInProgress ? "진행 중" : (projectEndDate || format(new Date(), "yyyy.MM")),
        inProgress: projectInProgress,
        category: projectCategory,
        title: projectTitle || "프로젝트 제목 입력",
        description: projectDescription || "한 줄 소개글 입력",
        tags: tagsArray,
        status: "production"
      },
      introduction: projectIntroduction || "상세 소개글을 입력하세요.",
      links: projectLinks.filter(l => l.label && l.url),
      video: null,
      brief: {
        capabilities: projectCapabilities.filter(Boolean),
        architecture: projectArchitecture.filter(Boolean)
      }
    };
    
    return JSON.stringify(obj, null, 2);
  };

  const downloadProjectFile = () => {
    const json = getProjectJson();
    const filename = `${projectId || "project"}.json`;
    const element = document.createElement("a");
    const file = new Blob([json], { type: "application/json;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyProjectJson = () => {
    navigator.clipboard.writeText(getProjectJson());
    triggerCopyNotice("프로젝트 데이터가 복사되었습니다!");
  };

  // --- 리스트 동적 제어 ---
  const addLink = () => setProjectLinks([...projectLinks, { label: "", url: "" }]);
  const removeLink = (index: number) => setProjectLinks(projectLinks.filter((_, i) => i !== index));
  const updateLink = (index: number, key: "label" | "url", val: string) => {
    const updated = [...projectLinks];
    updated[index][key] = val;
    setProjectLinks(updated);
  };

  const addCapability = () => setProjectCapabilities([...projectCapabilities, ""]);
  const removeCapability = (index: number) => setProjectCapabilities(projectCapabilities.filter((_, i) => i !== index));
  const updateCapability = (index: number, val: string) => {
    const updated = [...projectCapabilities];
    updated[index] = val;
    setProjectCapabilities(updated);
  };

  const addArchitecture = () => setProjectArchitecture([...projectArchitecture, ""]);
  const removeArchitecture = (index: number) => setProjectArchitecture(projectArchitecture.filter((_, i) => i !== index));
  const updateArchitecture = (index: number, val: string) => {
    const updated = [...projectArchitecture];
    updated[index] = val;
    setProjectArchitecture(updated);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      setIsLoggedIn(true);
      setAuthError("");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("admin_authenticated", "true");
      }
    } else {
      setAuthError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("admin_authenticated");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto my-12 border border-foreground bg-background p-6 font-sans">
        <div className="border-b border-foreground pb-4 mb-6 text-center">
          <RiLockLine className="size-8 mx-auto mb-2 text-foreground" />
          <h1 className="text-xl font-serif tracking-tight text-foreground uppercase">
            리틀실스튜디오 / 관리자 로그인
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-mono">
            콘텐츠 작성 시스템에 접근하려면 로그인이 필요합니다.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">아이디</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-foreground bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="아이디 입력"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-foreground bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="비밀번호 입력"
              required
            />
          </div>

          {authError && (
            <p className="text-xs text-destructive font-mono border border-destructive/30 bg-destructive/5 p-2.5">
              ⚠️ {authError}
            </p>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 border border-foreground bg-foreground text-background py-2.5 hover:bg-background hover:text-foreground font-medium text-sm transition-all duration-200 cursor-pointer"
          >
            <RiKeyLine className="size-4" />
            <span>로그인</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="border border-foreground bg-background p-6 font-sans">
      {/* 헤더 */}
      <div className="border-b border-foreground pb-6 mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-foreground uppercase">
            리틀실스튜디오 / 콘텐츠 작성 시스템
          </h1>
          <p className="text-sm text-muted-foreground mt-2 font-mono">
            정적 사이트 저작 도구 — 블로그 글과 프로젝트 정보를 간편하게 작성하고 관리합니다.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 border border-foreground bg-background hover:bg-foreground hover:text-background px-3 py-1.5 text-xs font-medium transition-all duration-200 font-mono self-end sm:self-start shrink-0 cursor-pointer"
        >
          <RiLogoutBoxRLine className="size-3.5" />
          <span>로그아웃</span>
        </button>
      </div>

      {/* 탭 전환 버튼 */}
      <div className="flex border border-foreground mb-6 select-none bg-muted/20">
        <button
          onClick={() => setActiveTab("blog")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-r border-foreground transition-all duration-150 cursor-pointer ${
            activeTab === "blog"
              ? "bg-foreground text-background"
              : "hover:bg-muted text-foreground"
          }`}
        >
          <RiFileTextLine className="size-4" />
          <span>📰 블로그 포스트 작성</span>
        </button>
        <button
          onClick={() => setActiveTab("project")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-150 cursor-pointer ${
            activeTab === "project"
              ? "bg-foreground text-background"
              : "hover:bg-muted text-foreground"
          }`}
        >
          <RiFolderAddLine className="size-4" />
          <span>🛠️ 프로젝트 등록</span>
        </button>
      </div>

      {/* 에디터 폼 영역 */}
      <div className="w-full">
        <div className="border border-foreground p-6 bg-muted/5">
          <h2 className="text-lg font-serif border-b border-foreground pb-2 mb-6 flex items-center gap-2">
            {activeTab === "blog" ? <RiBookOpenLine className="size-5" /> : <RiHammerLine className="size-5" />}
            <span>콘텐츠 작성란</span>
          </h2>

          {activeTab === "blog" ? (
            // --- 블로그 포스트 입력 폼 ---
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">포스트 제목</label>
                <input
                  type="text"
                  value={blogTitle}
                  onChange={handleBlogTitleChange}
                  placeholder="예: Spring MVC에서 Astro + React 모던 웹으로의 전환기"
                  className="w-full border border-foreground bg-background px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                    인터넷 주소 식별자 (영어 슬러그)
                  </label>
                  <input
                    type="text"
                    value={blogSlug}
                    onChange={(e) => setBlogSlug(e.target.value)}
                    placeholder="예: mvc-to-astro-transition"
                    className="w-full border border-foreground bg-background px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                    작성일 선택
                  </label>
                  <input
                    type="date"
                    value={toInputDate(blogDate)}
                    onChange={(e) => setBlogDate(fromInputDate(e.target.value))}
                    className="w-full border border-foreground bg-background px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">카테고리</label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full border border-foreground bg-background px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-foreground"
                  >
                    <option value="engineering">기술/엔지니어링 (engineering)</option>
                    <option value="workflow">개발 워크플로우 (workflow)</option>
                    <option value="strategy">비즈니스 전략 (strategy)</option>
                    <option value="devlog">개발 일지 (devlog)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                    태그 (쉼표로 구분하여 입력)
                  </label>
                  <input
                    type="text"
                    value={blogTags}
                    onChange={(e) => setBlogTags(e.target.value)}
                    placeholder="Spring, Astro, Database"
                    className="w-full border border-foreground bg-background px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                  
                  {/* 태그 실시간 시각화 */}
                  <div className="flex flex-wrap gap-1.5 mt-2 min-h-[22px]">
                    {blogTags.split(",").map(t => t.trim()).filter(Boolean).map((t, i) => (
                      <span key={i} className="text-[10px] font-mono border border-foreground/30 px-2 py-0.5 bg-muted/10 text-muted-foreground">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">한 줄 요약</label>
                <input
                  type="text"
                  value={blogDescription}
                  onChange={(e) => setBlogDescription(e.target.value)}
                  placeholder="블로그 목록에 노출될 간략한 요약글을 입력해 주세요."
                  className="w-full border border-foreground bg-background px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  본문 내용 (마크다운 형식 지원)
                </label>
                <textarea
                  rows={15}
                  value={blogBody}
                  onChange={(e) => setBlogBody(e.target.value)}
                  placeholder="## 주요 주제&#13;&#10;여기에 마크다운 문법으로 내용을 작성하세요. #, ##, * 등을 사용할 수 있습니다."
                  className="w-full border border-foreground bg-background px-4 py-3 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-foreground resize-y min-h-[350px]"
                />
              </div>
            </div>
          ) : (
            // --- 프로젝트 입력 폼 ---
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                    프로젝트 고유 식별자 (영어 ID)
                  </label>
                  <input
                    type="text"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="예: integration-erp-system"
                    className="w-full border border-foreground bg-background px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                    등록일 선택
                  </label>
                  <input
                    type="date"
                    value={toInputDate(projectDate)}
                    onChange={(e) => setProjectDate(fromInputDate(e.target.value))}
                    className="w-full border border-foreground bg-background px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">프로젝트명</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="예: 공공기관 대규모 통합 사내 ERP 고도화 개발"
                  className="w-full border border-foreground bg-background px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">한 줄 요약</label>
                <input
                  type="text"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="프로젝트 목록 카드에 노출될 간략한 요약글을 입력해 주세요."
                  className="w-full border border-foreground bg-background px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                    시작 연월 선택
                  </label>
                  <input
                    type="month"
                    value={toInputMonth(projectStartDate)}
                    onChange={(e) => setProjectStartDate(fromInputMonth(e.target.value))}
                    className="w-full border border-foreground bg-background px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                    종료 연월 선택
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="month"
                      disabled={projectInProgress}
                      value={projectInProgress ? "" : toInputMonth(projectEndDate)}
                      onChange={(e) => setProjectEndDate(fromInputMonth(e.target.value))}
                      className="flex-1 border border-foreground bg-background px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-foreground disabled:opacity-40"
                    />
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none border border-foreground px-3 py-3 hover:bg-muted font-mono shrink-0">
                      <input
                        type="checkbox"
                        checked={projectInProgress}
                        onChange={(e) => {
                          setProjectInProgress(e.target.checked);
                          if (e.target.checked) setProjectEndDate("");
                        }}
                        className="accent-foreground font-mono"
                      />
                      <span>진행 중</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">분류</label>
                  <select
                    value={projectCategory}
                    onChange={(e) => setProjectCategory(e.target.value)}
                    className="w-full border border-foreground bg-background px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-foreground"
                  >
                    <option value="web">웹 애플리케이션 (web)</option>
                    <option value="system">사내 시스템 구축 (system)</option>
                    <option value="app">모바일 앱 (app)</option>
                    <option value="infra">서버 인프라 및 클라우드 (infra)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                    태그 (쉼표로 구분하여 입력)
                  </label>
                  <input
                    type="text"
                    value={projectTags}
                    onChange={(e) => setProjectTags(e.target.value)}
                    placeholder="Spring, Oracle, eGovFrame"
                    className="w-full border border-foreground bg-background px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-foreground"
                  />

                  {/* 태그 실시간 시각화 */}
                  <div className="flex flex-wrap gap-1.5 mt-2 min-h-[22px]">
                    {projectTags.split(",").map(t => t.trim()).filter(Boolean).map((t, i) => (
                      <span key={i} className="text-[10px] font-mono border border-foreground/30 px-2 py-0.5 text-muted-foreground bg-muted/5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-muted-foreground mb-1">
                  상세 설명 글
                </label>
                <textarea
                  rows={4}
                  value={projectIntroduction}
                  onChange={(e) => setProjectIntroduction(e.target.value)}
                  placeholder="프로젝트 상세 설명 화면 상단에 들어갈 소개 글입니다."
                  className="w-full border border-foreground bg-background px-4 py-2.5 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-foreground resize-y"
                />
              </div>

              {/* 관련 링크 등록 */}
              <div className="border border-foreground/30 p-4 bg-muted/5">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs font-mono uppercase text-muted-foreground">관련 웹 링크</label>
                  <button
                    type="button"
                    onClick={addLink}
                    className="flex items-center gap-1.5 text-xs font-mono border border-foreground px-3 py-1 hover:bg-muted cursor-pointer"
                  >
                    <RiAddLine className="size-3.5" />
                    <span>항목 추가</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {projectLinks.map((link, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateLink(idx, "label", e.target.value)}
                        placeholder="링크 이름 (예: 깃허브, 홈페이지)"
                        className="w-1/3 border border-foreground bg-background px-3 py-1.5 text-xs font-sans focus:outline-none"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => updateLink(idx, "url", e.target.value)}
                        placeholder="https://..."
                        className="flex-1 border border-foreground bg-background px-3 py-1.5 text-xs font-sans focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeLink(idx)}
                        className="text-destructive hover:bg-destructive/10 p-1.5 border border-transparent hover:border-destructive/30 cursor-pointer"
                      >
                        <RiDeleteBinLine className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 핵심 구현 및 비즈니스 성과 */}
              <div className="border border-foreground/30 p-4 bg-muted/5">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs font-mono uppercase text-muted-foreground">핵심 구현 및 비즈니스 성과</label>
                  <button
                    type="button"
                    onClick={addCapability}
                    className="flex items-center gap-1.5 text-xs font-mono border border-foreground px-3 py-1 hover:bg-muted cursor-pointer"
                  >
                    <RiAddLine className="size-3.5" />
                    <span>항목 추가</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {projectCapabilities.map((cap, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <span className="text-xs font-mono mt-2.5">•</span>
                      <input
                        type="text"
                        value={cap}
                        onChange={(e) => updateCapability(idx, e.target.value)}
                        placeholder="구현한 핵심 성과나 비즈니스 가치 내용을 적어주세요."
                        className="flex-1 border border-foreground bg-background px-3 py-1.5 text-xs font-sans focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeCapability(idx)}
                        className="text-destructive hover:bg-destructive/10 p-1.5 border border-transparent hover:border-destructive/30 mt-1 cursor-pointer"
                      >
                        <RiDeleteBinLine className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 아키텍처 및 핵심 노하우 */}
              <div className="border border-foreground/30 p-4 bg-muted/5">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs font-mono uppercase text-muted-foreground">아키텍처 인프라 및 기술 노하우</label>
                  <button
                    type="button"
                    onClick={addArchitecture}
                    className="flex items-center gap-1.5 text-xs font-mono border border-foreground px-3 py-1 hover:bg-muted cursor-pointer"
                  >
                    <RiAddLine className="size-3.5" />
                    <span>항목 추가</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {projectArchitecture.map((arch, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <span className="text-xs font-mono mt-2.5">•</span>
                      <input
                        type="text"
                        value={arch}
                        onChange={(e) => updateArchitecture(idx, e.target.value)}
                        placeholder="서버 인프라 구축이나 성능 최적화, 데이터베이스 노하우를 적어주세요."
                        className="flex-1 border border-foreground bg-background px-3 py-1.5 text-xs font-sans focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeArchitecture(idx)}
                        className="text-destructive hover:bg-destructive/10 p-1.5 border border-transparent hover:border-destructive/30 mt-1 cursor-pointer"
                      >
                        <RiDeleteBinLine className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 통합 결과 조회 및 모달 오픈 버튼 */}
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="w-full flex items-center justify-center gap-2.5 border border-foreground bg-foreground text-background py-4.5 hover:bg-background hover:text-foreground font-bold text-sm uppercase tracking-widest transition-all duration-200 mt-8 cursor-pointer select-none"
          >
            <RiEyeLine className="size-5" />
            <span>👁️ 미리보기 및 파일 생성</span>
          </button>

        </div>
      </div>

      {/* 미리보기 및 파일 생성 모달창 */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-background text-foreground border border-foreground max-w-2xl w-full p-6 my-8 relative shadow-2xl overflow-y-auto max-h-[90vh] font-sans flex flex-col gap-6">
            
            {/* 모달 상단 */}
            <div className="border-b border-foreground pb-3 flex justify-between items-center">
              <h3 className="text-lg font-serif text-foreground">
                📰 미리보기 및 파일 생성
              </h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-muted-foreground hover:text-foreground font-mono text-xs border border-transparent hover:border-foreground/30 px-2.5 py-1 transition-all duration-150 cursor-pointer"
              >
                ✕ 닫기
              </button>
            </div>

            {/* 모달 본문 (스크롤) */}
            <div className="space-y-6 overflow-y-auto flex-1 pr-1">
              
              {/* 1. 실시간 카드 프리뷰 */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-muted-foreground">👀 실시간 카드 미리보기</h4>
                {activeTab === "blog" ? (
                  <div className="border border-foreground p-6 bg-background">
                    <div className="flex justify-between items-center text-xs font-mono text-muted-foreground uppercase mb-3">
                      <span>{blogCategory}</span>
                      <span>{blogDate || "오늘"}</span>
                    </div>
                    <h4 className="text-xl font-serif font-bold text-foreground mb-2 leading-snug">
                      {blogTitle || "블로그 포스트 제목"}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                      {blogDescription || "포스트의 간략한 요약글이 이곳에 표시됩니다."}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {blogTags.split(",").map(t => t.trim()).filter(Boolean).map((t, i) => (
                        <span key={i} className="text-[11px] font-mono border border-foreground/30 px-1.5 py-0.5 bg-muted/10 text-muted-foreground">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border border-foreground p-6 bg-background">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-mono uppercase bg-muted/20 border border-foreground/30 px-2 py-0.5 text-muted-foreground">
                        {projectCategory}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        {projectStartDate || "시작일"} ~ {projectInProgress ? "진행 중" : (projectEndDate || "종료일")}
                      </span>
                    </div>
                    <h4 className="text-xl font-serif font-bold text-foreground mb-2 leading-snug">
                      {projectTitle || "프로젝트 제목"}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                      {projectDescription || "프로젝트에 대한 짧은 요약 또는 수행 성과 요약입니다."}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {projectTags.split(",").map(t => t.trim()).filter(Boolean).map((t, i) => (
                        <span key={i} className="text-[11px] font-mono border border-foreground/30 px-1.5 py-0.5 text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. 코드 출력 및 복사/다운로드 */}
              <div className="border border-foreground p-5 bg-foreground text-background space-y-4">
                <div className="flex justify-between items-center border-b border-background/20 pb-2.5">
                  <h4 className="text-xs font-mono uppercase text-background/60">
                    💻 {activeTab === "blog" ? "생성된 블로그 마크다운 파일 내용" : "생성된 프로젝트 데이터 내용"}
                  </h4>
                  {copySuccess && (
                    <span className="text-[10px] font-mono bg-background text-foreground px-2 py-0.5 animate-pulse">
                      {copySuccess}
                    </span>
                  )}
                </div>

                {/* 복사 / 다운로드 버튼 */}
                <div className="flex gap-3">
                  <button
                    onClick={activeTab === "blog" ? copyBlogMarkdown : copyProjectJson}
                    className="flex-1 flex items-center justify-center gap-2 border border-background bg-background text-foreground px-3 py-2 hover:bg-foreground hover:text-background font-medium text-xs transition-all duration-150 cursor-pointer"
                  >
                    <RiClipboardLine className="size-4" />
                    <span>복사하기</span>
                  </button>
                  <button
                    onClick={activeTab === "blog" ? downloadBlogFile : downloadProjectFile}
                    className="flex-1 flex items-center justify-center gap-2 border border-background bg-transparent text-background px-3 py-2 hover:bg-background hover:text-foreground font-medium text-xs transition-all duration-150 cursor-pointer"
                  >
                    <RiDownload2Line className="size-4" />
                    <span>파일 다운로드</span>
                  </button>
                </div>

                <pre className="w-full bg-background/5 border border-background/20 p-4 font-mono text-[10.5px] leading-relaxed overflow-x-auto text-background max-h-[250px]">
                  {activeTab === "blog" ? getBlogMarkdown() : getProjectJson()}
                </pre>
              </div>

              {/* 3. 저장 위치 안내 */}
              <div className="border border-foreground/50 p-4 bg-muted/20 text-xs">
                <h5 className="font-bold font-serif mb-1.5 uppercase text-foreground">💡 저장 경로 안내</h5>
                {activeTab === "blog" ? (
                  <div className="space-y-1 text-muted-foreground font-sans">
                    <p>1. 위의 <strong>[파일 다운로드]</strong> 버튼을 누릅니다.</p>
                    <p>
                      2. 다운로드된 마크다운(<code className="font-mono bg-muted border px-1">.md</code>) 파일을 아래 폴더 안에 넣어주세요.
                    </p>
                    <p className="font-mono text-foreground font-bold mt-1 text-sm">
                      📁 /src/content/blog/{blogSlug || "이름"}.md
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1 text-muted-foreground font-sans">
                    <p>1. 위의 <strong>[복사하기]</strong> 버튼을 누릅니다.</p>
                    <p>
                      2. <code className="font-mono bg-muted border px-1">src/projects-config.json</code> 파일을 열어 대괄호 <code className="font-mono">[ ... ]</code> 리스트 안에 복사한 내용을 추가해 주세요.
                    </p>
                    <p className="font-mono text-foreground font-bold mt-1 text-sm">
                      📁 /src/projects-config.json
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* 모달 하단 버튼 */}
            <div className="border-t border-foreground/20 pt-4 text-right">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="border border-foreground bg-foreground text-background px-6 py-2.5 hover:bg-background hover:text-foreground font-medium text-xs transition-all duration-150 cursor-pointer select-none"
              >
                닫기 및 계속 작성하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
