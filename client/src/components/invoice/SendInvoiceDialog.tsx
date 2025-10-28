import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Mail, Loader2 } from 'lucide-react';
import type { InvoiceConfig } from '../../../../shared/invoice-types';

interface SendInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  config: InvoiceConfig;
  onSend: (to: string, cc: string, message: string) => Promise<void>;
}

export default function SendInvoiceDialog({
  isOpen,
  onClose,
  config,
  onSend,
}: SendInvoiceDialogProps) {
  const [to, setTo] = useState(config.clientEmail);
  const [cc, setCc] = useState('');
  const [message, setMessage] = useState(
    `Dear ${config.clientName || 'Client'},\n\nPlease find attached the invoice for your review.\n\nThank you for your business.\n\nBest regards,\n${config.companyName}`
  );
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!to) return;
    
    setIsSending(true);
    try {
      await onSend(to, cc, message);
      onClose();
    } catch (error) {
      console.error('Failed to send invoice:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Invoice to Client
          </DialogTitle>
          <DialogDescription>
            The invoice PDF will be automatically attached to the email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="to">To (Client Email) *</Label>
            <Input
              id="to"
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="client@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="cc">CC (Optional)</Label>
            <Input
              id="cc"
              type="text"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="cc1@example.com, cc2@example.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Separate multiple email addresses with commas
            </p>
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              placeholder="Enter your message to the client..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!to || isSending}>
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Invoice
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
