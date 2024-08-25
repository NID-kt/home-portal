import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Edit2,
  Image as ImageIcon,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Photo {
  id: number;
  src: string;
  caption: string;
  albumIds: number[];
}

interface Album {
  id: number;
  name: string;
}

const generatePhotos = (startIndex: number, endIndex: number): Photo[] => {
  return Array.from({ length: endIndex - startIndex }, (_, index) => ({
    id: startIndex + index,
    src: `/placeholder.svg?height=300&width=300&text=Photo ${startIndex + index}`,
    caption: `写真 ${startIndex + index}`,
    albumIds: [],
  }));
};

export default function Component() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([
    { id: 0, name: 'すべての写真' },
  ]);
  const [selectedAlbum, setSelectedAlbum] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [isCreateAlbumDialogOpen, setIsCreateAlbumDialogOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [editingCaption, setEditingCaption] = useState<string>('');
  const loader = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosPerPage = 20;

  const loadPhotos = useCallback(() => {
    setLoading(true);
    const newPhotos = generatePhotos(
      (page - 1) * photosPerPage,
      page * photosPerPage,
    );
    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    setPage((prevPage) => prevPage + 1);
    setLoading(false);
  }, [page]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !loading) {
        loadPhotos();
      }
    },
    [loading, loadPhotos],
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [handleObserver]);

  useEffect(() => {
    loadPhotos();
  }, []);

  const filteredPhotos = photos.filter(
    (photo) =>
      (selectedAlbum === 0 || photo.albumIds.includes(selectedAlbum)) &&
      photo.caption.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (uploadedImage) {
      const newPhoto: Photo = {
        id: photos.length + 1,
        src: uploadedImage,
        caption: `アップロードされた写真 ${photos.length + 1}`,
        albumIds: selectedAlbum !== 0 ? [selectedAlbum] : [],
      };
      setPhotos((prevPhotos) => [newPhoto, ...prevPhotos]);
      setUploadedImage(null);
    }
  };

  const handleCreateAlbum = () => {
    if (newAlbumName.trim()) {
      const newAlbum: Album = {
        id: albums.length,
        name: newAlbumName.trim(),
      };
      setAlbums((prevAlbums) => [...prevAlbums, newAlbum]);
      setNewAlbumName('');
      setIsCreateAlbumDialogOpen(false);
    }
  };

  const handleDeleteAlbum = (albumId: number) => {
    setAlbums((prevAlbums) =>
      prevAlbums.filter((album) => album.id !== albumId),
    );
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) => ({
        ...photo,
        albumIds: photo.albumIds.filter((id) => id !== albumId),
      })),
    );
    setSelectedAlbum(0);
  };

  const handleEditAlbum = (album: Album) => {
    setEditingAlbum(album);
    setNewAlbumName(album.name);
    setIsCreateAlbumDialogOpen(true);
  };

  const handleSaveAlbum = () => {
    if (editingAlbum && newAlbumName.trim()) {
      setAlbums((prevAlbums) =>
        prevAlbums.map((album) =>
          album.id === editingAlbum.id
            ? { ...album, name: newAlbumName.trim() }
            : album,
        ),
      );
      setEditingAlbum(null);
      setNewAlbumName('');
      setIsCreateAlbumDialogOpen(false);
    }
  };

  const handleAddAlbum = (photoId: number, albumId: number) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo.id === photoId
          ? { ...photo, albumIds: [...new Set([...photo.albumIds, albumId])] }
          : photo,
      ),
    );
  };

  const handleRemoveAlbum = (photoId: number, albumId: number) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo.id === photoId
          ? {
              ...photo,
              albumIds: photo.albumIds.filter((id) => id !== albumId),
            }
          : photo,
      ),
    );
  };

  const handleUpdateCaption = (photoId: number, newCaption: string) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo.id === photoId ? { ...photo, caption: newCaption } : photo,
      ),
    );
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-6 text-center text-2xl font-bold'>
        家族のフォトアルバム
      </h1>

      <Tabs defaultValue='photos' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='photos'>写真</TabsTrigger>
          <TabsTrigger value='albums'>アルバム</TabsTrigger>
        </TabsList>
        <TabsContent value='photos'>
          <div className='mb-4 flex flex-wrap items-center justify-between gap-2'>
            <div className='relative mr-4 min-w-[200px] flex-grow'>
              <Input
                type='text'
                placeholder='写真を検索...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400' />
            </div>
            <Select
              value={selectedAlbum.toString()}
              onValueChange={(value) => setSelectedAlbum(Number(value))}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='アルバムを選択' />
              </SelectTrigger>
              <SelectContent>
                {albums.map((album) => (
                  <SelectItem key={album.id} value={album.id.toString()}>
                    {album.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => setIsCreateAlbumDialogOpen(true)}
              className='flex items-center'
            >
              <Plus className='mr-2 h-4 w-4' /> 新しいアルバム
            </Button>
            <Button onClick={handleUploadClick} className='flex items-center'>
              <Upload className='mr-2 h-4 w-4' /> 画像をアップロード
            </Button>
            <input
              type='file'
              ref={fileInputRef}
              onChange={handleFileChange}
              accept='image/*'
              className='hidden'
              aria-label='画像をアップロード'
            />
          </div>

          {uploadedImage && (
            <div className='mb-4 rounded-md border p-4'>
              <h2 className='mb-2 text-lg font-semibold'>
                アップロードプレビュー
              </h2>
              <img
                src={uploadedImage}
                alt='アップロードプレビュー'
                className='mb-2 max-w-xs'
              />
              <Button onClick={handleUpload}>ギャラリーに追加</Button>
            </div>
          )}

          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {filteredPhotos.map((photo) => (
              <Dialog key={photo.id}>
                <DialogTrigger asChild>
                  <Button
                    variant='ghost'
                    className='aspect-square h-auto w-full p-0'
                  >
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className='h-full w-full rounded-md object-cover'
                      loading='lazy'
                    />
                  </Button>
                </DialogTrigger>
                <DialogContent className='max-w-3xl'>
                  <DialogHeader>
                    <DialogTitle>{photo.caption}</DialogTitle>
                    <DialogDescription>
                      アルバム:
                      <div className='mt-2 flex flex-wrap gap-2'>
                        {photo.albumIds.map((id) => {
                          const album = albums.find((a) => a.id === id);
                          return (
                            album && (
                              <Badge
                                key={id}
                                variant='secondary'
                                className='flex items-center gap-1'
                              >
                                {album.name}
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='h-4 w-4 p-0'
                                  onClick={() =>
                                    handleRemoveAlbum(photo.id, id)
                                  }
                                >
                                  <X className='h-3 w-3' />
                                  <span className='sr-only'>
                                    アルバムから削除
                                  </span>
                                </Button>
                              </Badge>
                            )
                          );
                        })}
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className='h-auto max-h-[60vh] w-full object-contain'
                  />
                  <DialogFooter className='flex-col items-start gap-4 sm:justify-start'>
                    <div className='flex w-full items-center gap-2'>
                      <Label htmlFor={`caption-${photo.id}`} className='w-20'>
                        キャプション:
                      </Label>
                      <Input
                        id={`caption-${photo.id}`}
                        value={editingCaption}
                        onChange={(e) => setEditingCaption(e.target.value)}
                        placeholder='キャプションを入力'
                        className='flex-grow'
                      />
                      <Button
                        onClick={() =>
                          handleUpdateCaption(photo.id, editingCaption)
                        }
                      >
                        更新
                      </Button>
                    </div>
                    <Select
                      onValueChange={(value) =>
                        handleAddAlbum(photo.id, Number(value))
                      }
                    >
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='アルバムを追加' />
                      </SelectTrigger>
                      <SelectContent>
                        {albums.slice(1).map((album) => (
                          <SelectItem
                            key={album.id}
                            value={album.id.toString()}
                          >
                            {album.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          {loading && <p className='mt-4 text-center'>読み込み中...</p>}

          <div ref={loader} />
        </TabsContent>
        <TabsContent value='albums'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {albums.slice(1).map((album) => (
              <Card key={album.id}>
                <CardHeader>
                  <CardTitle>{album.name}</CardTitle>
                  <CardDescription>
                    {
                      photos.filter((photo) =>
                        photo.albumIds.includes(album.id),
                      ).length
                    }{' '}
                    枚の写真
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex aspect-square items-center justify-center rounded-md bg-gray-200'>
                    {photos.find((photo) =>
                      photo.albumIds.includes(album.id),
                    ) ? (
                      <img
                        src={
                          photos.find((photo) =>
                            photo.albumIds.includes(album.id),
                          )?.src
                        }
                        alt={`${album.name}のサムネイル`}
                        className='h-full w-full rounded-md object-cover'
                      />
                    ) : (
                      <ImageIcon className='h-12 w-12 text-gray-400' />
                    )}
                  </div>
                </CardContent>
                <CardFooter className='flex justify-between'>
                  <Button
                    variant='outline'
                    onClick={() => handleEditAlbum(album)}
                  >
                    <Edit2 className='mr-2 h-4 w-4' />
                    編集
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => handleDeleteAlbum(album.id)}
                  >
                    <Trash2 className='mr-2 h-4 w-4' />
                    削除
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog
        open={isCreateAlbumDialogOpen}
        onOpenChange={setIsCreateAlbumDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAlbum ? 'アルバムを編集' : '新しいアルバムを作成'}
            </DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                アルバム名
              </Label>
              <Input
                id='name'
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={editingAlbum ? handleSaveAlbum : handleCreateAlbum}
            >
              {editingAlbum ? '保存' : '作成'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
