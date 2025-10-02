import { useState, useMemo } from 'react';

/**
 * Hook quản lý bàn ăn và trạng thái phục vụ
 * Trích xuất từ StaffPage.jsx và Manager/TablesManagement.jsx
 */
export function useTableManager(initialTables = []) {
  const [tables, setTables] = useState(initialTables);
  const [selectedTable, setSelectedTable] = useState(null);

  // Thuật toán cập nhật trạng thái bàn
  const updateTableStatus = (tableId, status) => {
    setTables(prevTables =>
      prevTables.map(table => {
        if (table.id === tableId) {
          const updatedTable = {
            ...table,
            status,
            statusHistory: [
              ...(table.statusHistory || []),
              {
                status,
                timestamp: new Date().toISOString(),
                updatedBy: 'staff'
              }
            ]
          };
          
          // Tự động cập nhật thời gian dựa trên trạng thái
          if (status === 'occupied') {
            updatedTable.occupiedTime = new Date().toISOString();
            updatedTable.duration = '0 min';
          } else if (status === 'cleaning') {
            updatedTable.cleaningStartTime = new Date().toISOString();
          } else if (status === 'available') {
            updatedTable.availableTime = new Date().toISOString();
            updatedTable.duration = null;
          }
          
          return updatedTable;
        }
        return table;
      })
    );
  };

  // Thuật toán cập nhật đơn hàng của bàn
  const updateOrderStatus = (tableId, updatedOrder) => {
    setTables(prevTables =>
      prevTables.map(table =>
        table.id === tableId 
          ? { ...table, currentOrder: updatedOrder }
          : table
      )
    );
  };

  // Thuật toán tính thời gian phục vụ
  const calculateServiceDuration = (table) => {
    if (!table.occupiedTime) return '0 min';
    
    const startTime = new Date(table.occupiedTime);
    const currentTime = new Date();
    const diffMinutes = Math.floor((currentTime - startTime) / 1000 / 60);
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}min`;
    }
  };

  // Thuật toán phân loại bàn theo trạng thái
  const categorizedTables = useMemo(() => {
    return {
      available: tables.filter(table => table.status === 'available'),
      occupied: tables.filter(table => table.status === 'occupied'),
      reserved: tables.filter(table => table.status === 'reserved'),
      cleaning: tables.filter(table => table.status === 'cleaning'),
      callStaff: tables.filter(table => table.callStaff)
    };
  }, [tables]);

  // Thuật toán tính thống kê bàn
  const tableStats = useMemo(() => {
    const totalRevenue = tables.reduce((sum, table) => sum + (table.totalAmount || 0), 0);
    const occupancyRate = tables.length > 0 
      ? Math.round((categorizedTables.occupied.length / tables.length) * 100)
      : 0;
    
    // Tính thời gian phục vụ trung bình
    const occupiedTables = categorizedTables.occupied.filter(table => table.occupiedTime);
    const avgServiceTime = occupiedTables.length > 0
      ? occupiedTables.reduce((sum, table) => {
          const duration = calculateServiceDuration(table);
          const minutes = parseInt(duration) || 0;
          return sum + minutes;
        }, 0) / occupiedTables.length
      : 0;
    
    return {
      totalTables: tables.length,
      availableTables: categorizedTables.available.length,
      occupiedTables: categorizedTables.occupied.length,
      reservedTables: categorizedTables.reserved.length,
      cleaningTables: categorizedTables.cleaning.length,
      callStaffCount: categorizedTables.callStaff.length,
      totalRevenue,
      occupancyRate,
      avgServiceTime: Math.round(avgServiceTime)
    };
  }, [tables, categorizedTables]);

  // Thuật toán dự đoán thời gian chờ bàn
  const predictWaitTime = (partySize) => {
    const availableTables = categorizedTables.available.filter(table => 
      table.capacity >= partySize
    );
    
    if (availableTables.length > 0) {
      return 0; // Có bàn trống ngay
    }
    
    // Tìm bàn phù hợp đang được sử dụng
    const suitableTables = categorizedTables.occupied.filter(table =>
      table.capacity >= partySize
    );
    
    if (suitableTables.length === 0) {
      return -1; // Không có bàn phù hợp
    }
    
    // Ước tính thời gian dựa trên thời gian phục vụ trung bình
    const avgMealTime = 60; // 60 phút trung bình
    const shortestWait = suitableTables.reduce((min, table) => {
      const serviceTime = calculateServiceDuration(table);
      const minutes = parseInt(serviceTime) || 0;
      const remainingTime = Math.max(0, avgMealTime - minutes);
      return Math.min(min, remainingTime);
    }, avgMealTime);
    
    return shortestWait;
  };

  // Thuật toán gợi ý bàn tối ưu
  const suggestOptimalTable = (partySize, preferences = {}) => {
    let availableTables = categorizedTables.available.filter(table =>
      table.capacity >= partySize
    );
    
    if (availableTables.length === 0) return null;
    
    // Sắp xếp theo tiêu chí ưu tiên
    availableTables = availableTables.map(table => {
      let score = 0;
      
      // Ưu tiên bàn vừa đủ (không quá lớn)
      const sizeScore = table.capacity === partySize ? 10 : 
                       table.capacity <= partySize + 2 ? 8 : 5;
      score += sizeScore;
      
      // Ưu tiên vị trí
      if (preferences.location) {
        if (table.location === preferences.location) score += 5;
      }
      
      // Ưu tiên view
      if (preferences.hasView && table.hasView) score += 3;
      
      // Ưu tiên yên tĩnh
      if (preferences.quiet && table.isQuiet) score += 3;
      
      // Ưu tiên gần cửa sổ
      if (preferences.nearWindow && table.nearWindow) score += 2;
      
      return { ...table, score };
    });
    
    return availableTables.sort((a, b) => b.score - a.score)[0];
  };

  // Thuật toán phân tích hiệu suất bàn
  const analyzeTablePerformance = useMemo(() => {
    return tables.map(table => {
      const history = table.statusHistory || [];
      const occupiedSessions = history.filter(h => h.status === 'occupied').length;
      
      // Tính doanh thu trung bình mỗi lần sử dụng
      const avgRevenuePerSession = occupiedSessions > 0 
        ? (table.totalAmount || 0) / occupiedSessions 
        : 0;
      
      // Tính tỷ lệ sử dụng trong ngày
      const today = new Date().toDateString();
      const todayHistory = history.filter(h => 
        new Date(h.timestamp).toDateString() === today
      );
      const occupiedToday = todayHistory.filter(h => h.status === 'occupied').length;
      const utilizationRate = Math.min(occupiedToday * 2, 100); // Giả định tối đa 12 lần/ngày
      
      return {
        tableId: table.id,
        tableNumber: table.number,
        totalRevenue: table.totalAmount || 0,
        avgRevenuePerSession,
        utilizationRate,
        occupiedSessions,
        performance: avgRevenuePerSession > 50 ? 'high' : 
                    avgRevenuePerSession > 25 ? 'medium' : 'low'
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [tables]);

  // Thuật toán tối ưu hóa sắp xếp bàn
  const optimizeTableLayout = () => {
    const suggestions = [];
    const performance = analyzeTablePerformance;
    
    // Tìm bàn có hiệu suất thấp
    const lowPerformanceTables = performance.filter(p => p.performance === 'low');
    if (lowPerformanceTables.length > 0) {
      suggestions.push({
        type: 'info',
        message: `${lowPerformanceTables.length} bàn có doanh thu thấp. Cân nhắc thay đổi vị trí hoặc kích thước.`,
        tables: lowPerformanceTables
      });
    }
    
    // Kiểm tra tỷ lệ sử dụng
    const underutilizedTables = performance.filter(p => p.utilizationRate < 30);
    if (underutilizedTables.length > 0) {
      suggestions.push({
        type: 'warning',
        message: `${underutilizedTables.length} bàn ít được sử dụng. Có thể cần marketing hoặc điều chỉnh menu.`,
        tables: underutilizedTables
      });
    }
    
    // Kiểm tra thời gian chờ
    const avgWaitTime = [2, 4, 6, 8].reduce((sum, size) => 
      sum + predictWaitTime(size), 0) / 4;
    
    if (avgWaitTime > 30) {
      suggestions.push({
        type: 'danger',
        message: 'Thời gian chờ bàn quá lâu. Cần tăng tốc độ phục vụ hoặc thêm bàn.',
        avgWaitTime
      });
    }
    
    return suggestions;
  };

  // Thuật toán xử lý call staff
  const handleCallStaff = (tableId, respond = false) => {
    setTables(prevTables =>
      prevTables.map(table =>
        table.id === tableId
          ? { 
              ...table, 
              callStaff: !respond,
              lastCallTime: respond ? null : new Date().toISOString(),
              responseTime: respond ? new Date().toISOString() : table.responseTime
            }
          : table
      )
    );
  };

  // Thuật toán batch operations
  const batchUpdateTables = (tableIds, updates) => {
    setTables(prevTables =>
      prevTables.map(table =>
        tableIds.includes(table.id)
          ? { ...table, ...updates }
          : table
      )
    );
  };

  const resetTable = (tableId) => {
    updateTableStatus(tableId, 'cleaning');
    setTimeout(() => {
      updateTableStatus(tableId, 'available');
    }, 300000); // 5 phút dọn dẹp
  };

  return {
    tables,
    setTables,
    selectedTable,
    setSelectedTable,
    categorizedTables,
    tableStats,
    updateTableStatus,
    updateOrderStatus,
    calculateServiceDuration,
    predictWaitTime,
    suggestOptimalTable,
    analyzeTablePerformance,
    optimizeTableLayout,
    handleCallStaff,
    batchUpdateTables,
    resetTable
  };
}
