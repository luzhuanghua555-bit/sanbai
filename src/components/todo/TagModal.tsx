import { useState } from 'react';
import { Modal } from '../common/Modal';
import { useUIStore } from '../../store/uiStore';
import { useTodoStore } from '../../store/todoStore';
import { Trash2, Plus } from 'lucide-react';
import { getTagColor } from '../../utils/colorUtils';

export function TagModal() {
  const { isTagModalOpen, closeTagModal } = useUIStore();
  const { globalTags, addGlobalTag, deleteGlobalTag } = useTodoStore();
  const [newTag, setNewTag] = useState('');

  if (!isTagModalOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTag.trim();
    if (trimmed && !globalTags.includes(trimmed)) {
      addGlobalTag(trimmed);
      setNewTag('');
    }
  };

  return (
    <Modal isOpen={isTagModalOpen} onClose={closeTagModal} title="标签管理">
      <div className="p-5">
        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="输入新标签..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="flex-1 px-3 py-2 text-sm bg-[var(--surface-2)] border border-[var(--line-soft)] rounded-lg outline-none focus:border-[var(--brand)] transition-colors text-[var(--ink-1)] placeholder:text-[var(--ink-4)]"
          />
          <button
            type="submit"
            disabled={!newTag.trim()}
            className="px-4 py-2 bg-[var(--brand)] text-[var(--brand-ink)] rounded-lg text-sm font-semibold flex items-center gap-1 disabled:opacity-50 transition-colors hover:opacity-90"
          >
            <Plus size={16} /> 添加
          </button>
        </form>

        <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
          {globalTags.length === 0 ? (
            <div className="text-center text-sm text-[var(--ink-4)] py-8">
              暂无标签，请添加
            </div>
          ) : (
            globalTags.map(tag => (
              <div key={tag} className="flex items-center justify-between p-3 rounded-lg border border-[var(--line-soft)] bg-[var(--surface)] hover:bg-[var(--hover)] transition-colors">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[var(--bg)] text-xs font-medium shadow-sm" style={{ background: getTagColor(tag) }}>
                    {tag}
                  </span>
                </div>
                <button
                  onClick={() => deleteGlobalTag(tag)}
                  className="p-1.5 text-[var(--ink-4)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] rounded-md transition-colors"
                  title="删除标签"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}