import jsPDF from "jspdf";
import { Order } from "../../Store/api/ordersApi.ts";

export function generateOrderInvoicePdf(order: Order): void {
  const doc = new jsPDF();
  let y = 20;

  const line = (text: string) => {
    doc.text(text, 10, y);
    y += 10;
  };

  line(`Invoice - Order #${order.id}`);
  line(`Date: ${order.createdAt || "N/A"}`);
  line(`Customer: ${order.customerName || "N/A"}`);
  line(`Email: ${order.customerEmail || "N/A"}`);
  line(`Shipping Address: ${order.shippingAddress || "N/A"}`);
  line(`Payment Status: ${order.paymentStatus || "N/A"}`);
  line(`Fulfillment Status: ${order.fulfillmentStatus || "N/A"}`);

  y += 5;
  line("Items:");
  order.items.forEach((item) => {
    line(
      `- ${item.name} | Qty: ${item.quantity} | Price: $${item.price} | Total: $${(
        item.price * item.quantity
      ).toFixed(2)}`,
    );
  });

  y += 5;
  line(`Subtotal: $${order.subtotal}`);
  line(`Tax: $${order.tax}`);
  line(`Shipping: $${order.shipping}`);
  line(`Total Amount: $${order.totalAmount}`);

  doc.save(`invoice-order-${order.id}.pdf`);
}
