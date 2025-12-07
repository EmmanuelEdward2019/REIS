import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultInterest?: string;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    interest: string;
    message: string;
}

const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose, defaultInterest = '' }) => {
    const { register, handleSubmit, reset, setValue } = useForm<FormData>({
        defaultValues: {
            interest: defaultInterest
        }
    });

    React.useEffect(() => {
        if (defaultInterest) {
            setValue('interest', defaultInterest);
        }
    }, [defaultInterest, setValue]);

    const onSubmit = async (data: FormData) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('Form submitted:', data);
        toast.success("Request received! We'll get back to you shortly.");
        reset();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Schedule a Consultation</DialogTitle>
                    <DialogDescription>
                        Fill out the form below and our experts will contact you to discuss your project.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" {...register('name', { required: true })} placeholder="John Doe" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" {...register('email', { required: true })} placeholder="john@company.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" {...register('phone')} placeholder="+1 (555) 000-0000" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="interest">Area of Interest</Label>
                        <Select onValueChange={(value) => setValue('interest', value)} defaultValue={defaultInterest}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a topic" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Solar Solutions">Solar Solutions</SelectItem>
                                <SelectItem value="Energy Storage">Energy Storage</SelectItem>
                                <SelectItem value="Marine Energy">Marine Energy</SelectItem>
                                <SelectItem value="Data & AI">Data & AI</SelectItem>
                                <SelectItem value="Software Development">Software Development</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message">Project Details</Label>
                        <Textarea
                            id="message"
                            {...register('message')}
                            placeholder="Tell us a bit about your project requirements..."
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Submit Request</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ConsultationModal;
