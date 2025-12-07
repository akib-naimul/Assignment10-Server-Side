const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// ---------- Middlewares ----------
app.use(
  cors({
    // ✅ Allow any origin during development (this fixes 5173/5174 issues)
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// ---------- MongoDB setup ----------
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const dbName = process.env.DB_NAME || "pawmartDB";
    const db = client.db(dbName);

    const listingsCollection = db.collection("listings");
    const ordersCollection = db.collection("orders");

    console.log(`✅ Connected to MongoDB database: ${dbName}`);

    // ----- Seed initial listings (only once) -----
    const count = await listingsCollection.estimatedDocumentCount();
    if (count === 0) {
      const sampleListings = [
        {
          name: "Golden Retriever Puppy",
          category: "Pets",
          price: 0,
          location: "Dhaka",
          description:
            "Friendly 2-month-old puppy looking for a loving family.",
          image:
            "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "owner1@pawmart.com",
          date: "2025-10-27",
        },
        {
          name: "Persian Cat (Adult)",
          category: "Pets",
          price: 0,
          location: "Chattogram",
          description:
            "Calm indoor Persian cat, vaccinated and litter trained.",
          image:
            "https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "owner2@pawmart.com",
          date: "2025-11-03",
        },
        {
          name: "Dog Kibble Large Breed 10kg",
          category: "Food",
          price: 3200,
          location: "Dhaka",
          description:
            "Balanced dry food for large breed adult dogs, chicken flavor.",
          image:
            "https://images.pexels.com/photos/5731923/pexels-photo-5731923.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "shop1@pawmart.com",
          date: "2025-10-30",
        },
        {
          name: "Cat Wet Food Tuna Pack",
          category: "Food",
          price: 980,
          location: "Sylhet",
          description:
            "Pack of 6 tuna cans, suitable for adult cats of all breeds.",
          image:
            "https://images.pexels.com/photos/7310225/pexels-photo-7310225.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "shop2@pawmart.com",
          date: "2025-11-01",
        },
        {
          name: "Rope Chew Toy",
          category: "Accessories",
          price: 350,
          location: "Dhaka",
          description:
            "Durable rope toy for medium-sized dogs, helps reduce boredom.",
          image:
            "https://images.pexels.com/photos/5731905/pexels-photo-5731905.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "shop1@pawmart.com",
          date: "2025-10-29",
        },
        {
          name: "Cat Scratching Post",
          category: "Accessories",
          price: 1800,
          location: "Khulna",
          description:
            "Sturdy scratching post to protect your furniture from scratches.",
          image:
            "https://images.pexels.com/photos/6869681/pexels-photo-6869681.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "shop3@pawmart.com",
          date: "2025-10-31",
        },
        {
          name: "Dog Bed Medium Size",
          category: "Accessories",
          price: 2300,
          location: "Dhaka",
          description:
            "Soft and washable dog bed suitable for medium breeds.",
          image:
            "https://images.pexels.com/photos/5731869/pexels-photo-5731869.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "shop4@pawmart.com",
          date: "2025-11-02",
        },
        {
          name: "Pet Shampoo Hypoallergenic",
          category: "Care Products",
          price: 650,
          location: "Dhaka",
          description:
            "Gentle shampoo suitable for dogs and cats with sensitive skin.",
          image:
            "https://images.pexels.com/photos/5731946/pexels-photo-5731946.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "shop2@pawmart.com",
          date: "2025-11-05",
        },
        {
          name: "Tick & Flea Collar",
          category: "Care Products",
          price: 540,
          location: "Rajshahi",
          description:
            "Protects dogs from ticks and fleas for up to 8 weeks.",
          image:
            "https://images.pexels.com/photos/5731915/pexels-photo-5731915.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "shop5@pawmart.com",
          date: "2025-11-06",
        },
        {
          name: "German Shepherd Puppy",
          category: "Pets",
          price: 0,
          location: "Dhaka",
          description:
            "Healthy 3-month-old puppy, vaccinated and active.",
          image:
            "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "owner3@pawmart.com",
          date: "2025-11-10",
        },
        {
          name: "Parrot Cage with Stand",
          category: "Accessories",
          price: 5200,
          location: "Chattogram",
          description:
            "Spacious cage suitable for medium-sized parrots with perch.",
          image:
            "https://images.pexels.com/photos/5726979/pexels-photo-5726979.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "shop6@pawmart.com",
          date: "2025-11-12",
        },
        {
          name: "Kitten Starter Pack",
          category: "Care Products",
          price: 1500,
          location: "Dhaka",
          description:
            "Includes litter, small toy, bowl and grooming brush.",
          image:
            "https://images.pexels.com/photos/6869639/pexels-photo-6869639.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "shop4@pawmart.com",
          date: "2025-11-14",
        },
        {
          name: "Adult Cat Adoption",
          category: "Pets",
          price: 0,
          location: "Sylhet",
          description:
            "Calm 4-year-old cat, already neutered and vaccinated.",
          image:
            "https://images.pexels.com/photos/6869639/pexels-photo-6869639.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "owner4@pawmart.com",
          date: "2025-11-15",
        },
        {
          name: "Puppy Training Pads Pack",
          category: "Care Products",
          price: 900,
          location: "Dhaka",
          description:
            "Absorbent training pads for house-training young puppies.",
          image:
            "https://images.pexels.com/photos/5731921/pexels-photo-5731921.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "shop7@pawmart.com",
          date: "2025-11-16",
        },
        {
          name: "Cat Toy Set (3 pcs)",
          category: "Accessories",
          price: 420,
          location: "Khulna",
          description:
            "Interactive toy set to keep indoor cats active and engaged.",
          image:
            "https://images.pexels.com/photos/6869682/pexels-photo-6869682.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "shop4@pawmart.com",
          date: "2025-11-18",
        },
        {
          name: "Rabbit Hutch Outdoor",
          category: "Accessories",
          price: 6400,
          location: "Chattogram",
          description:
            "Wooden outdoor hutch with waterproof roof and feeder.",
          image:
            "https://images.pexels.com/photos/4588025/pexels-photo-4588025.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "shop8@pawmart.com",
          date: "2025-11-20",
        },
        {
          name: "Fish Food Flakes 500g",
          category: "Food",
          price: 550,
          location: "Rajshahi",
          description:
            "Nutritious flakes suitable for most tropical aquarium fish.",
          image:
            "https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "shop9@pawmart.com",
          date: "2025-11-22",
        },
        {
          name: "Shih Tzu Puppy",
          category: "Pets",
          price: 0,
          location: "Dhaka",
          description:
            "Playful indoor puppy, good with families and children.",
          image:
            "https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "owner5@pawmart.com",
          date: "2025-11-23",
        },
        {
          name: "Cat Litter 10L",
          category: "Care Products",
          price: 780,
          location: "Sylhet",
          description:
            "Clumping litter with low dust and mild fresh scent.",
          image:
            "https://images.pexels.com/photos/5731920/pexels-photo-5731920.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "shop2@pawmart.com",
          date: "2025-11-25",
        },
        {
          name: "Dog Harness Medium",
          category: "Accessories",
          price: 690,
          location: "Dhaka",
          description:
            "Comfort-fit harness suitable for daily walks and training.",
          image:
            "https://images.pexels.com/photos/4588011/pexels-photo-4588011.jpeg?auto=compress&cs=tinysrgb&w=1200",
          email: "shop10@pawmart.com",
          date: "2025-11-26",
        },
      ];

      await listingsCollection.insertMany(sampleListings);
      console.log("🌱 Seeded sample listings into MongoDB");
    }

    // ---------- ROUTES ----------

    // Health check
    app.get("/", (req, res) => {
      res.send("PawMart server is running");
    });

    // GET /listings?limit=&category=&email=
    app.get("/listings", async (req, res) => {
      try {
        const { limit, category, email } = req.query;
        const query = {};

        if (category) query.category = category;
        if (email) query.email = email;

        let cursor = listingsCollection.find(query).sort({ _id: -1 });

        if (limit) {
          const parsed = parseInt(limit);
          if (!isNaN(parsed)) {
            cursor = cursor.limit(parsed);
          }
        }

        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch listings" });
      }
    });

    // GET /listings/:id
    app.get("/listings/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await listingsCollection.findOne(query);
        if (!result) {
          return res.status(404).send({ message: "Listing not found" });
        }
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch listing" });
      }
    });

    // POST /listings
    app.post("/listings", async (req, res) => {
      try {
        const payload = req.body;
        payload.createdAt = new Date();
        const result = await listingsCollection.insertOne(payload);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to create listing" });
      }
    });

    // PUT /listings/:id
    app.put("/listings/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updateData = req.body;

        const result = await listingsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to update listing" });
      }
    });

    // DELETE /listings/:id
    app.delete("/listings/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await listingsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to delete listing" });
      }
    });

    

    // GET /orders?email=
    app.get("/orders", async (req, res) => {
      try {
        const { email } = req.query;
        const query = {};
        if (email) query.email = email;

        const result = await ordersCollection
          .find(query)
          .sort({ _id: -1 })
          .toArray();

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch orders" });
      }
    });

    // POST /orders
    app.post("/orders", async (req, res) => {
      try {
        const payload = req.body;
        payload.createdAt = new Date();
        const result = await ordersCollection.insertOne(payload);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to create order" });
      }
    });

    // GET /orders/:id
    app.get("/orders/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await ordersCollection.findOne({
          _id: new ObjectId(id),
        });
        if (!result) {
          return res.status(404).send({ message: "Order not found" });
        }
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to fetch order" });
      }
    });

    // DELETE /orders/:id
    app.delete("/orders/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await ordersCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to delete order" });
      }
    });

    // Ping
    await db.command({ ping: 1 });
    console.log("✅ Pinged MongoDB successfully");
  } catch (err) {
    console.error("❌ Mongo connection error:", err);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`🚀 PawMart server is running on port ${port}`);
});
