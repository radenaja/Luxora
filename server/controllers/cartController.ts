import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../db/prisma';

export const getCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Tidak diizinkan' });
      return;
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true
      }
    });

    // Format output to match client expectation: { product: Product, quantity: number }
    const formattedCart = cartItems.map(item => ({
      product: {
        ...item.product,
        images: JSON.parse(item.product.images),
        features: JSON.parse(item.product.features),
        specs: JSON.parse(item.product.specs),
      },
      quantity: item.quantity
    }));

    res.status(200).json(formattedCart);
  } catch (error: any) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Gagal mengambil data keranjang belanja', error: error.message });
  }
};

export const addToCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId, quantity = 1 } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Tidak diizinkan' });
      return;
    }

    if (!productId) {
      res.status(400).json({ message: 'Product ID wajib diisi' });
      return;
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      res.status(404).json({ message: 'Produk tidak ditemukan' });
      return;
    }

    // Upsert the cart item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId
        }
      },
      update: {
        quantity: {
          increment: quantity
        }
      },
      create: {
        userId,
        productId,
        quantity
      },
      include: {
        product: true
      }
    });

    res.status(201).json({
      message: 'Produk berhasil ditambahkan ke keranjang',
      item: {
        product: {
          ...cartItem.product,
          images: JSON.parse(cartItem.product.images),
          features: JSON.parse(cartItem.product.features),
          specs: JSON.parse(cartItem.product.specs),
        },
        quantity: cartItem.quantity
      }
    });
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Gagal menambahkan produk ke keranjang', error: error.message });
  }
};

export const updateCartItem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Tidak diizinkan' });
      return;
    }

    if (quantity === undefined || quantity === null) {
      res.status(400).json({ message: 'Quantity wajib diisi' });
      return;
    }

    if (quantity <= 0) {
      // Delete if quantity is 0 or negative
      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId,
            productId
          }
        }
      });
      res.status(200).json({ message: 'Produk berhasil dihapus dari keranjang' });
      return;
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId
        }
      },
      data: {
        quantity
      },
      include: {
        product: true
      }
    });

    res.status(200).json({
      message: 'Keranjang belanja berhasil diupdate',
      item: {
        product: {
          ...updatedItem.product,
          images: JSON.parse(updatedItem.product.images),
          features: JSON.parse(updatedItem.product.features),
          specs: JSON.parse(updatedItem.product.specs),
        },
        quantity: updatedItem.quantity
      }
    });
  } catch (error: any) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Gagal mengupdate item keranjang belanja', error: error.message });
  }
};

export const removeFromCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;

    if (!userId) {
      res.status(401).json({ message: 'Tidak diizinkan' });
      return;
    }

    await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    res.status(200).json({ message: 'Produk berhasil dihapus dari keranjang' });
  } catch (error: any) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Gagal menghapus produk dari keranjang', error: error.message });
  }
};

export const clearCart = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Tidak diizinkan' });
      return;
    }

    await prisma.cartItem.deleteMany({
      where: { userId }
    });

    res.status(200).json({ message: 'Keranjang belanja berhasil dikosongkan' });
  } catch (error: any) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Gagal mengosongkan keranjang belanja', error: error.message });
  }
};
