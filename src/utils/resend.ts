import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendCheckoutEmail = async (email: string): Promise<void> => {
//   const itemsList = cart.items.map(item => 
//     `<li>${item.product.name} - Quantity: ${item.quantity} - Price: $${(item.product.price * item.quantity).toFixed(2)}</li>`
//   ).join('');

  await resend.emails.send({
    from: 'mail@auth5.ajaymandal.me',
    to: email,
    subject: 'Your Order Confirmation',
    html: `
      <h1>Thank you for your order!</h1>
    `
  });
};


