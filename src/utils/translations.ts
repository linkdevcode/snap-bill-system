import {
  INVOICE_CURRENCY_STORAGE_KEY,
  INVOICE_LANGUAGE_STORAGE_KEY,
  LANGUAGE_DATE_LOCALE,
  parseInvoiceCurrency,
  parseInvoiceLanguage,
  type InvoiceCurrency,
  type InvoiceLanguage,
} from "@/types/locale";
import type { InvoiceStatus } from "@/types/invoice";

export interface InvoicePreviewLabels {
  invoice: string;
  from: string;
  to: string;
  invoiceNumber: string;
  status: string;
  issueDate: string;
  dueDate: string;
  billTo: string;
  amountDue: string;
  logoPlaceholder: string;
  description: string;
  qty: string;
  unit: string;
  lineTotal: string;
  subtotal: string;
  tax: string;
  discount: string;
  total: string;
  notes: string;
  taxVat: string;
  defaultCompany: string;
  defaultClient: string;
  defaultLineItem: string;
}

export interface AppLabels {
  preview: InvoicePreviewLabels;
  nav: {
    editor: string;
    myInvoices: string;
    docs: string;
    mainNav: string;
  };
  brand: {
    freeTag: string;
  };
  editor: {
    title: string;
    saveToCloud: string;
    saving: string;
    signInForCloud: string;
    configureSupabase: string;
    sender: string;
    client: string;
    invoiceSection: string;
    companyName: string;
    senderName: string;
    email: string;
    taxId: string;
    address: string;
    logo: string;
    logoFormats: string;
    clearLogo: string;
    uploadLogo: string;
    clientName: string;
    clientEmail: string;
    billingAddress: string;
    invoiceNumber: string;
    status: string;
    issueDate: string;
    dueDate: string;
    taxRate: string;
    discountRate: string;
    notesPayment: string;
    lineItems: string;
    addItem: string;
    unitPrice: string;
    removeLineItem: string;
    clearLineItem: string;
    guestCallout: string;
    placeholders: {
      companyName: string;
      senderName: string;
      email: string;
      taxId: string;
      address: string;
      clientName: string;
      clientEmail: string;
      billingAddress: string;
      invoiceNumber: string;
      notes: string;
      lineDescription: string;
    };
    logoErrors: {
      invalidType: string;
      tooLarge: string;
      readFailed: string;
    };
  };
  previewChrome: {
    livePreview: string;
    downloadPdf: string;
    printPdf: string;
    preparingPdf: string;
    previewAria: string;
  };
  statusLabels: Record<InvoiceStatus, string>;
  cloudSave: {
    notConfigured: string;
    signInRequired: string;
    syncing: string;
    updated: string;
    created: string;
    failed: string;
  };
  selectors: {
    languageAria: string;
    currencyAria: string;
    languageOptions: Record<InvoiceLanguage, string>;
    currencyOptions: Record<InvoiceCurrency, string>;
  };
  dashboard: {
    title: string;
    subtitle: string;
    refresh: string;
    newInvoice: string;
    emptyNotConfigured: string;
    emptyNoInvoices: string;
    loading: string;
    invoiceNumber: string;
    client: string;
    total: string;
    created: string;
    status: string;
    actions: string;
    editInvoice: string;
    deleteInvoice: string;
    changeStatus: string;
  };
  auth: {
    signIn: string;
    signOut: string;
    signedInFallback: string;
    signInTitle: string;
    emailStepHint: string;
    otpStepHint: string;
    close: string;
    dismissError: string;
    dismissShort: string;
    emailLabel: string;
    emailPlaceholder: string;
    sendCode: string;
    sendingCode: string;
    otpLabel: string;
    verify: string;
    verifying: string;
    changeEmail: string;
    resendCode: string;
    orDivider: string;
    continueGoogle: string;
    supabaseOtpHint: string;
    envHintBefore: string;
    envHintAfter: string;
    needSupabaseKeys: string;
    errors: {
      emailRequired: string;
      supabaseNotConfigured: string;
      emailMissingForOtp: string;
      otpInvalid: string;
      supabaseNotConfiguredShort: string;
    };
  };
  docs: {
    title: string;
    subtitle: string;
    editorSection: string;
    editorBullet1Before: string;
    editorBullet1After: string;
    editorBullet2: string;
    editorBullet3Before: string;
    editorBullet3After: string;
    accountSection: string;
    accountBullet1: string;
    accountBullet2: string;
    accountBullet3Before: string;
    accountBullet3After: string;
    footer: string;
  };
}

