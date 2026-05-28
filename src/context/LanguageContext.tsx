import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export type Language = 'en' | 'vi' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  en: {
    common: {
      search: 'Search employees, roles, or files...',
      logout: 'Logout',
      loading: 'Loading...',
      welcome: 'Welcome',
      submit: 'Submit',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      actions: 'Actions',
      export: 'Export Excel',
      yes: 'Yes',
      no: 'No',
    },
    sidebar: {
      dashboard: 'Dashboard',
      employees: 'Employee Directory',
      onboarding: 'Onboarding',
      attendance: 'Attendance',
      leave: 'Leave Requests',
      payroll: 'Payroll & Salary',
      reports: 'Reports',
      chatbot: 'ChatBox AI',
      enterprise: 'Enterprise Edition',
      portal: 'HR Portal',
    },
    login: {
      title: 'HR Portal',
      desc: 'Enterprise Edition',
      welcome: 'Welcome back!',
      subtitle: 'Sign in to manage employees, payroll, and view HR insights.',
      email: 'Email Address',
      password: 'Password',
      signingIn: 'Signing in...',
      signIn: 'Sign In',
      securedBy: 'Secured by',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      unifiedLabel: 'Unified HR Platform',
      unifiedTitle: 'People, Payroll &',
      unifiedTitle2: 'AI — Together.',
      unifiedDesc: 'Manage employees, attendance, leave, salary, recruitment pipeline, performance reviews, and AI-powered HR support from one unified console.',
      feature1Label: 'Employee Management',
      feature1Desc: 'Profiles, departments & org structure',
      feature2Label: 'Attendance & Leave',
      feature2Desc: 'Real-time tracking and approvals',
      feature3Label: 'Payroll Engine',
      feature3Desc: 'Auto-calculate, confirm and export',
      feature4Label: 'Recruitment Pipeline',
      feature4Desc: 'Track candidates from apply to hire',
      feature5Label: 'AI HR Assistant',
      feature5Desc: 'Natural language HR query engine',
      signInTitle: 'Welcome back',
      signInDesc: 'Sign in to your HR AI System account.',
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Operational summary across leave, attendance, payroll, and performance.',
      totalEmployees: 'Total Employees',
      activeRequests: 'Active Requests',
      attendanceRate: 'Attendance Rate',
      monthlyPayroll: 'Monthly Payroll',
      quickActions: 'Quick Actions',
      requestLeave: 'Request Leave',
      calcPayroll: 'Calculate Payroll',
      chatbot: 'Ask HR Assistant',
      onTime: 'On Time',
      late: 'Late',
      absent: 'Absent',
      actualDays: 'Actual Days',
      netSalary: 'Net Salary',
      latestKpi: 'Latest KPI',
      kpiTrend: 'KPI Performance Trend',
      weeklyBreakdown: 'Weekly Score Breakdown',
      leaveTrend: 'Days available this year',
      attendanceTrend: 'Working days this month',
      salaryTrend: 'Latest confirmed payslip',
      performanceTrend: 'Performance score (0–100)',
    },
    chatbot: {
      title: 'HR Assistant Chatbot',
      subtitle: 'Ask about leave balance, payroll, attendance, policy, and HR workflows.',
      placeholder: 'Type your HR question here...',
      send: 'Send',
      newChat: 'New conversation',
      history: 'Chat history',
      faqs: 'Common FAQs',
      askAnything: 'Ask HR Bot anything',
      welcomeDesc: 'Leave balance, salary slips, attendance, OT rules, or company policies.',
      ready: 'Online · Ready to help',
      reply1: 'My remaining leave?',
      reply2: 'My recent salary slip?',
      reply3: 'My attendance this month?',
      reply4: 'Company OT rules?',
      faq1: 'How do I request PTO?',
      faq2: 'Medical insurance claims',
      faq3: 'Referral program details',
      faq4: 'Internal job board',
    },
    leave: {
      title: 'Leave',
      subtitle: 'Submit leave requests and review approvals.',
      total: 'Total',
      used: 'Used',
      remaining: 'Remaining',
      newRequest: 'New leave request',
      myRequests: 'My leave requests',
      hrApprovals: 'HR approvals',
    },
    salary: {
      title: 'Salary',
      subtitle: 'Configure salary, calculate payroll, confirm, mark paid, and export Excel.',
      config: 'Salary config',
      actions: 'Payroll actions',
      history: 'Payroll history',
    },
  },
  vi: {
    common: {
      search: 'Tìm kiếm nhân viên, chức vụ, tài liệu...',
      logout: 'Đăng xuất',
      loading: 'Đang tải...',
      welcome: 'Chào mừng',
      submit: 'Gửi đi',
      cancel: 'Hủy',
      confirm: 'Xác nhận',
      save: 'Lưu lại',
      actions: 'Thao tác',
      export: 'Xuất Excel',
      yes: 'Có',
      no: 'Không',
    },
    sidebar: {
      dashboard: 'Tổng quan',
      employees: 'Danh sách nhân viên',
      onboarding: 'Onboarding',
      attendance: 'Chấm công',
      leave: 'Đơn xin nghỉ phép',
      payroll: 'Lương & Bảng công',
      reports: 'Báo cáo hiệu suất',
      chatbot: 'Trợ lý ChatBox AI',
      enterprise: 'Phiên bản Doanh nghiệp',
      portal: 'HR Portal',
    },
    login: {
      title: 'HR Portal',
      desc: 'Phiên bản Doanh nghiệp',
      welcome: 'Chào mừng trở lại!',
      subtitle: 'Đăng nhập để quản lý nhân sự, bảng lương và xem báo cáo phân tích.',
      email: 'Địa chỉ Email',
      password: 'Mật khẩu',
      signingIn: 'Đang đăng nhập...',
      signIn: 'Đăng nhập',
      securedBy: 'Được bảo mật bởi',
      emailRequired: 'Vui lòng nhập Email',
      passwordRequired: 'Vui lòng nhập Mật khẩu',
      unifiedLabel: 'Nền tảng HR Hợp nhất',
      unifiedTitle: 'Nhân sự, Lương &',
      unifiedTitle2: 'AI — Hợp nhất.',
      unifiedDesc: 'Quản lý nhân sự, chấm công, nghỉ phép, tính lương, quy trình tuyển dụng, đánh giá hiệu suất và trợ lý AI từ một giao diện hợp nhất.',
      feature1Label: 'Quản lý Nhân sự',
      feature1Desc: 'Thông tin hồ sơ, phòng ban & cơ cấu tổ chức',
      feature2Label: 'Chấm công & Phép',
      feature2Desc: 'Theo dõi thời gian thực tế và phê duyệt đơn',
      feature3Label: 'Công cụ tính Lương',
      feature3Desc: 'Tự động tính lương, phê duyệt và xuất dữ liệu',
      feature4Label: 'Quy trình Tuyển dụng',
      feature4Desc: 'Theo dõi ứng viên từ lúc nộp đơn đến nhận việc',
      feature5Label: 'Trợ lý ảo HR AI',
      feature5Desc: 'Hỏi đáp nhân sự thông minh bằng ngôn ngữ tự nhiên',
      signInTitle: 'Chào mừng trở lại',
      signInDesc: 'Đăng nhập vào tài khoản HR AI System của bạn.',
    },
    dashboard: {
      title: 'Bảng điều khiển',
      subtitle: 'Tóm tắt hoạt động nghỉ phép, chấm công, bảng lương và hiệu suất công việc.',
      totalEmployees: 'Tổng nhân viên',
      activeRequests: 'Yêu cầu chờ duyệt',
      attendanceRate: 'Tỷ lệ đi làm',
      monthlyPayroll: 'Tổng chi lương tháng',
      quickActions: 'Thao tác nhanh',
      requestLeave: 'Đăng ký nghỉ phép',
      calcPayroll: 'Tính toán bảng lương',
      chatbot: 'Hỏi Trợ lý ảo HR',
      onTime: 'Đúng giờ',
      late: 'Đi muộn',
      absent: 'Vắng mặt',
      actualDays: 'Ngày thực tế',
      netSalary: 'Lương thực lĩnh',
      latestKpi: 'KPI mới nhất',
      kpiTrend: 'Xu hướng hiệu suất KPI',
      weeklyBreakdown: 'Chi tiết điểm số tuần',
      leaveTrend: 'Số ngày phép khả dụng năm nay',
      attendanceTrend: 'Số ngày làm việc tháng này',
      salaryTrend: 'Bảng lương xác nhận gần nhất',
      performanceTrend: 'Điểm hiệu suất (0–100)',
    },
    chatbot: {
      title: 'Trợ lý ảo HR AI',
      subtitle: 'Hỏi về số ngày phép, phiếu lương, chấm công, quy chế công ty và quy trình HR.',
      placeholder: 'Nhập câu hỏi nhân sự tại đây...',
      send: 'Gửi',
      newChat: 'Cuộc trò chuyện mới',
      history: 'Lịch sử trò chuyện',
      faqs: 'Câu hỏi thường gặp',
      askAnything: 'Hỏi HR Bot bất cứ điều gì',
      welcomeDesc: 'Số ngày nghỉ phép, phiếu lương, chấm công, quy định làm thêm giờ hoặc chính sách công ty.',
      ready: 'Trực tuyến · Sẵn sàng trợ giúp',
      reply1: 'Phép còn lại của tôi?',
      reply2: 'Lương tháng gần nhất?',
      reply3: 'Chấm công tháng này?',
      reply4: 'Quy định OT của công ty?',
      faq1: 'Làm thế nào để xin nghỉ phép?',
      faq2: 'Quy trình yêu cầu bảo hiểm y tế?',
      faq3: 'Chi tiết chương trình giới thiệu?',
      faq4: 'Bảng tin tuyển dụng nội bộ?',
    },
    leave: {
      title: 'Nghỉ phép',
      subtitle: 'Nộp đơn xin nghỉ phép và duyệt các yêu cầu của nhân viên.',
      total: 'Tổng số phép',
      used: 'Đã dùng',
      remaining: 'Còn lại',
      newRequest: 'Tạo yêu cầu nghỉ phép mới',
      myRequests: 'Yêu cầu phép của tôi',
      hrApprovals: 'Phê duyệt của nhân sự',
    },
    salary: {
      title: 'Lương & Payroll',
      subtitle: 'Cấu hình lương, tính toán bảng lương, xác nhận, đánh dấu đã thanh toán và xuất Excel.',
      config: 'Cấu hình lương',
      actions: 'Tính năng bảng lương',
      history: 'Lịch sử tính lương',
    },
  },
  zh: {
    common: {
      search: '搜索员工、职位或文件...',
      logout: '退出登录',
      loading: '加载中...',
      welcome: '欢迎',
      submit: '提交',
      cancel: '取消',
      confirm: '确认',
      save: '保存',
      actions: '操作',
      export: '导出 Excel',
      yes: '是',
      no: '否',
    },
    sidebar: {
      dashboard: '控制面板',
      employees: '员工名册',
      onboarding: '入职管理',
      attendance: '考勤管理',
      leave: '请假申请',
      payroll: '薪资与工资表',
      reports: '业绩报告',
      chatbot: '智能助手 ChatBox AI',
      enterprise: '企业特别版',
      portal: 'HR 门户系统',
    },
    login: {
      title: 'HR 门户系统',
      desc: '企业特别版',
      welcome: '欢迎回来！',
      subtitle: '登录系统以管理员工、计算薪资并查看人力资源分析报告。',
      email: '电子邮箱地址',
      password: '安全密码',
      signingIn: '正在登录...',
      signIn: '确认登录',
      securedBy: '安全保障由',
      emailRequired: '邮箱地址是必填项',
      passwordRequired: '安全密码是必填项',
      unifiedLabel: '一体化人力资源平台',
      unifiedTitle: '员工、薪资与',
      unifiedTitle2: '人工智能 — 一体化。',
      unifiedDesc: '在统一的管理控制台中管理员工、考勤、请假、薪资计算、招聘漏斗、绩效评估以及 AI 智能助手。',
      feature1Label: '员工管理系统',
      feature1Desc: '员工档案、部门架构与组织关系',
      feature2Label: '考勤与休假管理',
      feature2Desc: '实时出勤跟踪、打卡与请假审批',
      feature3Label: '智能薪资计算引擎',
      feature3Desc: '自动算薪、确认发放并导出 Excel',
      feature4Label: '招聘与入职管理',
      feature4Desc: '跟踪从简历投递到录用入职的全流程',
      feature5Label: 'HR 智能问答助理',
      feature5Desc: '基于自然语言处理的人力资源查询引擎',
      signInTitle: '欢迎回来',
      signInDesc: '登录您的 HR AI 账户。',
    },
    dashboard: {
      title: '控制面板',
      subtitle: '涵盖请假、考勤、工资及绩效的业务汇总。',
      totalEmployees: '员工总数',
      activeRequests: '待审批申请',
      attendanceRate: '出勤率',
      monthlyPayroll: '月度薪资总额',
      quickActions: '快捷操作',
      requestLeave: '申请请假',
      calcPayroll: '计算薪资表',
      chatbot: '咨询智能助手',
      onTime: '准时',
      late: '迟到',
      absent: '缺勤',
      actualDays: '实际出勤天数',
      netSalary: '实发薪资',
      latestKpi: '最新 KPI 指标',
      kpiTrend: 'KPI 绩效变化趋势',
      weeklyBreakdown: '每周绩效得分细化',
      leaveTrend: '今年剩余可用假期天数',
      attendanceTrend: '本月内累计出勤天数',
      salaryTrend: '最新已确认的工资单',
      performanceTrend: '绩效分数范围 (0-100)',
    },
    chatbot: {
      title: 'HR 智能助理',
      subtitle: '咨询关于年假余额、工资单、考勤、加班规则和公司制度。',
      placeholder: '在此输入您的人力资源问题...',
      send: '发送',
      newChat: '新对话',
      history: '历史对话',
      faqs: '常见问题列表',
      askAnything: '向 HR 机器人提问',
      welcomeDesc: '年假余额、工资单、考勤、加班规则或公司政策。',
      ready: '在线 · 随时准备为您服务',
      reply1: '我的剩余假期数？',
      reply2: '我最近的工资单？',
      reply3: '我本月的出勤记录？',
      reply4: '公司加班规定？',
      faq1: '我该如何申请休假？',
      faq2: '医疗保险理赔流程',
      faq3: '内部员工推荐奖金',
      faq4: '内部招聘公告栏',
    },
    leave: {
      title: '请假管理',
      subtitle: '提交请假申请并审核员工请假申请。',
      total: '总假期额',
      used: '已用天数',
      remaining: '剩余天数',
      newRequest: '新建请假申请',
      myRequests: '我的请假历史',
      hrApprovals: 'HR 审批人列表',
    },
    salary: {
      title: '薪金与工资表',
      subtitle: '配置基础薪资、计算工资表、确认发放、标记已付并导出 Excel 表格。',
      config: '基础薪资配置',
      actions: '工资表操作栏',
      history: '薪资发放记录',
    },
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('hr_language_mode');
    return (saved as Language) || 'vi'; // Default to Vietnamese
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('hr_language_mode', lang);
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }

  const { language, setLanguage } = context;

  const t = (key: string): string => {
    const keys = key.split('.');
    let current: any = translations[language];

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // Fallback to English
        let fallback: any = translations['en'];
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return key; // return raw key if missing completely
          }
        }
        return typeof fallback === 'string' ? fallback : key;
      }
    }

    return typeof current === 'string' ? current : key;
  };

  return { t, language, setLanguage };
}
