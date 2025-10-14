'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { UserPlus, Edit, Trash2, Loader2, Search } from 'lucide-react';
import { getRoleLabel } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema, type UserInput } from '@/lib/validations';

export default function UsersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`/api/users?${params}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UserInput>({
    resolver: zodResolver(userSchema),
  });

  const createMutation = useMutation({
    mutationFn: async (data: UserInput) => {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create user');
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Berhasil',
        description: 'User berhasil dibuat',
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsDialogOpen(false);
      reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UserInput }) => {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update user');
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Berhasil',
        description: 'User berhasil diupdate',
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsDialogOpen(false);
      setEditingUser(null);
      reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Berhasil',
        description: 'User berhasil dihapus',
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setValue('name', user.name);
    setValue('email', user.email);
    setValue('role', user.role);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus user ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: UserInput) => {
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h2>
          <p className="text-muted-foreground">
            Kelola akun pengguna sistem
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingUser(null); reset(); }}>
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Edit User' : 'Tambah User Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingUser ? 'Update informasi user' : 'Buat akun user baru'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  onValueChange={(value) => setValue('role', value as any)}
                  defaultValue={editingUser?.role}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                    <SelectItem value="ADMIN">Admin Sekolah</SelectItem>
                    <SelectItem value="TEACHER">Guru</SelectItem>
                    <SelectItem value="STUDENT">Siswa</SelectItem>
                    <SelectItem value="PARENT">Orang Tua</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              {!editingUser && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" {...register('password')} />
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>
            Semua pengguna yang terdaftar di sistem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}

          {users && users.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleLabel(user.role)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                        }`}
                      >
                        {user.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {users && users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada user ditemukan
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
