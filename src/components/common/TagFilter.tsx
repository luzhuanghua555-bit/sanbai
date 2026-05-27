import { useState, useRef, useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useTodoStore } from '../../store/todoStore';
import { getTagColor } from '../../utils/colorUtils';
import { clsx } from 'clsx';

export function TagFilter() {
  const { tagFilter, setTagFilter, openTagModal } = useUIStore();
  const { globalTags, todos } = useTodoStore();
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowTagMenu(false);
      }
    };
    if (showTagMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTagMenu]);

  // Removed the early return so the button is always visible
  // if (globalTags.length === 0 && !tagFilter) return null;

  const filteredTags = globalTags.filter(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

  // Count tags in active todos (not strictly required by design but good for real data)
  const getTagCount = (tag: string) => todos.filter(todo => todo.tags?.includes(tag)).length;

  return (
    <div className="relative z-50 flex items-center" ref={menuRef}>
      {/* 1) 顶栏触发按钮 */}
      <button 
        className={clsx("tagfilter-trigger", showTagMenu || tagFilter ? "is-active" : "")}
        onClick={() => setShowTagMenu(!showTagMenu)}
      >
        <span className="lead">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41 13 21l-9-9V4h8l8.59 8.59a2 2 0 0 1 0 2.82z"/>
            <circle cx="8" cy="8" r="1.2"/>
          </svg>
        </span>
        <span>{tagFilter ? tagFilter : `${globalTags.length} 个标签`}</span>
        {tagFilter && (
          <span className="pill">{getTagCount(tagFilter)}</span>
        )}
        <span className="caret">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </span>
      </button>

      {/* 2) 下拉面板 */}
      {showTagMenu && (
        <div className="tagfilter-panel" role="dialog" aria-label="按标签筛选">
          <div className="tfp-head">
            <span className="ttl">按标签筛选</span>
            <div className="actions">
              {tagFilter && (
                <button className="primary" onClick={() => { setTagFilter(null); setShowTagMenu(false); }}>清空</button>
              )}
            </div>
          </div>

          <div className="tfp-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
            </svg>
            <input 
              placeholder="搜索标签…" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="tfp-list">
            {/* 全部标签 */}
            {(!searchQuery || '全部标签'.includes(searchQuery)) && (
              <button 
                className={clsx("tfp-row all", !tagFilter && "on")}
                onClick={() => { setTagFilter(null); setShowTagMenu(false); }}
              >
                <span className="dot-tag"></span>
                <span className="name">全部标签</span>
                <span className="cnt">{globalTags.length}</span>
                <span className="tick">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </span>
              </button>
            )}

            {globalTags.length > 0 && <div className="tfp-divider"></div>}

            {/* 动态渲染标签行 */}
            {filteredTags.map(tag => {
              const isSelected = tagFilter === tag;
              return (
                <button 
                  key={tag}
                  className={clsx("tfp-row", isSelected && "on")}
                  onClick={() => { setTagFilter(tag); setShowTagMenu(false); }}
                >
                  <span className="dot-tag" style={{ background: getTagColor(tag) }}></span>
                  <span className="name">{tag}</span>
                  <span className="cnt">{getTagCount(tag)}</span>
                  <span className="tick">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="tfp-foot">
            <button 
              className="manage"
              onClick={() => {
                setShowTagMenu(false);
                openTagModal();
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
              </svg>
              <span>管理标签</span>
            </button>
            <span className="right">共 {globalTags.length} 个标签</span>
          </div>
        </div>
      )}
    </div>
  );
}