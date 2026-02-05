import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@globalcity.com' },
    update: {},
    create: {
      email: 'admin@globalcity.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // Create test customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@globalcity.com' },
    update: {},
    create: {
      email: 'customer@globalcity.com',
      name: 'Test Customer',
      password: customerPassword,
      role: 'customer',
    },
  });

  // Create sample products
  const categories = [
    'Bags',
    'Hoodies',
    'T-Shirts',
    'Trousers',
    'Jackets',
    'Boxers',
    'Singlets',
    'Boots',
    'Glasses',
    'Hats',
    'Socks',
    'Gym Wears',
    'Sneakers',
  ];

  const sampleProducts = [
    {
      name: 'Classic Leather Bag',
      description: 'Premium leather bag perfect for everyday use. Durable and stylish design.',
      price: 89.99,
      compareAtPrice: 129.99,
      category: 'Bags',
      sku: 'BAG-001',
      inventory: 50,
      images: JSON.stringify(['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800']),
    },
    {
      name: 'Cotton Hoodie',
      description: 'Comfortable cotton hoodie with modern fit. Perfect for casual wear.',
      price: 49.99,
      compareAtPrice: 69.99,
      category: 'Hoodies',
      sku: 'HOO-001',
      inventory: 100,
      images: JSON.stringify(['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800']),
    },
    {
      name: 'Premium T-Shirt',
      description: 'High-quality cotton t-shirt with classic design. Available in multiple colors.',
      price: 24.99,
      compareAtPrice: 34.99,
      category: 'T-Shirts',
      sku: 'TSH-001',
      inventory: 150,
      images: JSON.stringify(['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800']),
    },
    {
      name: 'Slim Fit Trousers',
      description: 'Modern slim-fit trousers perfect for office or casual wear.',
      price: 59.99,
      compareAtPrice: 79.99,
      category: 'Trousers',
      sku: 'TRO-001',
      inventory: 75,
      images: JSON.stringify(['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800']),
    },
    {
      name: 'Winter Jacket',
      description: 'Warm and stylish winter jacket with water-resistant material.',
      price: 129.99,
      compareAtPrice: 179.99,
      category: 'Jackets',
      sku: 'JAC-001',
      inventory: 40,
      images: JSON.stringify(['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800']),
    },
    {
      name: 'Athletic Sneakers',
      description: 'Comfortable athletic sneakers perfect for sports and daily activities.',
      price: 79.99,
      compareAtPrice: 99.99,
      category: 'Sneakers',
      sku: 'SNE-001',
      inventory: 60,
      images: JSON.stringify(['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800']),
    },
  ];

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
  }

  // Create discount code
  await prisma.discountCode.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minPurchase: 0,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      isActive: true,
    },
  });

  console.log('Seed data created successfully!');
  console.log('Admin credentials:');
  console.log('Email: admin@globalcity.com');
  console.log('Password: admin123');
  console.log('\nCustomer credentials:');
  console.log('Email: customer@globalcity.com');
  console.log('Password: customer123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

