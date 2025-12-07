import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowRight } from 'lucide-react';

interface AddToCartDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productName: string;
    quantity: number;
    onViewCart: () => void;
    onCheckout: () => void;
}

const AddToCartDialog: React.FC<AddToCartDialogProps> = ({
    open,
    onOpenChange,
    productName,
    quantity,
    onViewCart,
    onCheckout,
}) => {
    const handleViewCart = () => {
        onOpenChange(false);
        onViewCart();
    };

    const handleCheckout = () => {
        onOpenChange(false);
        onCheckout();
    };

    const handleContinueShopping = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 mx-auto mb-4">
                        <ShoppingCart className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <DialogTitle className="text-center">Added to Cart!</DialogTitle>
                    <DialogDescription className="text-center">
                        <span className="font-medium">{productName}</span>
                        {quantity > 1 && (
                            <span className="text-muted-foreground"> (x{quantity})</span>
                        )}
                        <br />
                        has been added to your cart.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex-col sm:flex-col gap-2 mt-4">
                    <Button
                        onClick={handleCheckout}
                        className="w-full"
                        size="lg"
                    >
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <Button
                        onClick={handleViewCart}
                        variant="outline"
                        className="w-full"
                        size="lg"
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        View Cart
                    </Button>

                    <Button
                        onClick={handleContinueShopping}
                        variant="ghost"
                        className="w-full"
                    >
                        Continue Shopping
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddToCartDialog;
