import { useState, useMemo } from 'react';

/**
 * Hook quản lý workflow đơn hàng từ nhận đến hoàn thành
 * Trích xuất từ Chef/OrdersManagement.jsx và Manager/TableDetailsModal.jsx
 */
export function useOrderWorkflow(initialOrders = []) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Thuật toán cập nhật trạng thái đơn hàng
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = {
            ...order,
            status: newStatus,
            statusHistory: [
              ...(order.statusHistory || []),
              {
                status: newStatus,
                timestamp: new Date().toISOString(),
                updatedBy: 'system' // Có thể thay bằng user hiện tại
              }
            ]
          };
          
          // Tự động cập nhật thời gian ước tính
          if (newStatus === 'preparing') {
            updatedOrder.estimatedTime = calculateEstimatedTime(order);
            updatedOrder.startTime = new Date().toISOString();
          } else if (newStatus === 'ready') {
            updatedOrder.readyTime = new Date().toISOString();
            updatedOrder.estimatedTime = 'Ready';
          } else if (newStatus === 'served') {
            updatedOrder.servedTime = new Date().toISOString();
          }
          
          return updatedOrder;
        }
        return order;
      })
    );
  };

  // Thuật toán tính thời gian ước tính hoàn thành
  const calculateEstimatedTime = (order) => {
    const complexityFactors = {
      'appetizer': 5,   // 5 phút
      'soup': 8,        // 8 phút
      'salad': 6,       // 6 phút
      'main': 15,       // 15 phút
      'dessert': 10,    // 10 phút
      'drink': 3        // 3 phút
    };
    
    const baseTime = complexityFactors[order.category] || 10;
    const quantityMultiplier = Math.sqrt(order.quantity || 1); // Không tuyến tính
    const priorityMultiplier = order.priority === 'high' ? 0.8 : 
                              order.priority === 'low' ? 1.2 : 1;
    
    // Tính thêm thời gian dựa trên số đơn đang chuẩn bị
    const preparingOrders = orders.filter(o => o.status === 'preparing').length;
    const queueMultiplier = 1 + (preparingOrders * 0.1);
    
    const estimatedMinutes = Math.round(baseTime * quantityMultiplier * priorityMultiplier * queueMultiplier);
    return `${estimatedMinutes} phút`;
  };

  // Thuật toán xử lý item trong đơn hàng
  const updateOrderItemStatus = (orderId, itemIndex, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId && order.items) {
          const updatedItems = order.items.map((item, index) =>
            index === itemIndex ? { ...item, status: newStatus } : item
          );
          
          // Tự động cập nhật trạng thái đơn hàng dựa trên items
          let orderStatus = order.status;
          const allItemsReady = updatedItems.every(item => item.status === 'ready');
          const allItemsServed = updatedItems.every(item => item.status === 'served');
          
          if (allItemsServed) {
            orderStatus = 'completed';
          } else if (allItemsReady) {
            orderStatus = 'ready';
          } else if (updatedItems.some(item => item.status === 'preparing')) {
            orderStatus = 'preparing';
          }
          
          return {
            ...order,
            items: updatedItems,
            status: orderStatus
          };
        }
        return order;
      })
    );
  };

  // Thuật toán phân loại đơn hàng theo trạng thái
  const categorizedOrders = useMemo(() => {
    return {
      pending: orders.filter(order => order.status === 'pending'),
      preparing: orders.filter(order => order.status === 'preparing'),
      ready: orders.filter(order => order.status === 'ready'),
      served: orders.filter(order => order.status === 'served'),
      completed: orders.filter(order => order.status === 'completed'),
      cancelled: orders.filter(order => order.status === 'cancelled')
    };
  }, [orders]);

  // Thuật toán tính thống kê hiệu suất
  const performanceStats = useMemo(() => {
    const completedOrders = orders.filter(order => 
      order.status === 'completed' && order.startTime && order.servedTime
    );
    
    if (completedOrders.length === 0) {
      return {
        averagePreparationTime: 0,
        onTimeDeliveryRate: 0,
        totalCompletedOrders: 0
      };
    }
    
    // Tính thời gian chuẩn bị trung bình
    const totalPreparationTime = completedOrders.reduce((sum, order) => {
      const start = new Date(order.startTime);
      const served = new Date(order.servedTime);
      return sum + (served - start);
    }, 0);
    
    const averagePreparationTime = Math.round(totalPreparationTime / completedOrders.length / 1000 / 60); // phút
    
    // Tính tỷ lệ giao đúng hẹn
    const onTimeOrders = completedOrders.filter(order => {
      const estimatedMinutes = parseInt(order.estimatedTime) || 15;
      const actualMinutes = (new Date(order.servedTime) - new Date(order.startTime)) / 1000 / 60;
      return actualMinutes <= estimatedMinutes * 1.1; // Cho phép sai lệch 10%
    });
    
    const onTimeDeliveryRate = Math.round((onTimeOrders.length / completedOrders.length) * 100);
    
    return {
      averagePreparationTime,
      onTimeDeliveryRate,
      totalCompletedOrders: completedOrders.length,
      totalOrders: orders.length
    };
  }, [orders]);

  // Thuật toán sắp xếp đơn hàng theo độ ưu tiên
  const prioritizedOrders = useMemo(() => {
    const priorityWeights = { high: 3, medium: 2, low: 1 };
    
    return [...orders].sort((a, b) => {
      // Sắp xếp theo trạng thái trước
      const statusPriority = { pending: 4, preparing: 3, ready: 2, served: 1, completed: 0 };
      const statusDiff = (statusPriority[a.status] || 0) - (statusPriority[b.status] || 0);
      if (statusDiff !== 0) return statusDiff;
      
      // Sau đó theo độ ưu tiên
      const priorityDiff = (priorityWeights[b.priority] || 2) - (priorityWeights[a.priority] || 2);
      if (priorityDiff !== 0) return priorityDiff;
      
      // Cuối cùng theo thời gian đặt hàng
      return new Date(a.orderTime) - new Date(b.orderTime);
    });
  }, [orders]);

  // Thuật toán dự đoán thời gian chờ
  const predictWaitTime = (newOrder) => {
    const queuedOrders = orders.filter(order => 
      order.status === 'pending' || order.status === 'preparing'
    );
    
    let totalWaitTime = 0;
    
    // Tính thời gian từ các đơn đang chờ
    queuedOrders.forEach(order => {
      const estimatedMinutes = parseInt(calculateEstimatedTime(order)) || 10;
      totalWaitTime += estimatedMinutes;
    });
    
    // Thêm thời gian cho đơn mới
    const newOrderTime = parseInt(calculateEstimatedTime(newOrder)) || 10;
    totalWaitTime += newOrderTime;
    
    return Math.round(totalWaitTime);
  };

  // Thuật toán tối ưu hóa workflow
  const optimizeWorkflow = () => {
    const suggestions = [];
    
    // Kiểm tra bottleneck
    const preparingCount = categorizedOrders.preparing.length;
    const pendingCount = categorizedOrders.pending.length;
    
    if (preparingCount > 5) {
      suggestions.push({
        type: 'warning',
        message: 'Quá nhiều đơn đang chuẩn bị. Cân nhắc tăng nhân lực bếp.',
        action: 'increase_kitchen_staff'
      });
    }
    
    if (pendingCount > 10) {
      suggestions.push({
        type: 'danger',
        message: 'Hàng đợi quá dài. Cần xử lý gấp các đơn pending.',
        action: 'process_pending_orders'
      });
    }
    
    // Kiểm tra đơn hàng quá hạn
    const overdueOrders = orders.filter(order => {
      if (order.status !== 'preparing' || !order.startTime) return false;
      const estimatedMinutes = parseInt(order.estimatedTime) || 15;
      const actualMinutes = (Date.now() - new Date(order.startTime)) / 1000 / 60;
      return actualMinutes > estimatedMinutes * 1.2; // Quá hạn 20%
    });
    
    if (overdueOrders.length > 0) {
      suggestions.push({
        type: 'danger',
        message: `${overdueOrders.length} đơn hàng bị trễ hạn. Cần ưu tiên xử lý.`,
        action: 'prioritize_overdue',
        orders: overdueOrders
      });
    }
    
    return suggestions;
  };

  // Thuật toán batch operations
  const batchUpdateStatus = (orderIds, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        orderIds.includes(order.id)
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: Date.now(),
      status: 'pending',
      orderTime: new Date().toISOString(),
      estimatedTime: calculateEstimatedTime(orderData),
      statusHistory: [{
        status: 'pending',
        timestamp: new Date().toISOString(),
        updatedBy: 'system'
      }]
    };
    
    setOrders(prev => [...prev, newOrder]);
    return newOrder;
  };

  return {
    orders,
    setOrders,
    selectedOrder,
    setSelectedOrder,
    categorizedOrders,
    prioritizedOrders,
    performanceStats,
    updateOrderStatus,
    updateOrderItemStatus,
    calculateEstimatedTime,
    predictWaitTime,
    optimizeWorkflow,
    batchUpdateStatus,
    addOrder
  };
}
