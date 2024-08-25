'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckSquare,
  Edit,
  Filter,
  Flag,
  Plus,
  ShoppingCart,
  Trash2,
  UserRound,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  assignee: string;
  dueDate: string;
  type: 'task' | 'shopping';
  description?: string;
  priority: 'low' | 'medium' | 'high';
}

const familyMembers = ['お父さん', 'お母さん', '子供1', '子供2'];
const priorities = [
  { value: 'low', label: '低', color: 'text-green-500' },
  { value: 'medium', label: '中', color: 'text-yellow-500' },
  { value: 'high', label: '高', color: 'text-red-500' },
];

// サンプルデータ
const sampleTasks: Task[] = [
  {
    id: 1,
    text: '車の点検予約',
    completed: false,
    assignee: 'お父さん',
    dueDate: '2023-06-15',
    type: 'task',
    description: '年次点検の予約を入れる。オイル交換も忘れずに。',
    priority: 'medium',
  },
  {
    id: 2,
    text: '電球の交換',
    completed: true,
    assignee: 'お父さん',
    dueDate: '2023-06-10',
    type: 'task',
    description: 'リビングの天井の電球を省エネタイプに交換する。',
    priority: 'low',
  },
  {
    id: 3,
    text: '食材の買い出し',
    completed: false,
    assignee: 'お母さん',
    dueDate: '2023-06-12',
    type: 'task',
    description: '週末の家族の集まりのための食材を購入する。',
    priority: 'high',
  },
  {
    id: 4,
    text: '洗濯物を畳む',
    completed: true,
    assignee: 'お母さん',
    dueDate: '2023-06-11',
    type: 'task',
    description: '乾いた洗濯物を畳んで各自の部屋に配る。',
    priority: 'medium',
  },
  {
    id: 5,
    text: '数学の宿題',
    completed: false,
    assignee: '子供1',
    dueDate: '2023-06-14',
    type: 'task',
    description: '数学の教科書p.45-47の問題を解く。',
    priority: 'high',
  },
  {
    id: 6,
    text: '部屋の掃除',
    completed: false,
    assignee: '子供1',
    dueDate: '2023-06-13',
    type: 'task',
    description: '床掃除、ほこり取り、整理整頓を行う。',
    priority: 'low',
  },
  {
    id: 7,
    text: '絵画コンクールの準備',
    completed: false,
    assignee: '子供2',
    dueDate: '2023-06-20',
    type: 'task',
    description: 'テーマ「未来の町」のアイデアスケッチを描く。',
    priority: 'medium',
  },
  {
    id: 8,
    text: 'ピアノの練習',
    completed: true,
    assignee: '子供2',
    dueDate: '2023-06-11',
    type: 'task',
    description: '次のレッスンの曲を30分練習する。',
    priority: 'high',
  },
  {
    id: 9,
    text: '牛乳',
    completed: false,
    assignee: 'お母さん',
    dueDate: '',
    type: 'shopping',
    description: '1リットル入りを2本購入',
    priority: 'medium',
  },
  {
    id: 10,
    text: 'パン',
    completed: true,
    assignee: 'お父さん',
    dueDate: '',
    type: 'shopping',
    description: '全粒粉のものを選ぶ',
    priority: 'low',
  },
  {
    id: 11,
    text: '卵',
    completed: false,
    assignee: '子供1',
    dueDate: '',
    type: 'shopping',
    description: '10個入りのパックを1つ',
    priority: 'high',
  },
  {
    id: 12,
    text: 'バナナ',
    completed: false,
    assignee: '子供2',
    dueDate: '',
    type: 'shopping',
    description: '5本程度、少し青みがかったもの',
    priority: 'low',
  },
];

