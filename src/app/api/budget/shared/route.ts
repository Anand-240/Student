import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import SharedExpense from '@/models/SharedExpense';
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
    const { desc, amount, paidBy, splitWith, splitType, impactAmount } = body;

    // simplistic validation
    if (!desc || !amount || !paidBy || !splitWith) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sharedExpense = await SharedExpense.create({
      user: new mongoose.Types.ObjectId(userIdStr),
      desc,
      amount,
      paidBy,
      splitWith,
      splitType: splitType || 'Equally',
      impactAmount,
    });

    return NextResponse.json({ success: true, sharedExpense });
  } catch (error) {
    console.error('Shared expense POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}