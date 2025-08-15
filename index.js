require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const USDT_ADDRESS = process.env.USDT_ADDRESS;
const FROM_ADDRESS = process.env.FROM_ADDRESS;

const USDT_ABI = [
  "function transferFrom(address from, address to, uint256 value) external returns (bool)"
];

const usdtContract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);

app.post('/transfer', async (req, res) => {
  try {
    const { to, amount } = req.body;

    const value = ethers.parseUnits(amount.toString(), 6);
    const tx = await usdtContract.transferFrom(FROM_ADDRESS, to, value);
    await tx.wait();

    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