const LABELS: Record<InvoiceLanguage, AppLabels> = {
  vi: {
    preview: {
      invoice: "HÓA ĐƠN",
      from: "THÔNG TIN CÔNG TY",
      to: "THÔNG TIN KHÁCH HÀNG",
      invoiceNumber: "Số HĐ",
      status: "Trạng thái",
      issueDate: "Ngày tạo",
      dueDate: "Hạn thanh toán",
      billTo: "Khách hàng",
      amountDue: "Tổng phải thu",
      logoPlaceholder: "Logo",
      description: "Mô tả",
      qty: "SL",
      unit: "Đơn giá",
      lineTotal: "Thành tiền",
      subtotal: "Tạm tính",
      tax: "Thuế",
      discount: "Giảm giá",
      total: "TỔNG",
      notes: "Ghi chú",
      taxVat: "MST / VAT",
      defaultCompany: "Tên công ty của bạn",
      defaultClient: "Tên khách hàng",
      defaultLineItem: "Mô tả dòng hàng",
    },
    nav: {
      editor: "Trình tạo",
      myInvoices: "Hóa đơn của tôi",
      docs: "Tài liệu",
      mainNav: "Điều hướng chính",
    },
    brand: {
      freeTag: "Miễn phí",
    },
    editor: {
      title: "Thông tin hóa đơn",
      saveToCloud: "Lưu đám mây",
      saving: "Đang lưu…",
      signInForCloud: "Đăng nhập để bật lưu đám mây.",
      configureSupabase:
        "Cấu hình Supabase trong .env để lưu đám mây.",
      sender: "THÔNG TIN CÔNG TY",
      client: "THÔNG TIN KHÁCH HÀNG",
      invoiceSection: "Hóa đơn",
      companyName: "Tên công ty",
      senderName: "Tên người gửi",
      email: "Email",
      taxId: "Mã số thuế / VAT",
      address: "Địa chỉ",
      logo: "Logo",
      logoFormats: "PNG / JPG",
      clearLogo: "Xóa",
      uploadLogo: "Tải logo công ty",
      clientName: "Tên khách hàng",
      clientEmail: "Email khách hàng",
      billingAddress: "Địa chỉ thanh toán",
      invoiceNumber: "Số hóa đơn",
      status: "Trạng thái",
      issueDate: "Ngày tạo",
      dueDate: "Hạn thanh toán",
      taxRate: "Thuế suất (%)",
      discountRate: "Giảm giá (%)",
      notesPayment: "Ghi chú / điều khoản thanh toán",
      lineItems: "Dòng hàng",
      addItem: "Thêm dòng",
      unitPrice: "Đơn giá",
      removeLineItem: "Xóa dòng hàng",
      clearLineItem: "Xóa nội dung dòng",
      guestCallout:
        "Đăng ký tài khoản miễn phí để lưu trữ và quản lý lịch sử hóa đơn vĩnh viễn và truy cập từ mọi thiết bị.",
      placeholders: {
        companyName: "Công ty ABC",
        senderName: "Họ tên của bạn",
        email: "billing@congty.com",
        taxId: "Tùy chọn",
        address: "Đường, quận, thành phố",
        clientName: "Tên công ty / cá nhân",
        clientEmail: "accounts@khachhang.com",
        billingAddress: "Địa chỉ xuất hóa đơn",
        invoiceNumber: "HD-001",
        notes: "Thông tin ngân hàng, lời cảm ơn, hướng dẫn thanh toán.",
        lineDescription: "Dịch vụ hoặc sản phẩm",
      },
      logoErrors: {
        invalidType: "Vui lòng tải ảnh PNG hoặc JPG.",
        tooLarge: "Logo tối đa 2 MB.",
        readFailed: "Không đọc được tệp ảnh.",
      },
    },
    previewChrome: {
      livePreview: "Xem trước trực tiếp",
      downloadPdf: "Tải PDF",
      printPdf: "In PDF",
      preparingPdf: "Đang tạo PDF…",
      previewAria: "Tờ hóa đơn xem trước",
    },
    statusLabels: {
      draft: "Nháp",
      sent: "Đã gửi",
      paid: "Đã thanh toán",
      overdue: "Quá hạn",
    },
    cloudSave: {
      notConfigured:
        "Chưa cấu hình Supabase. Thêm NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY vào .env.local.",
      signInRequired: "Đăng nhập để lưu hóa đơn lên đám mây.",
      syncing: "Đang đồng bộ với cơ sở dữ liệu…",
      updated: "Đã cập nhật hóa đơn trên cơ sở dữ liệu.",
      created: "Đã lưu hóa đơn mới lên cơ sở dữ liệu.",
      failed: "Không thể lưu hóa đơn lên cơ sở dữ liệu.",
    },
    selectors: {
      languageAria: "Chọn ngôn ngữ giao diện",
      currencyAria: "Chọn đơn vị tiền tệ",
      languageOptions: {
        vi: "🇻🇳 Tiếng Việt",
        en: "🇺🇸 English",
        zh: "🇨🇳 简体中文",
        ja: "🇯🇵 日本語",
        ko: "🇰🇷 한국어",
      },
      currencyOptions: {
        VND: "VND (đ)",
        USD: "USD ($)",
        EUR: "EUR (€)",
        GBP: "GBP (£)",
        CNY: "CNY (¥)",
        JPY: "JPY (¥)",
        KRW: "KRW (₩)",
      },
    },
    dashboard: {
      title: "Hóa đơn của tôi",
      subtitle: "Quản lý hóa đơn đã lưu trên đám mây.",
      refresh: "Làm mới",
      newInvoice: "Hóa đơn mới",
      emptyNotConfigured:
        "Đăng nhập và cấu hình Supabase để tải hóa đơn đã lưu.",
      emptyNoInvoices:
        "Chưa có hóa đơn. Lưu một hóa đơn từ trình tạo bằng nút «Lưu đám mây».",
      loading: "Đang tải hóa đơn…",
      invoiceNumber: "Số HĐ",
      client: "Khách hàng",
      total: "Tổng",
      created: "Ngày tạo",
      status: "Trạng thái",
      actions: "Thao tác",
      editInvoice: "Sửa hóa đơn",
      deleteInvoice: "Xóa hóa đơn",
      changeStatus: "Đổi trạng thái",
    },
    auth: {
      signIn: "Đăng nhập",
      signOut: "Đăng xuất",
      signedInFallback: "Đã đăng nhập",
      signInTitle: "Đăng nhập SnapBill",
      emailStepHint:
        "Nhập email để nhận mã OTP 8 số—không cần mật khẩu.",
      otpStepHint:
        "Mã đã gửi tới {email}. Nhập 8 số trong email.",
      close: "Đóng",
      dismissError: "Đóng thông báo",
      dismissShort: "Đóng",
      emailLabel: "Email",
      emailPlaceholder: "ban@congty.com",
      sendCode: "Gửi mã xác thực",
      sendingCode: "Đang gửi…",
      otpLabel: "Mã OTP (8 chữ số)",
      verify: "Xác nhận Đăng nhập",
      verifying: "Đang xác nhận…",
      changeEmail: "Đổi email",
      resendCode: "Gửi lại mã",
      orDivider: "Hoặc",
      continueGoogle: "Tiếp tục với Google",
      supabaseOtpHint:
        "Cấu hình Supabase: Email template dạng OTP 8 số và bật Google OAuth với Redirect URL khớp origin ứng dụng.",
      envHintBefore: "Thêm biến Supabase vào",
      envHintAfter: "để đăng nhập.",
      needSupabaseKeys:
        "Cần khóa Supabase trong .env.local để đăng nhập cục bộ.",
      errors: {
        emailRequired: "Vui lòng nhập địa chỉ email.",
        supabaseNotConfigured:
          "Chưa cấu hình Supabase. Thêm khóa dự án vào .env để đăng nhập.",
        emailMissingForOtp: "Thiếu email. Vui lòng gửi mã lại.",
        otpInvalid: "Mã OTP phải gồm đúng 8 chữ số.",
        supabaseNotConfiguredShort: "Chưa cấu hình Supabase.",
      },
    },
    docs: {
      title: "Tài liệu SnapBill",
      subtitle:
        "Hướng dẫn nhanh để tạo, xuất PDF và lưu hóa đơn trên đám mây.",
      editorSection: "Trình tạo hóa đơn",
      editorBullet1Before:
        "Điền thông tin người gửi, khách hàng và dòng sản phẩm/dịch vụ tại mục",
      editorBullet1After: ".",
      editorBullet2:
        "Xem trước thời gian thực ở cột bên phải (desktop).",
      editorBullet3Before: "Tải PDF trực tiếp từ nút",
      editorBullet3After: "trên preview.",
      accountSection: "Tài khoản & bảo mật",
      accountBullet1:
        "Khách vãng lai: tạo và tải PDF miễn phí, dữ liệu chỉ lưu trên trình duyệt.",
      accountBullet2:
        "Đăng nhập bằng email OTP 8 số hoặc Google để lưu hóa đơn.",
      accountBullet3Before: "Quản lý lịch sử tại",
      accountBullet3After: "sau khi đăng nhập.",
      footer:
        "SnapBill — công cụ tạo hóa đơn miễn phí cho freelancer và doanh nghiệp nhỏ.",
    },
  },
  en: {
    preview: {
      invoice: "INVOICE",
      from: "FROM",
      to: "TO",
      invoiceNumber: "Invoice #",
      status: "Status",
      issueDate: "Issue date",
      dueDate: "Due date",
      billTo: "Bill to",
      amountDue: "Amount due",
      logoPlaceholder: "Logo",
      description: "Description",
      qty: "Qty",
      unit: "Unit",
      lineTotal: "Total",
      subtotal: "Subtotal",
      tax: "Tax",
      discount: "Discount",
      total: "TOTAL DUE",
      notes: "Notes",
      taxVat: "Tax / VAT",
      defaultCompany: "Your company name",
      defaultClient: "Client name",
      defaultLineItem: "Line item description",
    },
    nav: {
      editor: "Editor",
      myInvoices: "My Invoices",
      docs: "Docs",
      mainNav: "Main navigation",
    },
    brand: {
      freeTag: "Free",
    },
    editor: {
      title: "Invoice details",
      saveToCloud: "Save to Cloud",
      saving: "Saving…",
      signInForCloud: "Sign in to enable cloud saves.",
      configureSupabase: "Configure Supabase in .env to enable cloud saves.",
      sender: "COMPANY INFORMATION",
      client: "CLIENT INFORMATION",
      invoiceSection: "Invoice",
      companyName: "Company name",
      senderName: "Sender name",
      email: "Email",
      taxId: "Tax / VAT ID",
      address: "Address",
      logo: "Logo",
      logoFormats: "PNG / JPG",
      clearLogo: "Clear",
      uploadLogo: "Upload company logo",
      clientName: "Client name",
      clientEmail: "Client email",
      billingAddress: "Billing address",
      invoiceNumber: "Invoice number",
      status: "Status",
      issueDate: "Issue date",
      dueDate: "Due date",
      taxRate: "Tax rate (%)",
      discountRate: "Discount (%)",
      notesPayment: "Notes / payment terms",
      lineItems: "Line items",
      addItem: "Add item",
      unitPrice: "Unit price",
      removeLineItem: "Remove line item",
      clearLineItem: "Clear line item",
      guestCallout:
        "Create a free account to save and manage your invoice history across all your devices.",
      placeholders: {
        companyName: "Acme Studio",
        senderName: "Your name",
        email: "billing@company.com",
        taxId: "Optional",
        address: "Street, city, postal code",
        clientName: "Client or company",
        clientEmail: "accounts@client.com",
        billingAddress: "Billing address",
        invoiceNumber: "INV-001",
        notes: "Bank details, thank-you message, or payment instructions.",
        lineDescription: "Service or product",
      },
      logoErrors: {
        invalidType: "Please upload a PNG or JPG image.",
        tooLarge: "Logo must be 2 MB or smaller.",
        readFailed: "Could not read that image file.",
      },
    },
    previewChrome: {
      livePreview: "Live preview",
      downloadPdf: "Download PDF",
      printPdf: "Print PDF",
      preparingPdf: "Preparing PDF…",
      previewAria: "Invoice preview sheet",
    },
    statusLabels: {
      draft: "Draft",
      sent: "Sent",
      paid: "Paid",
      overdue: "Overdue",
    },
    cloudSave: {
      notConfigured:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
      signInRequired: "Sign in to save invoices to the cloud.",
      syncing: "Syncing with Supabase…",
      updated: "Invoice updated on Supabase.",
      created: "New invoice saved to Supabase.",
      failed: "Could not save invoice to Supabase.",
    },
    selectors: {
      languageAria: "Select interface language",
      currencyAria: "Select currency",
      languageOptions: {
        vi: "🇻🇳 Vietnamese",
        en: "🇺🇸 English",
        zh: "🇨🇳 Simplified Chinese",
        ja: "🇯🇵 Japanese",
        ko: "🇰🇷 Korean",
      },
      currencyOptions: {
        VND: "VND (đ)",
        USD: "USD ($)",
        EUR: "EUR (€)",
        GBP: "GBP (£)",
        CNY: "CNY (¥)",
        JPY: "JPY (¥)",
        KRW: "KRW (₩)",
      },
    },
    dashboard: {
      title: "My Invoices",
      subtitle: "Manage saved invoices from the cloud.",
      refresh: "Refresh",
      newInvoice: "New invoice",
      emptyNotConfigured:
        "Sign in with Supabase configured to load saved invoices.",
      emptyNoInvoices:
        'No invoices yet. Save one from the editor with "Save to Cloud".',
      loading: "Loading invoices…",
      invoiceNumber: "Invoice #",
      client: "Client",
      total: "Total",
      created: "Created",
      status: "Status",
      actions: "Actions",
      editInvoice: "Edit invoice",
      deleteInvoice: "Delete invoice",
      changeStatus: "Change status",
    },
    auth: {
      signIn: "Sign in",
      signOut: "Sign out",
      signedInFallback: "Signed in",
      signInTitle: "Sign in to SnapBill",
      emailStepHint:
        "Enter your email to receive an 8-digit OTP—no password required.",
      otpStepHint:
        "Code sent to {email}. Enter the 8 digits from your email.",
      close: "Close",
      dismissError: "Dismiss message",
      dismissShort: "Dismiss",
      emailLabel: "Email",
      emailPlaceholder: "you@company.com",
      sendCode: "Send verification code",
      sendingCode: "Sending…",
      otpLabel: "OTP code (8 digits)",
      verify: "Confirm sign-in",
      verifying: "Verifying…",
      changeEmail: "Change email",
      resendCode: "Resend code",
      orDivider: "Or",
      continueGoogle: "Continue with Google",
      supabaseOtpHint:
        "Supabase setup: use an 8-digit OTP email template and enable Google OAuth with a redirect URL matching this app origin.",
      envHintBefore: "Add Supabase variables to",
      envHintAfter: "to enable sign-in.",
      needSupabaseKeys:
        "Supabase keys in .env.local are required for local sign-in.",
      errors: {
        emailRequired: "Please enter your email address.",
        supabaseNotConfigured:
          "Supabase is not configured. Add project keys to .env to sign in.",
        emailMissingForOtp: "Email missing. Please send a new code.",
        otpInvalid: "OTP must be exactly 8 digits.",
        supabaseNotConfiguredShort: "Supabase is not configured.",
      },
    },
    docs: {
      title: "SnapBill Docs",
      subtitle:
        "Quick guide to creating invoices, exporting PDFs, and cloud saves.",
      editorSection: "Invoice editor",
      editorBullet1Before:
        "Fill in sender, client, and line items in the",
      editorBullet1After: " workspace.",
      editorBullet2: "See a live preview in the right column (desktop).",
      editorBullet3Before: "Download a PDF from the",
      editorBullet3After: "button on the preview.",
      accountSection: "Account & security",
      accountBullet1:
        "Guests: create and download PDFs for free; data stays in your browser only.",
      accountBullet2:
        "Sign in with an 8-digit email OTP or Google to save invoices.",
      accountBullet3Before: "Manage history in",
      accountBullet3After: "after you sign in.",
      footer:
        "SnapBill — free invoicing for freelancers and small businesses.",
    },
  },
  zh: {
    preview: {
      invoice: "发票",
      from: "公司信息",
      to: "客户信息",
      invoiceNumber: "发票号",
      status: "状态",
      issueDate: "开票日期",
      dueDate: "到期日",
      billTo: "客户",
      amountDue: "应付金额",
      logoPlaceholder: "标志",
      description: "描述",
      qty: "数量",
      unit: "单价",
      lineTotal: "金额",
      subtotal: "小计",
      tax: "税费",
      discount: "折扣",
      total: "合计",
      notes: "备注",
      taxVat: "税号 / VAT",
      defaultCompany: "您的公司名称",
      defaultClient: "客户名称",
      defaultLineItem: "行项目描述",
    },
    nav: {
      editor: "编辑器",
      myInvoices: "我的发票",
      docs: "文档",
      mainNav: "主导航",
    },
    brand: {
      freeTag: "免费",
    },
    editor: {
      title: "发票详情",
      saveToCloud: "保存到云端",
      saving: "保存中…",
      signInForCloud: "登录以启用云端保存。",
      configureSupabase: "在 .env 中配置 Supabase 以启用云端保存。",
      sender: "公司信息",
      client: "客户信息",
      invoiceSection: "发票",
      companyName: "公司名称",
      senderName: "发件人姓名",
      email: "邮箱",
      taxId: "税号 / VAT",
      address: "地址",
      logo: "标志",
      logoFormats: "PNG / JPG",
      clearLogo: "清除",
      uploadLogo: "上传公司标志",
      clientName: "客户名称",
      clientEmail: "客户邮箱",
      billingAddress: "账单地址",
      invoiceNumber: "发票号码",
      status: "状态",
      issueDate: "开票日期",
      dueDate: "到期日",
      taxRate: "税率 (%)",
      discountRate: "折扣 (%)",
      notesPayment: "备注 / 付款条款",
      lineItems: "行项目",
      addItem: "添加行",
      unitPrice: "单价",
      removeLineItem: "删除行",
      clearLineItem: "清空行内容",
      guestCallout:
        "注册免费账户，可在所有设备上永久保存和管理发票历史记录。",
      placeholders: {
        companyName: "示例科技有限公司",
        senderName: "您的姓名",
        email: "billing@company.com",
        taxId: "选填",
        address: "街道、城市、邮编",
        clientName: "客户或公司",
        clientEmail: "accounts@client.com",
        billingAddress: "账单地址",
        invoiceNumber: "INV-001",
        notes: "银行信息、致谢语或付款说明。",
        lineDescription: "服务或产品",
      },
      logoErrors: {
        invalidType: "请上传 PNG 或 JPG 图片。",
        tooLarge: "标志文件不得超过 2 MB。",
        readFailed: "无法读取该图片文件。",
      },
    },
    previewChrome: {
      livePreview: "实时预览",
      downloadPdf: "下载 PDF",
      printPdf: "打印 PDF",
      preparingPdf: "正在生成 PDF…",
      previewAria: "发票预览",
    },
    statusLabels: {
      draft: "草稿",
      sent: "已发送",
      paid: "已付款",
      overdue: "逾期",
    },
    cloudSave: {
      notConfigured:
        "未配置 Supabase。请在 .env.local 中添加 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY。",
      signInRequired: "请登录以将发票保存到云端。",
      syncing: "正在与数据库同步…",
      updated: "发票已在数据库中更新。",
      created: "新发票已保存到数据库。",
      failed: "无法将发票保存到数据库。",
    },
    selectors: {
      languageAria: "选择界面语言",
      currencyAria: "选择货币",
      languageOptions: {
        vi: "🇻🇳 越南语",
        en: "🇺🇸 英语",
        zh: "🇨🇳 简体中文",
        ja: "🇯🇵 日语",
        ko: "🇰🇷 韩语",
      },
      currencyOptions: {
        VND: "VND (đ)",
        USD: "USD ($)",
        EUR: "EUR (€)",
        GBP: "GBP (£)",
        CNY: "CNY (¥)",
        JPY: "JPY (¥)",
        KRW: "KRW (₩)",
      },
    },
    dashboard: {
      title: "我的发票",
      subtitle: "管理云端保存的发票。",
      refresh: "刷新",
      newInvoice: "新建发票",
      emptyNotConfigured: "请登录并配置 Supabase 以加载已保存的发票。",
      emptyNoInvoices:
        "暂无发票。请在编辑器中使用「保存到云端」按钮保存发票。",
      loading: "正在加载发票…",
      invoiceNumber: "发票号",
      client: "客户",
      total: "合计",
      created: "创建时间",
      status: "状态",
      actions: "操作",
      editInvoice: "编辑发票",
      deleteInvoice: "删除发票",
      changeStatus: "更改状态",
    },
    auth: {
      signIn: "登录",
      signOut: "退出",
      signedInFallback: "已登录",
      signInTitle: "登录 SnapBill",
      emailStepHint: "输入邮箱以接收 8 位 OTP，无需密码。",
      otpStepHint: "验证码已发送至 {email}。请输入邮件中的 8 位数字。",
      close: "关闭",
      dismissError: "关闭消息",
      dismissShort: "关闭",
      emailLabel: "邮箱",
      emailPlaceholder: "you@company.com",
      sendCode: "发送验证码",
      sendingCode: "发送中…",
      otpLabel: "OTP 验证码（8 位）",
      verify: "确认登录",
      verifying: "验证中…",
      changeEmail: "更换邮箱",
      resendCode: "重新发送",
      orDivider: "或",
      continueGoogle: "使用 Google 继续",
      supabaseOtpHint:
        "Supabase 配置：使用 8 位 OTP 邮件模板，并启用 Google OAuth，重定向 URL 需与本应用来源一致。",
      envHintBefore: "将 Supabase 变量添加到",
      envHintAfter: "以启用登录。",
      needSupabaseKeys: "本地登录需要在 .env.local 中配置 Supabase 密钥。",
      errors: {
        emailRequired: "请输入邮箱地址。",
        supabaseNotConfigured:
          "未配置 Supabase。请在 .env 中添加项目密钥以登录。",
        emailMissingForOtp: "缺少邮箱。请重新发送验证码。",
        otpInvalid: "OTP 必须为 8 位数字。",
        supabaseNotConfiguredShort: "未配置 Supabase。",
      },
    },
    docs: {
      title: "SnapBill 文档",
      subtitle: "快速了解如何创建发票、导出 PDF 及云端保存。",
      editorSection: "发票编辑器",
      editorBullet1Before: "在",
      editorBullet1After: "工作区填写发件人、客户和行项目信息。",
      editorBullet2: "在右侧栏查看实时预览（桌面端）。",
      editorBullet3Before: "通过预览上的",
      editorBullet3After: "按钮下载 PDF。",
      accountSection: "账户与安全",
      accountBullet1: "访客：可免费创建和下载 PDF，数据仅保存在浏览器中。",
      accountBullet2: "使用 8 位邮箱 OTP 或 Google 登录以保存发票。",
      accountBullet3Before: "登录后在",
      accountBullet3After: "中管理历史记录。",
      footer: "SnapBill — 为自由职业者和小企业提供的免费发票工具。",
    },
  },
  ja: {
    preview: {
      invoice: "請求書",
      from: "会社情報",
      to: "お客様情報",
      invoiceNumber: "請求書番号",
      status: "ステータス",
      issueDate: "発行日",
      dueDate: "支払期限",
      billTo: "請求先",
      amountDue: "請求金額",
      logoPlaceholder: "ロゴ",
      description: "内容",
      qty: "数量",
      unit: "単価",
      lineTotal: "金額",
      subtotal: "小計",
      tax: "税",
      discount: "割引",
      total: "合計",
      notes: "備考",
      taxVat: "税番号 / VAT",
      defaultCompany: "会社名",
      defaultClient: "お客様名",
      defaultLineItem: "明細の説明",
    },
    nav: {
      editor: "エディター",
      myInvoices: "請求書一覧",
      docs: "ドキュメント",
      mainNav: "メインナビゲーション",
    },
    brand: {
      freeTag: "無料",
    },
    editor: {
      title: "請求書の詳細",
      saveToCloud: "クラウドに保存",
      saving: "保存中…",
      signInForCloud: "クラウド保存を有効にするにはログインしてください。",
      configureSupabase:
        "クラウド保存を有効にするには .env で Supabase を設定してください。",
      sender: "会社情報",
      client: "お客様情報",
      invoiceSection: "請求書",
      companyName: "会社名",
      senderName: "送信者名",
      email: "メール",
      taxId: "税番号 / VAT",
      address: "住所",
      logo: "ロゴ",
      logoFormats: "PNG / JPG",
      clearLogo: "削除",
      uploadLogo: "会社ロゴをアップロード",
      clientName: "お客様名",
      clientEmail: "お客様メール",
      billingAddress: "請求先住所",
      invoiceNumber: "請求書番号",
      status: "ステータス",
      issueDate: "発行日",
      dueDate: "支払期限",
      taxRate: "税率 (%)",
      discountRate: "割引 (%)",
      notesPayment: "備考 / 支払条件",
      lineItems: "明細",
      addItem: "行を追加",
      unitPrice: "単価",
      removeLineItem: "行を削除",
      clearLineItem: "行の内容をクリア",
      guestCallout:
        "無料アカウントを作成すると、すべてのデバイスで請求書履歴を保存・管理できます。",
      placeholders: {
        companyName: "株式会社サンプル",
        senderName: "お名前",
        email: "billing@company.com",
        taxId: "任意",
        address: "住所、市区町村、郵便番号",
        clientName: "お客様または会社名",
        clientEmail: "accounts@client.com",
        billingAddress: "請求先住所",
        invoiceNumber: "INV-001",
        notes: "振込先、お礼のメッセージ、支払い案内など。",
        lineDescription: "サービスまたは商品",
      },
      logoErrors: {
        invalidType: "PNG または JPG 画像をアップロードしてください。",
        tooLarge: "ロゴは 2 MB 以下にしてください。",
        readFailed: "画像ファイルを読み込めませんでした。",
      },
    },
    previewChrome: {
      livePreview: "ライブプレビュー",
      downloadPdf: "PDFをダウンロード",
      printPdf: "PDFを印刷",
      preparingPdf: "PDFを作成中…",
      previewAria: "請求書プレビュー",
    },
    statusLabels: {
      draft: "下書き",
      sent: "送信済み",
      paid: "支払済み",
      overdue: "期限超過",
    },
    cloudSave: {
      notConfigured:
        "Supabase が設定されていません。.env.local に NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を追加してください。",
      signInRequired: "クラウドに請求書を保存するにはログインしてください。",
      syncing: "データベースと同期中…",
      updated: "データベースの請求書を更新しました。",
      created: "新しい請求書をデータベースに保存しました。",
      failed: "請求書をデータベースに保存できませんでした。",
    },
    selectors: {
      languageAria: "表示言語を選択",
      currencyAria: "通貨を選択",
      languageOptions: {
        vi: "🇻🇳 ベトナム語",
        en: "🇺🇸 英語",
        zh: "🇨🇳 中国語（簡体字）",
        ja: "🇯🇵 日本語",
        ko: "🇰🇷 韓国語",
      },
      currencyOptions: {
        VND: "VND (đ)",
        USD: "USD ($)",
        EUR: "EUR (€)",
        GBP: "GBP (£)",
        CNY: "CNY (¥)",
        JPY: "JPY (¥)",
        KRW: "KRW (₩)",
      },
    },
    dashboard: {
      title: "請求書一覧",
      subtitle: "クラウドに保存された請求書を管理します。",
      refresh: "更新",
      newInvoice: "新規請求書",
      emptyNotConfigured:
        "保存済み請求書を読み込むには、ログインして Supabase を設定してください。",
      emptyNoInvoices:
        "請求書がありません。エディターから「クラウドに保存」で保存してください。",
      loading: "請求書を読み込み中…",
      invoiceNumber: "請求書番号",
      client: "お客様",
      total: "合計",
      created: "作成日",
      status: "ステータス",
      actions: "操作",
      editInvoice: "請求書を編集",
      deleteInvoice: "請求書を削除",
      changeStatus: "ステータスを変更",
    },
    auth: {
      signIn: "ログイン",
      signOut: "ログアウト",
      signedInFallback: "ログイン済み",
      signInTitle: "SnapBill にログイン",
      emailStepHint:
        "メールアドレスを入力して 8 桁の OTP を受け取ります。パスワードは不要です。",
      otpStepHint:
        "認証コードを {email} に送信しました。メールの 8 桁の数字を入力してください。",
      close: "閉じる",
      dismissError: "メッセージを閉じる",
      dismissShort: "閉じる",
      emailLabel: "メール",
      emailPlaceholder: "you@company.com",
      sendCode: "認証コードを送信",
      sendingCode: "送信中…",
      otpLabel: "OTP コード（8 桁）",
      verify: "ログインを確認",
      verifying: "確認中…",
      changeEmail: "メールを変更",
      resendCode: "コードを再送信",
      orDivider: "または",
      continueGoogle: "Google で続行",
      supabaseOtpHint:
        "Supabase の設定：8 桁 OTP のメールテンプレートを使用し、このアプリのオリジンに一致するリダイレクト URL で Google OAuth を有効にしてください。",
      envHintBefore: "Supabase の環境変数を",
      envHintAfter: "に追加してログインを有効にしてください。",
      needSupabaseKeys:
        "ローカルでログインするには .env.local に Supabase キーが必要です。",
      errors: {
        emailRequired: "メールアドレスを入力してください。",
        supabaseNotConfigured:
          "Supabase が設定されていません。ログインするには .env にプロジェクトキーを追加してください。",
        emailMissingForOtp:
          "メールがありません。認証コードを再送信してください。",
        otpInvalid: "OTP は 8 桁の数字である必要があります。",
        supabaseNotConfiguredShort: "Supabase が設定されていません。",
      },
    },
    docs: {
      title: "SnapBill ドキュメント",
      subtitle:
        "請求書の作成、PDF のエクスポート、クラウド保存のクイックガイド。",
      editorSection: "請求書エディター",
      editorBullet1Before: "",
      editorBullet1After: "で送信者、お客様、明細を入力します。",
      editorBullet2: "右カラムでライブプレビューを確認できます（デスクトップ）。",
      editorBullet3Before: "プレビューの",
      editorBullet3After: "ボタンから PDF をダウンロードできます。",
      accountSection: "アカウントとセキュリティ",
      accountBullet1:
        "ゲスト：無料で PDF を作成・ダウンロードできます。データはブラウザのみに保存されます。",
      accountBullet2:
        "8 桁のメール OTP または Google でログインして請求書を保存できます。",
      accountBullet3Before: "ログイン後、",
      accountBullet3After: "で履歴を管理できます。",
      footer:
        "SnapBill — フリーランスと中小企業向けの無料請求書ツール。",
    },
  },
  ko: {
    preview: {
      invoice: "청구서",
      from: "회사 정보",
      to: "고객 정보",
      invoiceNumber: "청구서 번호",
      status: "상태",
      issueDate: "발행일",
      dueDate: "결제 기한",
      billTo: "청구 대상",
      amountDue: "청구 금액",
      logoPlaceholder: "로고",
      description: "설명",
      qty: "수량",
      unit: "단가",
      lineTotal: "금액",
      subtotal: "소계",
      tax: "세금",
      discount: "할인",
      total: "합계",
      notes: "비고",
      taxVat: "사업자등록번호 / VAT",
      defaultCompany: "회사명",
      defaultClient: "고객명",
      defaultLineItem: "항목 설명",
    },
    nav: {
      editor: "편집기",
      myInvoices: "내 청구서",
      docs: "문서",
      mainNav: "주 메뉴",
    },
    brand: {
      freeTag: "무료",
    },
    editor: {
      title: "청구서 상세",
      saveToCloud: "클라우드에 저장",
      saving: "저장 중…",
      signInForCloud: "클라우드 저장을 사용하려면 로그인하세요.",
      configureSupabase:
        "클라우드 저장을 사용하려면 .env에서 Supabase를 설정하세요.",
      sender: "회사 정보",
      client: "고객 정보",
      invoiceSection: "청구서",
      companyName: "회사명",
      senderName: "발신자 이름",
      email: "이메일",
      taxId: "사업자등록번호 / VAT",
      address: "주소",
      logo: "로고",
      logoFormats: "PNG / JPG",
      clearLogo: "삭제",
      uploadLogo: "회사 로고 업로드",
      clientName: "고객명",
      clientEmail: "고객 이메일",
      billingAddress: "청구 주소",
      invoiceNumber: "청구서 번호",
      status: "상태",
      issueDate: "발행일",
      dueDate: "결제 기한",
      taxRate: "세율 (%)",
      discountRate: "할인 (%)",
      notesPayment: "비고 / 결제 조건",
      lineItems: "항목",
      addItem: "항목 추가",
      unitPrice: "단가",
      removeLineItem: "항목 삭제",
      clearLineItem: "항목 내용 지우기",
      guestCallout:
        "무료 계정을 만들면 모든 기기에서 청구서 기록을 저장하고 관리할 수 있습니다.",
      placeholders: {
        companyName: "주식회사 샘플",
        senderName: "이름",
        email: "billing@company.com",
        taxId: "선택",
        address: "도로명, 시/구, 우편번호",
        clientName: "고객 또는 회사명",
        clientEmail: "accounts@client.com",
        billingAddress: "청구 주소",
        invoiceNumber: "INV-001",
        notes: "계좌 정보, 감사 인사, 결제 안내 등.",
        lineDescription: "서비스 또는 제품",
      },
      logoErrors: {
        invalidType: "PNG 또는 JPG 이미지를 업로드하세요.",
        tooLarge: "로고는 2MB 이하여야 합니다.",
        readFailed: "이미지 파일을 읽을 수 없습니다.",
      },
    },
    previewChrome: {
      livePreview: "실시간 미리보기",
      downloadPdf: "PDF 다운로드",
      printPdf: "PDF 인쇄",
      preparingPdf: "PDF 생성 중…",
      previewAria: "청구서 미리보기",
    },
    statusLabels: {
      draft: "초안",
      sent: "발송됨",
      paid: "결제 완료",
      overdue: "연체",
    },
    cloudSave: {
      notConfigured:
        "Supabase가 설정되지 않았습니다. .env.local에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 추가하세요.",
      signInRequired: "클라우드에 청구서를 저장하려면 로그인하세요.",
      syncing: "데이터베이스와 동기화 중…",
      updated: "데이터베이스의 청구서가 업데이트되었습니다.",
      created: "새 청구서가 데이터베이스에 저장되었습니다.",
      failed: "청구서를 데이터베이스에 저장할 수 없습니다.",
    },
    selectors: {
      languageAria: "표시 언어 선택",
      currencyAria: "통화 선택",
      languageOptions: {
        vi: "🇻🇳 베트남어",
        en: "🇺🇸 영어",
        zh: "🇨🇳 중국어(간체)",
        ja: "🇯🇵 일본어",
        ko: "🇰🇷 한국어",
      },
      currencyOptions: {
        VND: "VND (đ)",
        USD: "USD ($)",
        EUR: "EUR (€)",
        GBP: "GBP (£)",
        CNY: "CNY (¥)",
        JPY: "JPY (¥)",
        KRW: "KRW (₩)",
      },
    },
    dashboard: {
      title: "내 청구서",
      subtitle: "클라우드에 저장된 청구서를 관리합니다.",
      refresh: "새로고침",
      newInvoice: "새 청구서",
      emptyNotConfigured:
        "저장된 청구서를 불러오려면 로그인하고 Supabase를 설정하세요.",
      emptyNoInvoices:
        "청구서가 없습니다. 편집기에서 「클라우드에 저장」으로 저장하세요.",
      loading: "청구서 불러오는 중…",
      invoiceNumber: "청구서 번호",
      client: "고객",
      total: "합계",
      created: "생성일",
      status: "상태",
      actions: "작업",
      editInvoice: "청구서 편집",
      deleteInvoice: "청구서 삭제",
      changeStatus: "상태 변경",
    },
    auth: {
      signIn: "로그인",
      signOut: "로그아웃",
      signedInFallback: "로그인됨",
      signInTitle: "SnapBill 로그인",
      emailStepHint:
        "이메일을 입력하면 8자리 OTP를 받습니다. 비밀번호는 필요 없습니다.",
      otpStepHint:
        "인증 코드가 {email}(으)로 전송되었습니다. 이메일의 8자리 숫자를 입력하세요.",
      close: "닫기",
      dismissError: "메시지 닫기",
      dismissShort: "닫기",
      emailLabel: "이메일",
      emailPlaceholder: "you@company.com",
      sendCode: "인증 코드 보내기",
      sendingCode: "전송 중…",
      otpLabel: "OTP 코드 (8자리)",
      verify: "로그인 확인",
      verifying: "확인 중…",
      changeEmail: "이메일 변경",
      resendCode: "코드 재전송",
      orDivider: "또는",
      continueGoogle: "Google로 계속",
      supabaseOtpHint:
        "Supabase 설정: 8자리 OTP 이메일 템플릿을 사용하고, 이 앱 origin과 일치하는 리다이렉트 URL로 Google OAuth를 활성화하세요.",
      envHintBefore: "Supabase 환경 변수를",
      envHintAfter: "에 추가하여 로그인을 활성화하세요.",
      needSupabaseKeys:
        "로컬 로그인에는 .env.local에 Supabase 키가 필요합니다.",
      errors: {
        emailRequired: "이메일 주소를 입력하세요.",
        supabaseNotConfigured:
          "Supabase가 설정되지 않았습니다. 로그인하려면 .env에 프로젝트 키를 추가하세요.",
        emailMissingForOtp: "이메일이 없습니다. 인증 코드를 다시 보내세요.",
        otpInvalid: "OTP는 8자리 숫자여야 합니다.",
        supabaseNotConfiguredShort: "Supabase가 설정되지 않았습니다.",
      },
    },
    docs: {
      title: "SnapBill 문서",
      subtitle: "청구서 작성, PDF보내기, 클라우드 저장 빠른 가이드.",
      editorSection: "청구서 편집기",
      editorBullet1Before: "",
      editorBullet1After: "에서 발신자, 고객, 항목을 입력하세요.",
      editorBullet2: "오른쪽 열에서 실시간 미리보기를 확인할 수 있습니다(데스크톱).",
      editorBullet3Before: "미리보기의",
      editorBullet3After: "버튼으로 PDF를 다운로드하세요.",
      accountSection: "계정 및 보안",
      accountBullet1:
        "게스트: 무료로 PDF를 만들고 다운로드할 수 있으며, 데이터는 브라우저에만 저장됩니다.",
      accountBullet2:
        "8자리 이메일 OTP 또는 Google로 로그인하여 청구서를 저장하세요.",
      accountBullet3Before: "로그인 후",
      accountBullet3After: "에서 기록을 관리하세요.",
      footer:
        "SnapBill — 프리랜서와 소규모 기업을 위한 무료 청구서 도구.",
    },
  },
};

