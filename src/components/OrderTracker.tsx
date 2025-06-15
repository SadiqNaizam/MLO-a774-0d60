import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, Package, Truck, UtensilsCrossed } from 'lucide-react'; // Example icons

interface OrderStatus {
  id: string;
  name: string;
  date?: string;
  completed: boolean;
  icon?: React.ElementType;
}

interface OrderTrackerProps {
  statuses: OrderStatus[];
  currentStatusId: string;
  orderNumber?: string;
  estimatedDelivery?: string;
}

const defaultStatuses: OrderStatus[] = [
  { id: 'placed', name: 'Order Placed', icon: CheckCircle, completed: false },
  { id: 'confirmed', name: 'Order Confirmed', icon: Package, completed: false },
  { id: 'preparing', name: 'Preparing Food', icon: UtensilsCrossed, completed: false },
  { id: 'out_for_delivery', name: 'Out for Delivery', icon: Truck, completed: false },
  { id: 'delivered', name: 'Delivered', icon: CheckCircle, completed: false },
];

const OrderTracker: React.FC<OrderTrackerProps> = ({
  statuses: propStatuses,
  currentStatusId,
  orderNumber,
  estimatedDelivery,
}) => {
  console.log("Rendering OrderTracker, current status:", currentStatusId);

  const activeIndex = propStatuses.findIndex(s => s.id === currentStatusId);
  const displayStatuses = propStatuses.map((status, index) => ({
    ...status,
    completed: index <= activeIndex,
    icon: status.icon || Circle, // Fallback icon
  }));


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          {orderNumber ? `Order #${orderNumber}` : 'Order Status'}
        </CardTitle>
        {estimatedDelivery && <p className="text-sm text-gray-600">Estimated Delivery: {estimatedDelivery}</p>}
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-4 sm:left-5 top-2 bottom-2 w-0.5 bg-gray-200 hidden sm:block" aria-hidden="true"></div>

          <ul className="space-y-6 sm:space-y-8">
            {displayStatuses.map((status, index) => {
              const IconComponent = status.icon as React.ElementType;
              const isActive = status.id === currentStatusId;
              const isCompleted = status.completed;

              return (
                <li key={status.id} className="flex items-start sm:items-center space-x-3 sm:space-x-4">
                  <div className={`relative z-10 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full
                    ${isCompleted ? (isActive ? 'bg-orange-500 ring-4 ring-orange-200' : 'bg-green-500') : 'bg-gray-300'}
                    flex-shrink-0`}>
                    <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${isCompleted ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-grow pt-0.5 sm:pt-0">
                    <p className={`font-medium ${isActive ? 'text-orange-600' : (isCompleted ? 'text-gray-800' : 'text-gray-500')}`}>
                      {status.name}
                    </p>
                    {status.date && <p className="text-xs text-gray-500">{status.date}</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

// Example usage:
// const MyOrderPage = () => {
//   const statuses = [
//     { id: 'placed', name: 'Order Placed', icon: CheckCircle },
//     { id: 'confirmed', name: 'Order Confirmed', icon: Package },
//     { id: 'preparing', name: 'Preparing Food', icon: UtensilsCrossed },
//     { id: 'out_for_delivery', name: 'Out for Delivery', icon: Truck },
//     { id: 'delivered', name: 'Delivered', icon: CheckCircle },
//   ];
//   return <OrderTracker statuses={statuses} currentStatusId="preparing" orderNumber="12345XYZ" estimatedDelivery="7:30 PM" />;
// }

export default OrderTracker;