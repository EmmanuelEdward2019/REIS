import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import AddToCartDialog from '@/components/cart/AddToCartDialog';

const GlobalAddToCartDialog = () => {
    const navigate = useNavigate();
    const { showAddToCartDialog, addToCartDialogData, setShowAddToCartDialog } = useCart();

    const handleViewCart = () => {
        navigate('/cart');
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (!addToCartDialogData) {
        return null;
    }

    return (
        <AddToCartDialog
            open={showAddToCartDialog}
            onOpenChange={setShowAddToCartDialog}
            productName={addToCartDialogData.productName}
            quantity={addToCartDialogData.quantity}
            onViewCart={handleViewCart}
            onCheckout={handleCheckout}
        />
    );
};

export default GlobalAddToCartDialog;
