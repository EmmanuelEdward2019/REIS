import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Award, Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

interface Certification {
  id: string;
  name: string;
  count: number;
  totalPartners: number;
  description?: string;
}

const PartnerCertificationsManager: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('partner_certifications')
        .select('*')
        .order('name');

      if (error) throw error;

      // Get count of partners with each certification
      const certificationsWithCounts = await Promise.all(
        (data || []).map(async (cert) => {
          const { count } = await supabase
            .from('partner_certification_records')
            .select('*', { count: 'exact', head: true })
            .eq('certification_id', cert.id)
            .eq('status', 'active');

          return {
            id: cert.id,
            name: cert.name,
            count: count || 0,
            totalPartners: 89, // This should be fetched from partner_applications
            description: cert.description || undefined
          };
        })
      );

      setCertifications(certificationsWithCounts);
    } catch (error: any) {
      console.error('Error fetching certifications:', error);
      toast.error('Failed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCert, setNewCert] = useState({ name: '', description: '' });

  const handleAddCertification = async () => {
    if (!newCert.name.trim()) {
      toast.error('Certification name is required');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('partner_certifications')
        .insert([{
          name: newCert.name,
          description: newCert.description || null
        }])
        .select()
        .single();

      if (error) throw error;

      const newCertification: Certification = {
        id: data.id,
        name: data.name,
        count: 0,
        totalPartners: 89,
        description: data.description || undefined,
      };

      const certName = newCert.name;
      setNewCert({ name: '', description: '' });
      setIsAddDialogOpen(false);
      toast.success(`Certification "${certName}" added successfully`);
      fetchCertifications();
    } catch (error: any) {
      console.error('Error adding certification:', error);
      toast.error(error.message || 'Failed to add certification');
    }
  };

  const handleDeleteCertification = async (id: string) => {
    const cert = certifications.find(c => c.id === id);
    if (!cert) return;

    if (!confirm(`Are you sure you want to delete "${cert.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('partner_certifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success(`Certification "${cert.name}" deleted successfully`);
      fetchCertifications();
    } catch (error: any) {
      console.error('Error deleting certification:', error);
      toast.error(error.message || 'Failed to delete certification');
    }
  };

  const handleEditCertification = (id: string, field: 'name' | 'description', value: string) => {
    setCertifications(certifications.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const handleSaveEdit = async (id: string) => {
    const cert = certifications.find(c => c.id === id);
    if (!cert) return;

    try {
      const { error } = await supabase
        .from('partner_certifications')
        .update({
          name: cert.name,
          description: cert.description || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setEditingId(null);
      toast.success(`Certification "${cert.name}" updated successfully`);
      fetchCertifications();
    } catch (error: any) {
      console.error('Error updating certification:', error);
      toast.error(error.message || 'Failed to update certification');
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Partner Certifications Management
            </CardTitle>
            <CardDescription>
              Manage certification types that partners can hold
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Certification</DialogTitle>
                <DialogDescription>
                  Add a new certification type that partners can obtain
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="cert-name">Certification Name *</Label>
                  <Input
                    id="cert-name"
                    placeholder="e.g., ISO 27001"
                    value={newCert.name}
                    onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cert-description">Description</Label>
                  <Input
                    id="cert-description"
                    placeholder="Brief description of the certification"
                    value={newCert.description}
                    onChange={(e) => setNewCert({ ...newCert, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCertification}>
                  Add Certification
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Total Certification Types</div>
              <div className="text-2xl font-bold">{certifications.length}</div>
            </div>
            <div className="border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Total Partners</div>
              <div className="text-2xl font-bold">89</div>
            </div>
            <div className="border border-border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Avg Certifications/Partner</div>
              <div className="text-2xl font-bold">
                {(certifications.reduce((sum, cert) => sum + cert.count, 0) / 89).toFixed(1)}
              </div>
            </div>
          </div>

          {/* Certifications Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certification Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Partners with Cert</TableHead>
                  <TableHead className="text-center">Coverage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certifications.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell>
                      {editingId === cert.id ? (
                        <Input
                          value={cert.name}
                          onChange={(e) => handleEditCertification(cert.id, 'name', e.target.value)}
                          className="h-8"
                        />
                      ) : (
                        <div className="font-medium">{cert.name}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === cert.id ? (
                        <Input
                          value={cert.description || ''}
                          onChange={(e) => handleEditCertification(cert.id, 'description', e.target.value)}
                          className="h-8"
                        />
                      ) : (
                        <div className="text-sm text-muted-foreground">{cert.description || '-'}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{cert.count}/{cert.totalPartners}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={cert.count / cert.totalPartners > 0.7 ? 'default' : 'secondary'}>
                        {Math.round((cert.count / cert.totalPartners) * 100)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === cert.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSaveEdit(cert.id)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingId(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingId(cert.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteCertification(cert.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {certifications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No certifications added yet. Click "Add Certification" to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerCertificationsManager;

