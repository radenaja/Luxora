import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../db/prisma';

export const checkout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { shippingAddress, paymentMethod } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Tidak diizinkan' });
      return;
    }

    if (!shippingAddress || !paymentMethod) {
      res.status(400).json({ message: 'Alamat pengiriman dan metode pembayaran wajib diisi' });
      return;
    }

    const { fullName, address, city, postalCode, phone } = shippingAddress;
    if (!fullName || !address || !city || !postalCode || !phone) {
      res.status(400).json({ message: 'Seluruh detail alamat pengiriman wajib diisi' });
      return;
    }

    // 1. Get user's cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true
      }
    });

    if (cartItems.length === 0) {
      res.status(400).json({ message: 'Keranjang belanja kosong, tidak bisa melakukan checkout' });
      return;
    }

    // 2. Calculate total and verify stock
    let total = 0;
    for (const item of cartItems) {
      total += item.product.price * item.quantity;

      if (item.product.stock < item.quantity) {
        res.status(400).json({
          message: `Stok produk "${item.product.name}" tidak mencukupi. Stok tersisa: ${item.product.stock}`
        });
        return;
      }
    }

    // 3. Create Order, OrderItems, reduce stock, and clear cart (Prisma Transaction)
    const order = await prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          fullName,
          address,
          city,
          postalCode,
          phone,
          paymentMethod,
          status: 'Pending'
        }
      });

      // Create OrderItems & update Product stocks
      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }
        });

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId }
      });

      return newOrder;
    });

    // Fetch the completed order with items
    const completedOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!completedOrder) {
      res.status(500).json({ message: 'Gagal memproses pesanan' });
      return;
    }

    // Format output to match CartItem structure for the frontend
    const formattedItems = completedOrder.items.map(item => ({
      product: {
        ...item.product,
        images: JSON.parse(item.product.images),
        features: JSON.parse(item.product.features),
        specs: JSON.parse(item.product.specs),
      },
      quantity: item.quantity
    }));

    const responseOrder = {
      id: completedOrder.id,
      items: formattedItems,
      total: completedOrder.total,
      shippingAddress: {
        fullName: completedOrder.fullName,
        address: completedOrder.address,
        city: completedOrder.city,
        postalCode: completedOrder.postalCode,
        phone: completedOrder.phone,
      },
      paymentMethod: completedOrder.paymentMethod,
      date: completedOrder.createdAt.toISOString(),
      status: completedOrder.status,
    };

    res.status(201).json({
      message: 'Pesanan berhasil dibuat',
      order: responseOrder
    });
  } catch (error: any) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat memproses checkout', error: error.message });
  }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Tidak diizinkan' });
      return;
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedOrders = orders.map(order => ({
      id: order.id,
      items: order.items.map(item => ({
        product: {
          ...item.product,
          images: JSON.parse(item.product.images),
          features: JSON.parse(item.product.features),
          specs: JSON.parse(item.product.specs),
        },
        quantity: item.quantity
      })),
      total: order.total,
      shippingAddress: {
        fullName: order.fullName,
        address: order.address,
        city: order.city,
        postalCode: order.postalCode,
        phone: order.phone,
      },
      paymentMethod: order.paymentMethod,
      date: order.createdAt.toISOString(),
      status: order.status,
    }));

    res.status(200).json(formattedOrders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Gagal mengambil riwayat pesanan', error: error.message });
  }
};
