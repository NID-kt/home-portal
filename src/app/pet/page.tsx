'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Droplets,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Thermometer,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// 過去のデータ（実際の使用時は、APIやデータベースから取得します）
const pastData = [
  { time: '9:00', temp: 24, humidity: 55 },
  { time: '12:00', temp: 26, humidity: 58 },
  { time: '15:00', temp: 27, humidity: 62 },
  { time: '18:00', temp: 25, humidity: 60 },
  { time: '21:00', temp: 23, humidity: 59 },
];

// 過去24時間分の画像データをシミュレート（実際の使用時は、保存された実際の画像を使用します）
const generatePastImages = (cameraId: number) =>
  Array.from({ length: 24 }, (_, i) => ({
    time: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
    url: `/placeholder.svg?height=200&width=300&text=Camera ${cameraId} Image ${i + 1}`,
  }));

const TimeLapseCard = ({ cameraId }: { cameraId: number }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const pastImages = generatePastImages(cameraId);

  const handleSliderChange = (value: number[]) => {
    setCurrentImageIndex(value[0]);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev < pastImages.length - 1 ? prev + 1 : prev,
    );
    setIsPlaying(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => {
          if (prev < pastImages.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1000); // 1秒ごとに画像を更新
    }
    return () => clearInterval(interval);
  }, [isPlaying, pastImages.length]);

  return (
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle>カメラ {cameraId} タイムラプス</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='mb-4 flex aspect-video items-center justify-center bg-gray-200'>
          <span className='text-gray-500'>
            カメラ {cameraId} 画像 {currentImageIndex + 1}
          </span>
        </div>
        <div className='mb-2 text-center'>
          {new Date(pastImages[currentImageIndex].time).toLocaleString()}
        </div>
        <Slider
          value={[currentImageIndex]}
          max={pastImages.length - 1}
          step={1}
          onValueChange={handleSliderChange}
          className='mb-4'
        />
        <div className='flex justify-center space-x-2'>
          <Button onClick={handlePrevious} aria-label='Previous image'>
            <SkipBack className='h-4 w-4' />
          </Button>
          <Button
            onClick={handlePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className='h-4 w-4' />
            ) : (
              <Play className='h-4 w-4' />
            )}
          </Button>
          <Button onClick={handleNext} aria-label='Next image'>
            <SkipForward className='h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Component() {
  const [temp] = useState(25);
  const [humidity] = useState(60);
  const [recentEvents, setRecentEvents] = useState([
    { date: '2023-06-01', event: 'トカゲが脱皮しました' },
    { date: '2023-05-28', event: '新しい装飾を追加しました' },
    { date: '2023-05-25', event: 'トカゲが餌を食べました' },
  ]);
  const [newEvent, setNewEvent] = useState('');

  const handleCameraControl = (camera: number, direction: string) => {
    console.log(`Moving camera ${camera} ${direction}`);
    // ここで実際のカメラ制御のロジックを実装します
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.trim()) {
      const currentDate = new Date().toISOString().split('T')[0];
      setRecentEvents([
        { date: currentDate, event: newEvent.trim() },
        ...recentEvents,
      ]);
      setNewEvent('');
    }
  };

  return (
    <>
      <div className='flex items-center'>
        <h1 className='text-lg font-semibold md:text-2xl'>ペット</h1>
      </div>
      <div className='rounded-lg border border-dashed p-4 shadow-sm'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {[1, 2].map((camera) => (
            <Card key={camera} className='w-full'>
              <CardHeader>
                <CardTitle>カメラ {camera}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='mb-4 flex aspect-video items-center justify-center bg-gray-200'>
                  <span className='text-gray-500'>
                    カメラ {camera} フィード
                  </span>
                </div>
                <div className='grid grid-cols-3 gap-2'>
                  <div></div>
                  <Button
                    onClick={() => handleCameraControl(camera, 'up')}
                    aria-label={`カメラ ${camera} を上に動かす`}
                  >
                    <ArrowUp className='h-4 w-4' />
                  </Button>
                  <div></div>
                  <Button
                    onClick={() => handleCameraControl(camera, 'left')}
                    aria-label={`カメラ ${camera} を左に動かす`}
                  >
                    <ArrowLeft className='h-4 w-4' />
                  </Button>
                  <div></div>
                  <Button
                    onClick={() => handleCameraControl(camera, 'right')}
                    aria-label={`カメラ ${camera} を右に動かす`}
                  >
                    <ArrowRight className='h-4 w-4' />
                  </Button>
                  <div></div>
                  <Button
                    onClick={() => handleCameraControl(camera, 'down')}
                    aria-label={`カメラ ${camera} を下に動かす`}
                  >
                    <ArrowDown className='h-4 w-4' />
                  </Button>
                  <div></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className='mt-4'>
          <CardHeader>
            <CardTitle>環境データ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex justify-around'>
              <div className='flex items-center'>
                <Thermometer className='mr-2 h-6 w-6' />
                <span className='text-xl'>{temp}°C</span>
              </div>
              <div className='flex items-center'>
                <Droplets className='mr-2 h-6 w-6' />
                <span className='text-xl'>{humidity}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className='mt-4'>
          <CardHeader>
            <CardTitle>過去の記録</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='mb-4'>
              <h3 className='mb-2 text-lg font-semibold'>温度と湿度の推移</h3>
              <ResponsiveContainer width='100%' height={200}>
                <LineChart data={pastData}>
                  <XAxis dataKey='time' />
                  <YAxis yAxisId='left' />
                  <YAxis yAxisId='right' orientation='right' />
                  <Tooltip />
                  <Line
                    yAxisId='left'
                    type='monotone'
                    dataKey='temp'
                    stroke='#8884d8'
                    name='温度 (°C)'
                  />
                  <Line
                    yAxisId='right'
                    type='monotone'
                    dataKey='humidity'
                    stroke='#82ca9d'
                    name='湿度 (%)'
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className='mb-2 text-lg font-semibold'>最近の出来事</h3>
              <form onSubmit={handleAddEvent} className='mb-4'>
                <div className='flex space-x-2'>
                  <Input
                    type='text'
                    value={newEvent}
                    onChange={(e) => setNewEvent(e.target.value)}
                    placeholder='新しい出来事を入力'
                    aria-label='新しい出来事'
                  />
                  <Button type='submit'>追加</Button>
                </div>
              </form>
              <ul className='list-disc pl-5'>
                {recentEvents.map((event, index) => (
                  <li key={index} className='mb-1'>
                    <span className='font-medium'>{event.date}:</span>{' '}
                    {event.event}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <TimeLapseCard cameraId={1} />
          <TimeLapseCard cameraId={2} />
        </div>
      </div>
    </>
  );
}