export function formatAuthOtpHint(template: string, maskedEmail: string): string {
  return template.replace("{email}", maskedEmail);
}

export function readStoredInterfaceLanguage(): InvoiceLanguage {
  if (typeof window === "undefined") {
    return "vi";
  }
  try {
    return parseInvoiceLanguage(
      window.localStorage.getItem(INVOICE_LANGUAGE_STORAGE_KEY),
    );
  } catch {
    return "vi";
  }
}

export function readStoredInterfaceCurrency(): InvoiceCurrency {
  if (typeof window === "undefined") {
    return "VND";
  }
  try {
    return parseInvoiceCurrency(
      window.localStorage.getItem(INVOICE_CURRENCY_STORAGE_KEY),
    );
  } catch {
    return "VND";
  }
}

export function getAppLabels(language: InvoiceLanguage): AppLabels {
  return LABELS[language];
}

/** @deprecated Use getAppLabels(language).preview */
export function getInvoicePreviewLabels(
  language: InvoiceLanguage,
): InvoicePreviewLabels {
  return getAppLabels(language).preview;
}

export function formatInvoiceDate(
  isoDate: string,
  language: InvoiceLanguage,
): string {
  const parsed = Date.parse(`${isoDate}T00:00:00`);
  if (!Number.isFinite(parsed)) {
    return isoDate;
  }
  const locale = LANGUAGE_DATE_LOCALE[language];
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(parsed));
}

export function statusLabel(
  status: InvoiceStatus,
  language: InvoiceLanguage,
): string {
  return getAppLabels(language).statusLabels[status];
}
