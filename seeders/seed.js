const { sequelize, Product, Admin } = require('../models');
const bcrypt = require('bcrypt');

const dummyProducts = [
  {
    name: 'Kaos Polos Cotton Combed',
    description: 'Bahan adem, cocok sehari-hari',
    price: 75000,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'
  },
  {
    name: 'Kemeja Flanel',
    description: 'Motif kotak-kotak, bahan tebal',
    price: 150000,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500'
  },
  {
    name: 'Celana Chino Slim Fit',
    description: 'Warna khaki, bahan stretch',
    price: 180000,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500'
  },
  {
    name: 'Jaket Denim Oversize',
    description: 'Gaya casual, bahan levis tebal',
    price: 250000,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500'
  },
  {
    name: 'Hoodie Oversize Hitam',
    description: 'Bahan fleece hangat dan nyaman',
    price: 210000,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500'
  },
  {
    name: 'Sepatu Sneaker White',
    description: 'Desain simpel, cocok untuk jalan-jalan',
    price: 320000,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'
  }
];

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Koneksi database berhasil');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await Admin.create({
      username: 'admin',
      password: hashedPassword
    });
    console.log('Admin siap: admin');

    await Product.bulkCreate(dummyProducts);
    console.log('Produk dummy berhasil ditambahin');

    console.log('\nSeeding selesai ✅');
    process.exit(0);
  } catch (error) {
    console.error('Gagal melakukan seeding:', error);
    process.exit(1);
  }
}

seed();