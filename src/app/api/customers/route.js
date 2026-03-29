import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
<<<<<<< HEAD
import Customer from '@/models/Customer';
=======
import Customer from '@/models/Customer.js';
>>>>>>> c8966dd (update)

// GET all customers
export async function GET() {
  try {
    await connectDB();
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

// POST a new customer
export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    const customer = await Customer.create(body);
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}