import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Budget from '@/models/Budget';
import Transaction from '@/models/Transaction';
import SharedExpense from '@/models/SharedExpense';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    let userIdStr = '000000000000000000000000'; // Fallback
    const token = req.cookies.get('token')?.value;
    if (token) {
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || '1234567890');
        userIdStr = decoded.userId;
      } catch (err) {
        // ignore invalid token, keep fallback
      }
    }

    const userId = new mongoose.Types.ObjectId(userIdStr);

    let budget = await Budget.findOne({ user: userId });
    if (!budget) {
      budget = await Budget.create({ user: userId, monthlyTarget: 20000 });
    }

    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });
    const sharedExpenses = await SharedExpense.find({ user: userId }).sort({ date: -1 });

    return NextResponse.json({
      success: true,
      budget,
      transactions,
      sharedExpenses
    });
  } catch (error) {
    console.error('Budget GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}