export default function Component() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [newTask, setNewTask] = useState('');
  const [newShoppingItem, setNewShoppingItem] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>(
    'medium',
  );
  const [currentUser] = useState(familyMembers[0]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate'>('priority');
  const [filters, setFilters] = useState({
    assignee: 'all',
    completed: 'all',
    priority: 'all',
  });

  const addTask = (type: 'task' | 'shopping') => {
    const text = type === 'task' ? newTask : newShoppingItem;
    if (text.trim() !== '') {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text,
          completed: false,
          assignee: currentUser,
          dueDate: type === 'task' ? newDueDate : '',
          type,
          description: '',
          priority: newPriority,
        },
      ]);
      if (type === 'task') {
        setNewTask('');
        setNewDueDate('');
      } else {
        setNewShoppingItem('');
      }
      setNewPriority('medium');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setEditedTask(task);
    setIsModalOpen(true);
  };

  const closeTaskDetails = () => {
    setSelectedTask(null);
    setEditedTask(null);
    setIsModalOpen(false);
  };

  const saveTaskChanges = () => {
    if (editedTask) {
      setTasks(
        tasks.map((task) => (task.id === editedTask.id ? editedTask : task)),
      );
      closeTaskDetails();
    }
  };

  const sortTasks = useCallback(
    (tasksToSort: Task[]) => {
      return tasksToSort.sort((a, b) => {
        if (sortBy === 'priority') {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        } else {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
      });
    },
    [sortBy],
  );

  const filterTasks = useCallback(
    (tasksToFilter: Task[]) => {
      return tasksToFilter.filter((task) => {
        const assigneeMatch =
          filters.assignee === 'all' || task.assignee === filters.assignee;
        const completedMatch =
          filters.completed === 'all' ||
          (filters.completed === 'completed' && task.completed) ||
          (filters.completed === 'uncompleted' && !task.completed);
        const priorityMatch =
          filters.priority === 'all' || task.priority === filters.priority;
        return assigneeMatch && completedMatch && priorityMatch;
      });
    },
    [filters],
  );

  const taskList = useMemo(
    () => sortTasks(filterTasks(tasks.filter((task) => task.type === 'task'))),
    [sortTasks, filterTasks, tasks],
  );
  const shoppingList = useMemo(
    () =>
      sortTasks(filterTasks(tasks.filter((task) => task.type === 'shopping'))),
    [sortTasks, filterTasks, tasks],
  );

  const PriorityFlag = ({
    priority,
  }: {
    priority: 'low' | 'medium' | 'high';
  }) => {
    const color =
      priorities.find((p) => p.value === priority)?.color || 'text-gray-500';
    return <Flag className={`h-4 w-4 ${color}`} />;
  };

  const MemberAvatar = ({ name }: { name: string }) => {
    return (
      <Avatar className={`h-6 w-6`}>
        <AvatarImage src={`/images/${name}.jpg`} />
        <AvatarFallback>
          <UserRound />
        </AvatarFallback>
      </Avatar>
    );
  };

  const FilterPopover = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='ml-auto'>
          <Filter className='mr-2 h-4 w-4' />
          フィルター
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='grid gap-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>担当者</h4>
            <Select
              value={filters.assignee}
              onValueChange={(value) =>
                setFilters({ ...filters, assignee: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='担当者を選択' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>全員</SelectItem>
                {familyMembers.map((member) => (
                  <SelectItem key={member} value={member}>
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>完了状態</h4>
            <Select
              value={filters.completed}
              onValueChange={(value) =>
                setFilters({ ...filters, completed: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='完了状態を選択' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>すべて</SelectItem>
                <SelectItem value='completed'>完了</SelectItem>
                <SelectItem value='uncompleted'>未完了</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>優先度</h4>
            <Select
              value={filters.priority}
              onValueChange={(value) =>
                setFilters({ ...filters, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='優先度を選択' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>すべて</SelectItem>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <>
      <div className='flex items-center'>
        <h1 className='text-lg font-semibold md:text-2xl'>タスク</h1>
      </div>
      <div className='grid grid-cols-1 gap-4 rounded-lg border border-dashed p-4 shadow-sm md:grid-cols-2'>
        <Card className='flex flex-col justify-between'>
          <div>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Plus className='h-6 w-6' />
                タスクを追加
              </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col justify-between'>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='new-task'>新しいタスク</Label>
                  <Input
                    id='new-task'
                    type='text'
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder='新しいタスクを入力'
                  />
                </div>
                <div>
                  <Label htmlFor='task-due-date'>期限</Label>
                  <Input
                    id='task-due-date'
                    type='date'
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label>優先度</Label>
                  <RadioGroup
                    value={newPriority}
                    onValueChange={(value: 'low' | 'medium' | 'high') =>
                      setNewPriority(value)
                    }
                    className='flex space-x-4'
                  >
                    {priorities.map((priority) => (
                      <div
                        key={priority.value}
                        className='flex items-center space-x-2'
                      >
                        <RadioGroupItem
                          value={priority.value}
                          id={`priority-${priority.value}`}
                        />
                        <Label htmlFor={`priority-${priority.value}`}>
                          {priority.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </div>
          <CardFooter>
            <Button onClick={() => addTask('task')} className='w-full'>
              <Plus className='mr-2 h-4 w-4' />
              タスクを追加
            </Button>
          </CardFooter>
        </Card>
        <Card className='flex flex-col justify-between'>
          <div>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Plus className='h-6 w-6' />
                買うものを追加
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='new-shopping-item'>新しく買うもの</Label>
                  <Input
                    id='new-shopping-item'
                    type='text'
                    value={newShoppingItem}
                    onChange={(e) => setNewShoppingItem(e.target.value)}
                    placeholder='新しく買うものを入力'
                  />
                </div>
                <div>
                  <Label>優先度</Label>
                  <RadioGroup
                    value={newPriority}
                    onValueChange={(value: 'low' | 'medium' | 'high') =>
                      setNewPriority(value)
                    }
                    className='flex space-x-4'
                  >
                    {priorities.map((priority) => (
                      <div
                        key={priority.value}
                        className='flex items-center space-x-2'
                      >
                        <RadioGroupItem
                          value={priority.value}
                          id={`shopping-priority-${priority.value}`}
                        />
                        <Label htmlFor={`shopping-priority-${priority.value}`}>
                          {priority.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </div>
          <CardFooter>
            <Button onClick={() => addTask('shopping')} className='w-full'>
              <Plus className='mr-2 h-4 w-4' />
              買うものを追加
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CheckSquare className='h-6 w-6' />
              タスクリスト
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='mb-4 flex items-center justify-between'>
              <Select
                onValueChange={(value: 'priority' | 'dueDate') =>
                  setSortBy(value)
                }
                value={sortBy}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='ソート順を選択' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='priority'>優先度</SelectItem>
                  <SelectItem value='dueDate'>期限</SelectItem>
                </SelectContent>
              </Select>
              <FilterPopover />
            </div>
            <ul className='space-y-2'>
              {taskList.map((task) => (
                <li
                  key={task.id}
                  className={`flex items-center gap-2 rounded p-2 ${
                    task.assignee === currentUser
                      ? 'bg-primary/10'
                      : 'bg-secondary'
                  }`}
                >
                  <div className='flex flex-grow items-center gap-2'>
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      aria-label={`${task.completed ? '完了' : '未完了'}: ${task.text}`}
                    />
                    <MemberAvatar name={task.assignee} />
                    <PriorityFlag priority={task.priority} />
                    <span
                      className={
                        task.completed
                          ? 'text-muted-foreground line-through'
                          : 'text-primary'
                      }
                    >
                      {task.text}
                    </span>
                  </div>
                  <div className='ml-auto flex items-center gap-2'>
                    <span className='text-sm text-muted-foreground'>
                      {task.dueDate &&
                        new Date(task.dueDate).toLocaleDateString('ja-JP')}
                    </span>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => openTaskDetails(task)}
                      aria-label={`${task.text}の詳細を表示`}
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => deleteTask(task.id)}
                      aria-label={`${task.text}を削除`}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ShoppingCart className='h-6 w-6' />
              買うものリスト
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='mb-4 flex items-center justify-between'>
              <Select
                onValueChange={(value: 'priority' | 'dueDate') =>
                  setSortBy(value)
                }
                value={sortBy}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='ソート順を選択' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='priority'>優先度</SelectItem>
                  <SelectItem value='dueDate'>期限</SelectItem>
                </SelectContent>
              </Select>
              <FilterPopover />
            </div>
            <ul className='space-y-2'>
              {shoppingList.map((item) => (
                <li
                  key={item.id}
                  className={`flex items-center gap-2 rounded p-2 ${
                    item.assignee === currentUser
                      ? 'bg-primary/10'
                      : 'bg-secondary'
                  }`}
                >
                  <div className='flex flex-grow items-center gap-2'>
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleTask(item.id)}
                      aria-label={`${item.completed ? '購入済み' : '未購入'}: ${item.text}`}
                    />
                    <MemberAvatar name={item.assignee} />
                    <PriorityFlag priority={item.priority} />
                    <span
                      className={
                        item.completed
                          ? 'text-muted-foreground line-through'
                          : 'text-primary'
                      }
                    >
                      {item.text}
                    </span>
                  </div>
                  <div className='ml-auto flex items-center gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => openTaskDetails(item)}
                      aria-label={`${item.text}の詳細を表示`}
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => deleteTask(item.id)}
                      aria-label={`${item.text}を削除`}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>タスク詳細</DialogTitle>
          </DialogHeader>
          {editedTask && (
            <div className='space-y-4'>
              <div>
                <Label htmlFor='edit-task-text'>タスク名</Label>
                <Input
                  id='edit-task-text'
                  value={editedTask.text}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, text: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor='edit-task-description'>詳細説明</Label>
                <Input
                  id='edit-task-description'
                  value={editedTask.description || ''}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor='edit-task-assignee'>担当者</Label>
                <Select
                  value={editedTask.assignee}
                  onValueChange={(value) =>
                    setEditedTask({ ...editedTask, assignee: value })
                  }
                >
                  <SelectTrigger id='edit-task-assignee'>
                    <SelectValue placeholder='担当者を選択' />
                  </SelectTrigger>
                  <SelectContent>
                    {familyMembers.map((member) => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {editedTask.type === 'task' && (
                <div>
                  <Label htmlFor='edit-task-due-date'>期限</Label>
                  <Input
                    id='edit-task-due-date'
                    type='date'
                    value={editedTask.dueDate}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, dueDate: e.target.value })
                    }
                  />
                </div>
              )}
              <div>
                <Label>優先度</Label>
                <RadioGroup
                  value={editedTask.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high') =>
                    setEditedTask({ ...editedTask, priority: value })
                  }
                  className='flex space-x-4'
                >
                  {priorities.map((priority) => (
                    <div
                      key={priority.value}
                      className='flex items-center space-x-2'
                    >
                      <RadioGroupItem
                        value={priority.value}
                        id={`edit-priority-${priority.value}`}
                      />
                      <Label htmlFor={`edit-priority-${priority.value}`}>
                        {priority.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='edit-task-completed'
                  checked={editedTask.completed}
                  onCheckedChange={(checked) =>
                    setEditedTask({
                      ...editedTask,
                      completed: checked as boolean,
                    })
                  }
                />
                <Label htmlFor='edit-task-completed'>完了</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={closeTaskDetails} variant='outline'>
              キャンセル
            </Button>
            <Button onClick={saveTaskChanges}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
