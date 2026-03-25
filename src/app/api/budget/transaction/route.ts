import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    let userIdStr = '000000000000000000000000';
    const token = req.cookies.get('token')?.value;
    if (token) {
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || '1234567890');
        userIdStr = decoded.userId;
      } catch (err) {
        // ignore invalid token, keep fallback
      }
    }

    const body = await req.json();
    const { desc, amount, category, type } = body;

    if (!desc || !amount || !category || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transaction = await Transaction.create({
      user: new mongoose.Types.ObjectId(userIdStr),
      desc,
      amount,
      category,
      type,
    });

    return NextResponse.json({ success: true, transaction });
  } catch (error) {
    console.error('Transaction POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}