'use client';
import {
  Album,
  Home,
  LayoutDashboard,
  Leaf,
  ListTodo,
  Menu,
  PawPrint,
  Settings,
  UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// export const metadata: Metadata = {
//   title: 'Home Portal',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang='ja'>
      <body>
        <div className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
          <div className='hidden border-r bg-muted/40 md:block'>
            <div className='flex h-full max-h-screen flex-col gap-2'>
              <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
                <Link
                  href='/'
                  className='flex items-center gap-2 font-semibold'
                >
                  <Home className='h-6 w-6' />
                  Home Portal
                </Link>
              </div>
              <div className='flex-1'>
                <nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
                  <Link
                    href='/'
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                      {
                        'bg-muted text-primary': pathname === '/',
                      },
                    )}
                  >
                    <LayoutDashboard className='h-4 w-4' />
                    ダッシュボード
                  </Link>
                  <Link
                    href='/album'
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                      {
                        'bg-muted text-primary': pathname === '/album',
                      },
                    )}
                  >
                    <Album className='h-4 w-4' />
                    アルバム
                  </Link>
                  <Link
                    href='/task'
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                      {
                        'bg-muted text-primary': pathname === '/task',
                      },
                    )}
                  >
                    <ListTodo className='h-4 w-4' />
                    タスク
                  </Link>
                  <Link
                    href='/pet'
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                      {
                        'bg-muted text-primary': pathname === '/pet',
                      },
                    )}
                  >
                    <PawPrint className='h-4 w-4' />
                    ペット
                  </Link>
                  <Link
                    href='/hydroponics'
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                      {
                        'bg-muted text-primary': pathname === '/hydroponics',
                      },
                    )}
                  >
                    <Leaf className='h-4 w-4' />
                    水耕栽培
                  </Link>
                </nav>
              </div>
              <div className='flex h-14 items-center border-t px-4 lg:h-[60px] lg:px-6'>
                <Link
                  href='/settings'
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    {
                      'bg-muted text-primary': pathname === '/settings',
                    },
                  )}
                >
                  <Settings className='h-6 w-6' />
                  設定
                </Link>
              </div>
            </div>
          </div>
          <div className='flex flex-col'>
            <header className='flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6'>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant='outline'
                    size='icon'
                    className='shrink-0 md:hidden'
                  >
                    <Menu className='h-5 w-5' />
                    <span className='sr-only'>
                      ナビゲーションメニューの切り替え
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent side='left' className='flex flex-col'>
                  <nav className='grid gap-2 text-lg font-medium'>
                    <Link
                      href='/'
                      className='flex items-center gap-2 text-lg font-semibold'
                    >
                      <Home className='h-6 w-6' />
                      <span className='sr-only'>Home Portal</span>
                    </Link>
                    <Link
                      href='/'
                      className={cn(
                        'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
                        {
                          'bg-muted text-foreground': pathname === '/',
                        },
                      )}
                    >
                      <LayoutDashboard className='h-5 w-5' />
                      ダッシュボード
                    </Link>
                    <Link
                      href='/album'
                      className={cn(
                        'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
                        {
                          'bg-muted text-foreground': pathname === '/album',
                        },
                      )}
                    >
                      <Album className='h-5 w-5' />
                      アルバム
                    </Link>
                    <Link
                      href='/task'
                      className={cn(
                        'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
                        {
                          'bg-muted text-foreground': pathname === '/task',
                        },
                      )}
                    >
                      <ListTodo className='h-5 w-5' />
                      タスク
                    </Link>
                    <Link
                      href='/pet'
                      className={cn(
                        'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
                        {
                          'bg-muted text-foreground': pathname === '/pet',
                        },
                      )}
                    >
                      <PawPrint className='h-5 w-5' />
                      ペット
                    </Link>
                    <Link
                      href='/hydroponics'
                      className={cn(
                        'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
                        {
                          'bg-muted text-foreground':
                            pathname === '/hydroponics',
                        },
                      )}
                    >
                      <Leaf className='h-5 w-5' />
                      水耕栽培
                    </Link>
                  </nav>
                  <div className='mt-auto'>
                    <nav className='grid gap-2 text-lg font-medium'>
                      <Link
                        href='/settings'
                        className={cn(
                          'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
                          {
                            'bg-muted text-foreground':
                              pathname === '/settings',
                          },
                        )}
                      >
                        <Settings className='h-5 w-5' />
                        設定
                      </Link>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
              <div className='w-full flex-1'></div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='secondary'
                    size='icon'
                    className='rounded-full'
                  >
                    <UserRound className='h-5 w-5' />
                    <span className='sr-only'>ユーザーメニューの切り替え</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>アカウント</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>設定</DropdownMenuItem>
                  <DropdownMenuItem>家庭の管理</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>ログアウト</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>
            <main className='flex max-h-[calc(100vh-3.5rem)] flex-1 flex-col gap-4 overflow-y-auto p-4 lg:max-h-[calc(100vh-60px)] lg:gap-6 lg:p-6'>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
