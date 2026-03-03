// 模拟设备数据
const mockDevices = [
  {
    id: 1,
    name: "伺服电机控制单元 V3",
    sn: "SN: 2026-X-9901",
    assetType: "设备",
    lifecycle: {
      old: "2026-03-03",
      new: "2026-12-31",
      note: "2026-03-03 凌晨同步"
    },
    healthStatus: "今日已更新",
    changeCount: 1,
    isStable: false
  },
  {
    id: 2,
    name: "工业千兆路由器",
    sn: "SN: NET-8820-B",
    assetType: "设备",
    lifecycle: {
      old: "2028-01-01",
      new: "2028-01-01",
      note: "初始版本日期"
    },
    healthStatus: "数据稳定",
    changeCount: 0,
    isStable: true
  },
  {
    id: 3,
    name: "工业传感器模块",
    sn: "SN: SENSOR-1234-A",
    assetType: "配件",
    lifecycle: {
      old: "2026-01-15",
      new: "2027-01-15",
      note: "2026-02-01 凌晨同步"
    },
    healthStatus: "数据稳定",
    changeCount: 1,
    isStable: false
  },
  {
    id: 4,
    name: "PLC控制器",
    sn: "SN: PLC-5678-C",
    assetType: "设备",
    lifecycle: {
      old: "2027-03-10",
      new: "2027-03-10",
      note: "初始版本日期"
    },
    healthStatus: "数据稳定",
    changeCount: 0,
    isStable: true
  },
  {
    id: 5,
    name: "工业电源模块",
    sn: "SN: POWER-9012-D",
    assetType: "配件",
    lifecycle: {
      old: "2025-12-01",
      new: "2026-12-01",
      note: "2026-01-05 凌晨同步"
    },
    healthStatus: "数据稳定",
    changeCount: 1,
    isStable: false
  },
  {
    id: 6,
    name: "工业交换机",
    sn: "SN: SWITCH-3456-E",
    assetType: "设备",
    lifecycle: {
      old: "2028-02-20",
      new: "2028-02-20",
      note: "初始版本日期"
    },
    healthStatus: "数据稳定",
    changeCount: 0,
    isStable: true
  },
  {
    id: 7,
    name: "工业摄像头",
    sn: "SN: CAM-7890-F",
    assetType: "设备",
    lifecycle: {
      old: "2026-03-01",
      new: "2027-03-01",
      note: "2026-03-02 凌晨同步"
    },
    healthStatus: "今日已更新",
    changeCount: 1,
    isStable: false
  },
  {
    id: 8,
    name: "工业触摸屏",
    sn: "SN: TOUCH-2345-G",
    assetType: "配件",
    lifecycle: {
      old: "2027-06-15",
      new: "2027-06-15",
      note: "初始版本日期"
    },
    healthStatus: "数据稳定",
    changeCount: 0,
    isStable: true
  },
  {
    id: 9,
    name: "工业变频器",
    sn: "SN: VFD-6789-H",
    assetType: "设备",
    lifecycle: {
      old: "2025-10-01",
      new: "2026-10-01",
      note: "2026-01-10 凌晨同步"
    },
    healthStatus: "数据稳定",
    changeCount: 1,
    isStable: false
  },
  {
    id: 10,
    name: "工业网关",
    sn: "SN: GATEWAY-0123-I",
    assetType: "设备",
    lifecycle: {
      old: "2028-04-01",
      new: "2028-04-01",
      note: "初始版本日期"
    },
    healthStatus: "数据稳定",
    changeCount: 0,
    isStable: true
  },
  {
    id: 11,
    name: "工业路由器",
    sn: "SN: ROUTER-4567-J",
    assetType: "设备",
    lifecycle: {
      old: "2026-02-15",
      new: "2027-02-15",
      note: "2026-02-16 凌晨同步"
    },
    healthStatus: "数据稳定",
    changeCount: 1,
    isStable: false
  },
  {
    id: 12,
    name: "工业防火墙",
    sn: "SN: FIREWALL-8901-K",
    assetType: "设备",
    lifecycle: {
      old: "2027-08-01",
      new: "2027-08-01",
      note: "初始版本日期"
    },
    healthStatus: "数据稳定",
    changeCount: 0,
    isStable: true
  },
  {
    id: 13,
    name: "工业服务器",
    sn: "SN: SERVER-2345-L",
    assetType: "设备",
    lifecycle: {
      old: "2026-01-01",
      new: "2027-01-01",
      note: "2026-01-02 凌晨同步"
    },
    healthStatus: "数据稳定",
    changeCount: 1,
    isStable: false
  },
  {
    id: 14,
    name: "工业UPS",
    sn: "SN: UPS-6789-M",
    assetType: "设备",
    lifecycle: {
      old: "2028-05-01",
      new: "2028-05-01",
      note: "初始版本日期"
    },
    healthStatus: "数据稳定",
    changeCount: 0,
    isStable: true
  },
  {
    id: 15,
    name: "工业空调",
    sn: "SN: AC-0123-N",
    assetType: "设备",
    lifecycle: {
      old: "2026-03-01",
      new: "2027-03-01",
      note: "2026-03-02 凌晨同步"
    },
    healthStatus: "今日已更新",
    changeCount: 1,
    isStable: false
  },
  {
    id: 16,
    name: "工业机器人控制器",
    sn: "SN: ROBOT-9876-P",
    assetType: "设备",
    lifecycle: {
      old: "2025-01-01",
      new: "2027-12-31",
      note: "2026-03-04 凌晨同步"
    },
    healthStatus: "今日已更新",
    changeCount: 3,
    isStable: false,
    changeHistory: [
      {
        date: "2026-03-04 04:00",
        type: "数据同步：时间偏移",
        description: "生命周期日期由 2026-06-30 修正为 2027-12-31",
        note: "由于硬件升级，预测寿命延长"
      },
      {
        date: "2025-12-15 04:00",
        type: "数据同步：时间偏移",
        description: "生命周期日期由 2026-01-01 修正为 2026-06-30",
        note: "由于维护记录更新，预测寿命调整"
      },
      {
        date: "2025-01-01 00:00",
        type: "设备初始化入库",
        description: "初始生命周期日期：2026-01-01",
        note: "设备首次入库"
      }
    ]
  }
];

// 模拟API函数 - 模拟后端行为
// 注意：在实际生产环境中，排序和分页应该在后端数据库中进行
// 这里模拟了后端处理逻辑，只返回当前页的数据
function getDevices(params) {
  const { page = 1, pageSize = 10, search = '', sortBy = null, sortOrder = 'asc' } = params;
  
  // 模拟网络延迟
  // 在实际生产环境中，这里会是真实的API调用
  // setTimeout(() => {
    
    // 过滤数据
    let filteredDevices = mockDevices;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDevices = filteredDevices.filter(device => 
        device.name.toLowerCase().includes(searchLower) || 
        device.sn.toLowerCase().includes(searchLower) ||
        device.assetType.toLowerCase().includes(searchLower)
      );
    }
    
    // 排序数据
    if (sortBy) {
      filteredDevices.sort((a, b) => {
        if (sortBy === 'changeCount') {
          return sortOrder === 'asc' ? a.changeCount - b.changeCount : b.changeCount - a.changeCount;
        }
        return 0;
      });
    }
    
    // 分页数据
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedDevices = filteredDevices.slice(startIndex, endIndex);
    
    return {
      data: paginatedDevices,
      total: filteredDevices.length,
      page,
      pageSize
    };
  // }, 200); // 模拟200ms网络延迟
}

// 导出API函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getDevices };
} else {
  window.getDevices = getDevices;
}
