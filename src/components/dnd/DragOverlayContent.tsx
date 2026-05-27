import { GripVertical, Flag, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import type { Todo } from '../../types';
import { PRIORITY_LABELS } from '../../types';
import { getTagColor } from '../../utils/colorUtils';
import { formatDateShort, isOverdue } from '../../utils/dateUtils';

interface DragOverlayContentProps {
  todo: Todo;
}

export function DragOverlayContent({ todo }: DragOverlayContentProps) {
  const isOverdueDate = todo.dueDate && isOverdue(todo.dueDate);

  return (
    <div className={clsx(
      'flex items-start gap-2.5 px-3 py-2.5 rounded-xl shadow-2xl',
      'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
      'rotate-2 scale-105 opacity-95 cursor-grabbing',
      'min-w-[200px] max-w-[320px]',
    )}>
      <GripVertical size={14} className="text-gray-400 mt-0.5" />
      <div className="w-4 h-4 rounded-full border-2 border-blue-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 dark:text-gray-100 truncate">{todo.title}</p>
        <div className="flex items-center gap-2 mt-1">
          {todo.priority !== 'none' && (
            <span className={clsx('text-[10px] font-medium flex items-center gap-0.5')}>
              <Flag size={9} /> {PRIORITY_LABELS[todo.priority].replace('优先级', '')}
            </span>
          )}
          {todo.dueDate && (
            <span className={clsx('text-[10px] flex items-center gap-0.5', isOverdueDate ? 'text-red-400' : 'text-gray-400')}>
              <Calendar size={9} /> {formatDateShort(todo.dueDate)}
            </span>
          )}
          {todo.tags?.map(tag => (
            <span key={tag} className="tag text-[var(--bg)] shadow-sm font-medium" style={{ background: getTagColor(tag) }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
