import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Visit from '../models/Visit.js';

export const seedDatabase = async () => {
  try {
    // Seed Admin User
    const adminCount = await User.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Rushi@200694', 10);
      await User.create({
        name: 'KBD Admin',
        email: process.env.ADMIN_EMAIL || 'rushikeshpatil4850@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user seeded');
    }

    // Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const sampleProducts = [
        {
          name: 'KBD Super Organic Fertilizer',
          category: 'Fertilizers',
          shortDescription: 'Premium organic fertilizer for all crops. Boosts plant growth naturally with essential nutrients and microbes.',
          longDescription: 'KBD Super Organic Fertilizer is a scientifically formulated blend of natural organic matter, beneficial microorganisms, and essential plant nutrients. Suitable for all types of crops including vegetables, fruits, and cereals. Improves soil health over time and promotes sustainable farming practices.',
          prices: [{ quantity: 1, unit: 'kg', price: 150 }, { quantity: 5, unit: 'kg', price: 650 }, { quantity: 25, unit: 'kg', price: 2800 }],
          images: [],
          ratings: 4.5,
          reviews: 28
        },
        {
          name: 'Multilayer Crop Protection Film',
          category: 'Multilayers',
          shortDescription: 'High-quality agricultural mulch film for weed control and moisture retention in all field conditions.',
          longDescription: 'Our Multilayer Crop Protection Film provides excellent weed suppression, moisture conservation, and soil temperature regulation. Made from high-quality UV-stabilized polyethylene, it is designed for durability in all weather conditions and is suitable for vegetables, fruits, and row crops.',
          prices: [{ quantity: 1, unit: 'kg', price: 220 }, { quantity: 10, unit: 'kg', price: 1900 }],
          images: [],
          ratings: 4.3,
          reviews: 15
        },
        {
          name: 'Ayurvedic Plant Immunity Booster',
          category: 'Ayurvedic Medicines',
          shortDescription: 'Natural Ayurvedic formula to enhance plant immunity and resistance to diseases and pests.',
          longDescription: 'This proprietary Ayurvedic blend combines ancient herbal wisdom with modern agricultural science. Contains neem extract, tulsi, and other potent herbs that naturally boost plant immunity, improve resistance to fungal and bacterial diseases, and promote overall plant health without harmful chemicals.',
          prices: [{ quantity: 500, unit: 'ml', price: 180 }, { quantity: 1, unit: 'litre', price: 320 }, { quantity: 5, unit: 'litre', price: 1400 }],
          images: [],
          ratings: 4.7,
          reviews: 42
        },
        {
          name: 'KBD Herbal Neem Soap',
          category: 'Soaps',
          shortDescription: 'Organic neem soap for personal hygiene and pest control. Safe for farmers, effective against insects.',
          longDescription: 'KBD Herbal Neem Soap is a multi-purpose organic soap made from cold-pressed neem oil and natural herbs. It is perfect for farmers as it provides excellent hygiene after field work while also acting as a natural insect repellent. Free from harmful chemicals and safe for all skin types.',
          prices: [{ quantity: 1, unit: 'piece', price: 45 }, { quantity: 6, unit: 'piece', price: 240 }, { quantity: 12, unit: 'piece', price: 450 }],
          images: [],
          ratings: 4.2,
          reviews: 33
        },
        {
          name: 'Organic Compost Enricher',
          category: 'Organic Products',
          shortDescription: 'Concentrated compost enricher for improving soil fertility and microbial activity.',
          longDescription: 'Our Organic Compost Enricher is a concentrated blend of humic acid, fulvic acid, and beneficial microorganisms. It supercharges any compost or soil with beneficial bacteria and fungi, dramatically improving nutrient availability and soil structure. Ideal for organic farming certification requirements.',
          prices: [{ quantity: 1, unit: 'kg', price: 280 }, { quantity: 5, unit: 'kg', price: 1200 }],
          images: [],
          ratings: 4.6,
          reviews: 19
        },
        {
          name: 'Crop Nutrient Micronutrient Mix',
          category: 'Crop Nutrients',
          shortDescription: 'Complete micronutrient mix for correcting deficiencies in all major crops.',
          longDescription: 'KBD Crop Nutrient Micronutrient Mix is a balanced combination of zinc, boron, manganese, copper, iron, and molybdenum in chelated form for maximum absorption. Corrects multiple micronutrient deficiencies simultaneously, prevents yellowing of leaves, and improves fruit quality and yield.',
          prices: [{ quantity: 250, unit: 'g', price: 120 }, { quantity: 500, unit: 'g', price: 220 }, { quantity: 1, unit: 'kg', price: 400 }],
          images: [],
          ratings: 4.4,
          reviews: 24
        },
        {
          name: 'Bio Pesticide Spray',
          category: 'Pest Control',
          shortDescription: 'Eco-friendly bio-pesticide derived from natural sources for effective pest management.',
          longDescription: 'Our Bio Pesticide Spray is derived from naturally occurring microorganisms and plant extracts that effectively control a wide range of agricultural pests including aphids, whiteflies, thrips, and caterpillars. Safe for beneficial insects, birds, and the environment. Zero pre-harvest interval.',
          prices: [{ quantity: 500, unit: 'ml', price: 250 }, { quantity: 1, unit: 'litre', price: 450 }, { quantity: 5, unit: 'litre', price: 2000 }],
          images: [],
          ratings: 4.1,
          reviews: 37
        },
        {
          name: 'Soil Health Improver',
          category: 'Soil Improvement',
          shortDescription: 'Restore depleted soils and improve water-holding capacity with this natural soil conditioner.',
          longDescription: 'KBD Soil Health Improver is a unique blend of volcanic minerals, organic matter, and beneficial bacteria specifically designed to rehabilitate degraded agricultural soils. It improves soil structure, increases water retention by up to 40%, reduces compaction, and creates ideal conditions for root development.',
          prices: [{ quantity: 5, unit: 'kg', price: 450 }, { quantity: 25, unit: 'kg', price: 1800 }],
          images: [],
          ratings: 4.8,
          reviews: 51
        }
      ];
      await Promise.all(sampleProducts.map(p => Product.create(p)));
      console.log(`✅ ${sampleProducts.length} sample products seeded`);
    }

    // Seed Visits
    const visitCount = await Visit.countDocuments();
    if (visitCount === 0) {
      const sampleVisits = [
        {
          title: 'Organic Farm Visit - Nasik',
          description: 'A comprehensive visit to our partner organic farm in Nasik showcasing sustainable farming practices, composting techniques, and organic product manufacturing.',
          location: 'Nasik, Maharashtra',
          date: '2024-03-15',
          gallery: []
        },
        {
          title: 'Manufacturing Unit Tour - Dhule',
          description: 'Visit our state-of-the-art manufacturing facility in Dhule to see how our agricultural products are made with the highest quality standards.',
          location: 'Dhule, Maharashtra',
          date: '2024-04-10',
          gallery: []
        },
        {
          title: 'Ayurvedic Plant Research Center',
          description: 'Explore our research center dedicated to developing Ayurvedic solutions for modern agricultural challenges. See how traditional knowledge meets scientific innovation.',
          location: 'Pune, Maharashtra',
          date: '2024-05-20',
          gallery: []
        },
        {
          title: 'Farmer Field Day - Jalgaon',
          description: 'Annual farmer field day event in Jalgaon where hundreds of farmers come to learn about new agricultural techniques and product demonstrations.',
          location: 'Jalgaon, Maharashtra',
          date: '2024-06-05',
          gallery: []
        }
      ];
      await Promise.all(sampleVisits.map(v => Visit.create(v)));
      console.log(`✅ ${sampleVisits.length} sample visits seeded`);
    }
  } catch (error) {
    console.error('Seeding error:', error.message);
  }
};
