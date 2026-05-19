import type { InvoiceLanguage } from "@/types/locale";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface LegalSection {
  heading: string;
  paragraphs: readonly string[];
}

export interface SitePagesContent {
  seo: {
    howToTitle: string;
    howToSteps: readonly string[];
    professionalTitle: string;
    professionalIntro: string;
    invoiceComponentsTitle: string;
    invoiceComponents: readonly string[];
    faqTitle: string;
    faq: readonly FaqItem[];
  };
  footer: {
    tagline: string;
    privacy: string;
    terms: string;
    contact: string;
    copyright: string;
  };
  legal: {
    lastUpdated: string;
    privacy: {
      title: string;
      intro: string;
      sections: readonly LegalSection[];
    };
    terms: {
      title: string;
      intro: string;
      sections: readonly LegalSection[];
    };
    contact: {
      title: string;
      intro: string;
      emailLabel: string;
      email: string;
      emailHint: string;
      formTitle: string;
      formName: string;
      formNamePlaceholder: string;
      formEmail: string;
      formEmailPlaceholder: string;
      formMessage: string;
      formMessagePlaceholder: string;
      formSubmit: string;
      formNote: string;
      backHome: string;
    };
  };
}

const SITE_PAGES: Record<InvoiceLanguage, SitePagesContent> = {
  en: {
    seo: {
      howToTitle: "How to use SnapBill Invoice Generator",
      howToSteps: [
        "Enter your company details, client information, and line items in the editor on the left. Choose your language and currency from the toolbar.",
        "Watch the live preview update instantly on the right. Adjust tax rate, discount, dates, and payment notes as needed.",
        "Click Download PDF or Print to export a professional invoice. No account is required for guest use.",
        "Optional: sign in with email or Google to save invoices securely to your cloud dashboard for later editing.",
      ],
      professionalTitle: "What is a Professional Invoice?",
      professionalIntro:
        "A professional invoice is a formal payment request that documents a sale of goods or services. It helps you get paid on time, supports accounting, and may be required for tax compliance depending on your jurisdiction.",
      invoiceComponentsTitle: "Essential elements of a valid invoice",
      invoiceComponents: [
        "Unique invoice number and issue date",
        "Seller and buyer names, addresses, and tax IDs where applicable",
        "Clear description of products or services, quantities, and unit prices",
        "Subtotal, taxes, discounts, and total amount due",
        "Payment terms, due date, and optional notes or bank details",
      ],
      faqTitle: "Frequently Asked Questions (FAQ)",
      faq: [
        {
          question: "Is SnapBill free to use?",
          answer:
            "Yes. SnapBill is free for creating, previewing, and downloading invoices. Optional cloud save requires a free account when Supabase is configured on the deployment.",
        },
        {
          question: "Does SnapBill store my financial or personal data?",
          answer:
            "Invoice drafting runs in your browser. Guest data stays on your device unless you choose to sign in and save to the cloud. We do not sell invoice content. See our Privacy Policy for details.",
        },
        {
          question: "Can I download the invoice as a PDF?",
          answer:
            "Yes. Use the Download PDF button in the live preview panel. The PDF is generated client-side from your current invoice layout.",
        },
      ],
    },
    footer: {
      tagline: "Free professional invoice generator for freelancers and small businesses.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      contact: "Contact Us",
      copyright: "© 2026 SnapBill. All rights reserved.",
    },
    legal: {
      lastUpdated: "Last updated: May 19, 2026",
      privacy: {
        title: "Privacy Policy",
        intro:
          "SnapBill respects your privacy. This policy explains what we collect, what we do not collect, and how we protect you when you use our free invoice generator.",
        sections: [
          {
            heading: "Data we do not collect by default",
            paragraphs: [
              "When you use SnapBill as a guest, invoice fields (client names, amounts, line items) are processed in your web browser. We do not upload your draft invoice to our servers unless you explicitly sign in and use cloud save.",
              "We do not use invasive tracking cookies to profile your financial activity. Analytics, if enabled, are limited to anonymous usage metrics.",
            ],
          },
          {
            heading: "Account and cloud save",
            paragraphs: [
              "If you create an account, authentication is handled by Supabase (email OTP or Google). Saved invoices are stored in your private database row scoped to your user ID.",
              "You can delete saved invoices from your dashboard. Deleting your account should be requested through the contact email below.",
            ],
          },
          {
            heading: "Third-party services",
            paragraphs: [
              "Hosting (e.g. Vercel), authentication (Supabase), and optional advertising (Google AdSense) may process technical data such as IP address and browser type as described in their own policies.",
            ],
          },
          {
            heading: "Security",
            paragraphs: [
              "We use HTTPS in production. You are responsible for securing devices where you download PDFs. Never share OTP codes or passwords.",
            ],
          },
          {
            heading: "Contact",
            paragraphs: [
              "Questions about privacy: linkdevcode@gmail.com",
            ],
          },
        ],
      },
      terms: {
        title: "Terms of Service",
        intro:
          "By using SnapBill you agree to these terms. If you do not agree, please do not use the service.",
        sections: [
          {
            heading: "Free tool, lawful use",
            paragraphs: [
              "SnapBill is provided as a free invoice generator for lawful business and personal use. You may not use the service for fraud, money laundering, or any illegal purpose.",
            ],
          },
          {
            heading: "No professional advice",
            paragraphs: [
              "SnapBill does not provide tax, legal, or accounting advice. Invoice templates are for convenience only. Consult a qualified professional for compliance in your country.",
            ],
          },
          {
            heading: "Accuracy of data",
            paragraphs: [
              "You are solely responsible for the accuracy of numbers, tax rates, and legal wording on invoices you create. SnapBill is not liable for errors, late payments, or disputes arising from user-entered data.",
            ],
          },
          {
            heading: "Disclaimer of warranties",
            paragraphs: [
              'The service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted availability or error-free PDF export.',
            ],
          },
          {
            heading: "Limitation of liability",
            paragraphs: [
              "To the maximum extent permitted by law, SnapBill and its operators shall not be liable for indirect, incidental, or consequential damages related to your use of the tool.",
            ],
          },
          {
            heading: "Changes",
            paragraphs: [
              "We may update these terms. Continued use after changes constitutes acceptance. Material changes will be reflected on this page.",
            ],
          },
        ],
      },
      contact: {
        title: "Contact Us",
        intro:
          "We welcome questions about SnapBill, privacy, advertising, and account support. We typically respond within 2–3 business days.",
        emailLabel: "Email support",
        email: "linkdevcode@gmail.com",
        emailHint: "Click to open your mail app, or use the form below.",
        formTitle: "Send a message",
        formName: "Your name",
        formNamePlaceholder: "Jane Doe",
        formEmail: "Your email",
        formEmailPlaceholder: "you@example.com",
        formMessage: "Message",
        formMessagePlaceholder: "How can we help?",
        formSubmit: "Open in email app",
        formNote:
          "This form opens your default email client with a pre-filled message. We do not store form submissions on a server.",
        backHome: "Back to invoice editor",
      },
    },
  },
  vi: {
    seo: {
      howToTitle: "Cách sử dụng SnapBill — Trình tạo hóa đơn",
      howToSteps: [
        "Nhập thông tin công ty, khách hàng và các dòng hàng hóa/dịch vụ ở cột trình soạn bên trái. Chọn ngôn ngữ và loại tiền tệ trên thanh công cụ.",
        "Xem trước thời gian thực ở cột bên phải. Điều chỉnh thuế, giảm giá, ngày hóa đơn và ghi chú thanh toán khi cần.",
        "Nhấn Tải PDF hoặc In để xuất hóa đơn chuyên nghiệp. Không bắt buộc đăng ký tài khoản khi dùng khách.",
        "Tùy chọn: đăng nhập bằng email hoặc Google để lưu hóa đơn lên đám mây và chỉnh sửa sau.",
      ],
      professionalTitle: "Hóa đơn chuyên nghiệp là gì?",
      professionalIntro:
        "Hóa đơn chuyên nghiệp là văn bản yêu cầu thanh toán chính thức cho hàng hóa hoặc dịch vụ đã cung cấp. Hóa đơn giúp thu tiền đúng hạn, hỗ trợ kế toán và có thể bắt buộc về thuế tùy quy định địa phương.",
      invoiceComponentsTitle: "Thành phần cần có trên hóa đơn hợp lệ",
      invoiceComponents: [
        "Số hóa đơn duy nhất và ngày lập",
        "Tên, địa chỉ và MST (nếu có) của bên bán và bên mua",
        "Mô tả rõ hàng hóa/dịch vụ, số lượng và đơn giá",
        "Tạm tính, thuế, giảm giá và tổng thanh toán",
        "Điều khoản thanh toán, hạn thanh toán và ghi chú/tài khoản ngân hàng (nếu có)",
      ],
      faqTitle: "Câu hỏi thường gặp (FAQ)",
      faq: [
        {
          question: "SnapBill có miễn phí không?",
          answer:
            "Có. SnapBill miễn phí để tạo, xem trước và tải hóa đơn. Lưu đám mây là tùy chọn khi bạn đăng nhập và máy chủ đã cấu hình Supabase.",
        },
        {
          question: "SnapBill có lưu dữ liệu tài chính hoặc cá nhân của tôi không?",
          answer:
            "Soạn hóa đơn chạy trên trình duyệt của bạn. Dữ liệu khách không gửi lên máy chủ trừ khi bạn đăng nhập và chọn lưu đám mây. Chúng tôi không bán nội dung hóa đơn. Xem Chính sách bảo mật để biết thêm.",
        },
        {
          question: "Tôi có tải hóa đơn dạng PDF được không?",
          answer:
            "Có. Dùng nút Tải PDF trên khung xem trước. File PDF được tạo phía client từ bố cục hóa đơn hiện tại của bạn.",
        },
      ],
    },
    footer: {
      tagline:
        "Công cụ tạo hóa đơn chuyên nghiệp miễn phí cho freelancer và doanh nghiệp nhỏ.",
      privacy: "Chính sách bảo mật",
      terms: "Điều khoản dịch vụ",
      contact: "Liên hệ",
      copyright: "© 2026 SnapBill. Bảo lưu mọi quyền.",
    },
    legal: {
      lastUpdated: "Cập nhật lần cuối: 19/05/2026",
      privacy: {
        title: "Chính sách bảo mật",
        intro:
          "SnapBill tôn trọng quyền riêng tư của bạn. Chính sách này giải thích dữ liệu chúng tôi thu thập, không thu thập và cách bảo vệ bạn khi dùng trình tạo hóa đơn miễn phí.",
        sections: [
          {
            heading: "Dữ liệu không thu thập mặc định",
            paragraphs: [
              "Khi dùng SnapBill với tư cách khách, các trường hóa đơn được xử lý trên trình duyệt. Chúng tôi không tải bản nháp hóa đơn lên máy chủ trừ khi bạn đăng nhập và dùng lưu đám mây.",
              "Chúng tôi không dùng cookie theo dõi xâm phạm để phân tích hoạt động tài chính của bạn.",
            ],
          },
          {
            heading: "Tài khoản và lưu đám mây",
            paragraphs: [
              "Đăng nhập qua Supabase (OTP email hoặc Google). Hóa đơn đã lưu nằm trong bản ghi riêng gắn với user ID của bạn.",
              "Bạn có thể xóa hóa đơn trên bảng điều khiển. Yêu cầu xóa tài khoản qua email liên hệ bên dưới.",
            ],
          },
          {
            heading: "Dịch vụ bên thứ ba",
            paragraphs: [
              "Hosting (ví dụ Vercel), xác thực (Supabase) và quảng cáo tùy chọn (Google AdSense) có thể xử lý dữ liệu kỹ thuật như IP theo chính sách riêng của họ.",
            ],
          },
          {
            heading: "Bảo mật",
            paragraphs: [
              "Chúng tôi dùng HTTPS trên môi trường production. Bạn chịu trách nhiệm bảo mật thiết bị lưu file PDF. Không chia sẻ mã OTP hoặc mật khẩu.",
            ],
          },
          {
            heading: "Liên hệ",
            paragraphs: ["Câu hỏi về bảo mật: linkdevcode@gmail.com"],
          },
        ],
      },
      terms: {
        title: "Điều khoản dịch vụ",
        intro:
          "Khi sử dụng SnapBill, bạn đồng ý các điều khoản sau. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.",
        sections: [
          {
            heading: "Công cụ miễn phí, mục đích hợp pháp",
            paragraphs: [
              "SnapBill là trình tạo hóa đơn miễn phí cho mục đích kinh doanh và cá nhân hợp pháp. Cấm dùng cho gian lận, rửa tiền hoặc hành vi trái pháp luật.",
            ],
          },
          {
            heading: "Không phải tư vấn chuyên môn",
            paragraphs: [
              "SnapBill không cung cấp tư vấn thuế, pháp lý hay kế toán. Mẫu hóa đơn chỉ mang tính tiện ích. Hãy tham vấn chuyên gia tại quốc gia của bạn.",
            ],
          },
          {
            heading: "Trách nhiệm về số liệu",
            paragraphs: [
              "Bạn hoàn toàn chịu trách nhiệm về độ chính xác số tiền, thuế suất và nội dung pháp lý trên hóa đơn. SnapBill không chịu trách nhiệm về sai sót do người dùng nhập.",
            ],
          },
          {
            heading: "Từ chối bảo đảm",
            paragraphs: [
              'Dịch vụ được cung cấp "nguyên trạng" không kèm bảo đảm. Chúng tôi không đảm bảo hoạt động liên tục hoặc xuất PDF không lỗi.',
            ],
          },
          {
            heading: "Giới hạn trách nhiệm",
            paragraphs: [
              "Trong phạm vi pháp luật cho phép, SnapBill và đơn vị vận hành không chịu trách nhiệm về thiệt hại gián tiếp phát sinh từ việc sử dụng công cụ.",
            ],
          },
          {
            heading: "Thay đổi điều khoản",
            paragraphs: [
              "Chúng tôi có thể cập nhật điều khoản. Tiếp tục sử dụng sau khi cập nhật đồng nghĩa chấp nhận.",
            ],
          },
        ],
      },
      contact: {
        title: "Liên hệ",
        intro:
          "Chúng tôi sẵn sàng hỗ trợ câu hỏi về SnapBill, bảo mật, quảng cáo và tài khoản. Thường phản hồi trong 2–3 ngày làm việc.",
        emailLabel: "Email hỗ trợ",
        email: "linkdevcode@gmail.com",
        emailHint: "Nhấn để mở ứng dụng email hoặc dùng biểu mẫu bên dưới.",
        formTitle: "Gửi tin nhắn",
        formName: "Họ tên",
        formNamePlaceholder: "Nguyễn Văn A",
        formEmail: "Email của bạn",
        formEmailPlaceholder: "ban@email.com",
        formMessage: "Nội dung",
        formMessagePlaceholder: "Chúng tôi có thể giúp gì?",
        formSubmit: "Mở ứng dụng email",
        formNote:
          "Biểu mẫu mở ứng dụng email với nội dung điền sẵn. Chúng tôi không lưu gửi biểu mẫu trên máy chủ.",
        backHome: "Về trình tạo hóa đơn",
      },
    },
  },
  zh: {
    seo: {
      howToTitle: "如何使用 SnapBill 发票生成器",
      howToSteps: [
        "在左侧编辑器填写公司信息、客户信息和明细行，并在工具栏选择语言和货币。",
        "右侧实时预览会即时更新。根据需要调整税率、折扣、日期和付款备注。",
        "点击下载 PDF 或打印即可导出专业发票。访客模式无需注册。",
        "可选：使用邮箱或 Google 登录，将发票保存到云端以便日后编辑。",
      ],
      professionalTitle: "什么是专业发票？",
      professionalIntro:
        "专业发票是请求付款的正式文件，记录商品或服务的销售，有助于按时收款、记账，并可能满足当地税务要求。",
      invoiceComponentsTitle: "合法发票的必备要素",
      invoiceComponents: [
        "唯一发票编号与开票日期",
        "买卖双方的名称、地址及税号（如适用）",
        "清晰的品目描述、数量与单价",
        "小计、税费、折扣与应付总额",
        "付款条款、到期日及备注或银行账户信息",
      ],
      faqTitle: "常见问题 (FAQ)",
      faq: [
        {
          question: "SnapBill 免费吗？",
          answer:
            "是的。创建、预览和下载发票均免费。在部署配置了 Supabase 时，可选云端保存需要免费账户。",
        },
        {
          question: "SnapBill 会存储我的财务或个人数据吗？",
          answer:
            "发票编辑在浏览器中完成。除非您登录并保存到云端，访客数据保留在您的设备上。我们不会出售发票内容。详见隐私政策。",
        },
        {
          question: "可以下载 PDF 发票吗？",
          answer:
            "可以。在实时预览面板点击下载 PDF。PDF 在客户端根据当前布局生成。",
        },
      ],
    },
    footer: {
      tagline: "为自由职业者和小企业提供免费专业发票生成器。",
      privacy: "隐私政策",
      terms: "服务条款",
      contact: "联系我们",
      copyright: "© 2026 SnapBill. 保留所有权利。",
    },
    legal: {
      lastUpdated: "最后更新：2026年5月19日",
      privacy: {
        title: "隐私政策",
        intro:
          "SnapBill 重视您的隐私。本政策说明我们收集与不收集的信息，以及使用免费发票工具时的保护措施。",
        sections: [
          {
            heading: "默认不收集的数据",
            paragraphs: [
              "访客模式下，发票字段在浏览器中处理，除非您登录并使用云端保存，我们不会上传草稿。",
              "我们不会使用侵入性跟踪 Cookie 分析您的财务活动。",
            ],
          },
          {
            heading: "账户与云端保存",
            paragraphs: [
              "登录通过 Supabase（邮箱 OTP 或 Google）。已保存发票存储在与您的用户 ID 关联的私有记录中。",
            ],
          },
          {
            heading: "第三方服务",
            paragraphs: [
              "托管、身份验证及可选广告服务可能按其政策处理 IP 等技术数据。",
            ],
          },
          {
            heading: "安全",
            paragraphs: [
              "生产环境使用 HTTPS。请妥善保管下载 PDF 的设备。",
            ],
          },
          {
            heading: "联系",
            paragraphs: ["隐私问题：linkdevcode@gmail.com"],
          },
        ],
      },
      terms: {
        title: "服务条款",
        intro: "使用 SnapBill 即表示您同意以下条款。",
        sections: [
          {
            heading: "免费工具与合法使用",
            paragraphs: [
              "SnapBill 为合法商业和个人用途提供免费发票工具，禁止用于欺诈等非法目的。",
            ],
          },
          {
            heading: "非专业建议",
            paragraphs: [
              "我们不提供税务、法律或会计建议。请咨询当地专业人士。",
            ],
          },
          {
            heading: "数据准确性",
            paragraphs: [
              "您对发票上的数字和措辞负全部责任。SnapBill 不对用户输入错误承担责任。",
            ],
          },
          {
            heading: "免责声明",
            paragraphs: [
              '服务按"原样"提供，不保证不间断或无错误。',
            ],
          },
          {
            heading: "责任限制",
            paragraphs: [
              "在法律允许范围内，我们不承担间接损害赔偿责任。",
            ],
          },
          {
            heading: "条款变更",
            paragraphs: ["我们可能会更新条款，继续使用即视为接受。"],
          },
        ],
      },
      contact: {
        title: "联系我们",
        intro: "欢迎咨询 SnapBill、隐私、广告及账户问题。",
        emailLabel: "支持邮箱",
        email: "linkdevcode@gmail.com",
        emailHint: "点击打开邮件应用或使用下方表单。",
        formTitle: "发送消息",
        formName: "姓名",
        formNamePlaceholder: "张三",
        formEmail: "您的邮箱",
        formEmailPlaceholder: "you@example.com",
        formMessage: "消息",
        formMessagePlaceholder: "需要什么帮助？",
        formSubmit: "在邮件应用中打开",
        formNote: "表单将打开邮件客户端，不会在服务器保存。",
        backHome: "返回发票编辑器",
      },
    },
  },
  ja: {
    seo: {
      howToTitle: "SnapBill 請求書ジェネレーターの使い方",
      howToSteps: [
        "左のエディターで会社情報、顧客情報、明細を入力し、言語と通貨を選択します。",
        "右のライブプレビューが即時に更新されます。税率、割引、日付を調整できます。",
        "PDFダウンロードまたは印刷でプロの請求書を出力。ゲスト利用に登録は不要です。",
        "任意：メールまたはGoogleでサインインし、クラウドに保存して後から編集できます。",
      ],
      professionalTitle: "プロフェッショナルな請求書とは？",
      professionalIntro:
        "請求書は商品・サービスの代金を正式に請求する書類です。入金管理や税務対応に役立ちます。",
      invoiceComponentsTitle: "適切な請求書に含める要素",
      invoiceComponents: [
        "一意の請求書番号と発行日",
        "売主・買主の名称、住所、税番号（該当する場合）",
        "品目、数量、単価の明確な記載",
        "小計、税、割引、合計金額",
        "支払条件、支払期限、備考",
      ],
      faqTitle: "よくある質問 (FAQ)",
      faq: [
        {
          question: "SnapBillは無料ですか？",
          answer:
            "はい。作成・プレビュー・PDFダウンロードは無料です。クラウド保存は任意でアカウントが必要です。",
        },
        {
          question: "財務データや個人データは保存されますか？",
          answer:
            "請求書の編集はブラウザ内で行われます。ログインしてクラウド保存しない限り、サーバーにアップロードされません。",
        },
        {
          question: "PDFでダウンロードできますか？",
          answer:
            "はい。プレビューパネルのPDFダウンロードをご利用ください。クライアント側で生成されます。",
        },
      ],
    },
    footer: {
      tagline: "フリーランスと小規模事業者向けの無料請求書ジェネレーター。",
      privacy: "プライバシーポリシー",
      terms: "利用規約",
      contact: "お問い合わせ",
      copyright: "© 2026 SnapBill. All rights reserved.",
    },
    legal: {
      lastUpdated: "最終更新：2026年5月19日",
      privacy: {
        title: "プライバシーポリシー",
        intro: "SnapBillはお客様のプライバシーを尊重します。",
        sections: [
          {
            heading: "デフォルトで収集しないデータ",
            paragraphs: [
              "ゲスト利用時、請求書データはブラウザで処理され、クラウド保存しない限りサーバーに送信されません。",
            ],
          },
          {
            heading: "アカウントとクラウド",
            paragraphs: ["サインイン後のデータはユーザーIDに紐づけて保存されます。"],
          },
          {
            heading: "第三者サービス",
            paragraphs: ["ホスティング、認証、広告サービスが技術データを処理する場合があります。"],
          },
          {
            heading: "セキュリティ",
            paragraphs: ["本番環境ではHTTPSを使用します。"],
          },
          {
            heading: "連絡先",
            paragraphs: ["linkdevcode@gmail.com"],
          },
        ],
      },
      terms: {
        title: "利用規約",
        intro: "SnapBillを利用することで本規約に同意したものとみなします。",
        sections: [
          {
            heading: "無料ツールと合法的な利用",
            paragraphs: ["合法的な目的でのみご利用ください。"],
          },
          {
            heading: "助言の不提供",
            paragraphs: ["税務・法務・会計の助言は提供しません。"],
          },
          {
            heading: "データの正確性",
            paragraphs: ["入力内容の正確性はユーザー責任です。"],
          },
          {
            heading: "免責",
            paragraphs: ['サービスは「現状有姿」で提供されます。'],
          },
          {
            heading: "責任の制限",
            paragraphs: ["間接損害について責任を負いません。"],
          },
          {
            heading: "変更",
            paragraphs: ["規約を更新する場合があります。"],
          },
        ],
      },
      contact: {
        title: "お問い合わせ",
        intro: "ご質問は2〜3営業日以内に返信いたします。",
        emailLabel: "サポートメール",
        email: "linkdevcode@gmail.com",
        emailHint: "メールアプリを開くか、下記フォームをご利用ください。",
        formTitle: "メッセージを送る",
        formName: "お名前",
        formNamePlaceholder: "山田 太郎",
        formEmail: "メールアドレス",
        formEmailPlaceholder: "you@example.com",
        formMessage: "メッセージ",
        formMessagePlaceholder: "ご用件を入力",
        formSubmit: "メールアプリで開く",
        formNote: "フォームはメールクライアントを開きます。サーバーには保存しません。",
        backHome: "エディターに戻る",
      },
    },
  },
  ko: {
    seo: {
      howToTitle: "SnapBill 인보이스 생성기 사용 방법",
      howToSteps: [
        "왼쪽 편집기에 회사 정보, 고객 정보, 품목을 입력하고 언어와 통화를 선택하세요.",
        "오른쪽 실시간 미리보기가 즉시 업데이트됩니다. 세율, 할인, 날짜를 조정하세요.",
        "PDF 다운로드 또는 인쇄로 전문 인보이스를보낼 수 있습니다. 게스트 사용 시 가입 불필요.",
        "선택: 이메일 또는 Google로 로그인해 클라우드에 저장할 수 있습니다.",
      ],
      professionalTitle: "전문 인보이스란?",
      professionalIntro:
        "인보이스는 상품이나 서비스에 대한 공식적인 대금 청구서입니다. 결제 관리와 세무에 도움이 됩니다.",
      invoiceComponentsTitle: "유효한 인보이스 필수 요소",
      invoiceComponents: [
        "고유 인보이스 번호 및 발행일",
        "판매자·구매자 명칭, 주소, 세금 ID(해당 시)",
        "품목 설명, 수량, 단가",
        "소계, 세금, 할인, 총액",
        "결제 조건, 만기일, 비고",
      ],
      faqTitle: "자주 묻는 질문 (FAQ)",
      faq: [
        {
          question: "SnapBill은 무료인가요?",
          answer:
            "예. 생성, 미리보기, PDF 다운로드가 무료입니다. 클라우드 저장은 선택 사항입니다.",
        },
        {
          question: "재무·개인 데이터를 저장하나요?",
          answer:
            "인보이스 편집은 브라우저에서 이루어집니다. 로그인 후 클라우드 저장하지 않는 한 서버에 업로드되지 않습니다.",
        },
        {
          question: "PDF로 다운로드할 수 있나요?",
          answer:
            "예. 미리보기 패널의 PDF 다운로드 버튼을 사용하세요. 클라이언트에서 생성됩니다.",
        },
      ],
    },
    footer: {
      tagline: "프리랜서와 소규모 사업자를 위한 무료 전문 인보이스 생성기.",
      privacy: "개인정보 처리방침",
      terms: "이용약관",
      contact: "문의하기",
      copyright: "© 2026 SnapBill. All rights reserved.",
    },
    legal: {
      lastUpdated: "최종 업데이트: 2026년 5월 19일",
      privacy: {
        title: "개인정보 처리방침",
        intro: "SnapBill은 귀하의 개인정보를 존중합니다.",
        sections: [
          {
            heading: "기본적으로 수집하지 않는 데이터",
            paragraphs: [
              "게스트 사용 시 인보이스 데이터는 브라우저에서 처리되며, 클라우드 저장 전까지 서버에 업로드되지 않습니다.",
            ],
          },
          {
            heading: "계정 및 클라우드",
            paragraphs: ["로그인 후 데이터는 사용자 ID에 연결되어 저장됩니다."],
          },
          {
            heading: "제3자 서비스",
            paragraphs: ["호스팅, 인증, 광고 서비스가 기술 데이터를 처리할 수 있습니다."],
          },
          {
            heading: "보안",
            paragraphs: ["프로덕션에서는 HTTPS를 사용합니다."],
          },
          {
            heading: "연락처",
            paragraphs: ["linkdevcode@gmail.com"],
          },
        ],
      },
      terms: {
        title: "이용약관",
        intro: "SnapBill을 사용하면 본 약관에 동의하는 것으로 간주됩니다.",
        sections: [
          {
            heading: "무료 도구 및 합법적 사용",
            paragraphs: ["합법적인 목적으로만 사용하세요."],
          },
          {
            heading: "전문 조언 없음",
            paragraphs: ["세무·법률·회계 조언을 제공하지 않습니다."],
          },
          {
            heading: "데이터 정확성",
            paragraphs: ["입력 내용의 정확성은 사용자 책임입니다."],
          },
          {
            heading: "면책",
            paragraphs: ['서비스는 "있는 그대로" 제공됩니다.'],
          },
          {
            heading: "책임 제한",
            paragraphs: ["간접 손해에 대해 책임지지 않습니다."],
          },
          {
            heading: "변경",
            paragraphs: ["약관을 업데이트할 수 있습니다."],
          },
        ],
      },
      contact: {
        title: "문의하기",
        intro: "SnapBill 관련 문의는 2–3영업일 내 답변합니다.",
        emailLabel: "지원 이메일",
        email: "linkdevcode@gmail.com",
        emailHint: "이메일 앱을 열거나 아래 양식을 사용하세요.",
        formTitle: "메시지 보내기",
        formName: "이름",
        formNamePlaceholder: "홍길동",
        formEmail: "이메일",
        formEmailPlaceholder: "you@example.com",
        formMessage: "메시지",
        formMessagePlaceholder: "무엇을 도와드릴까요?",
        formSubmit: "이메일 앱에서 열기",
        formNote: "양식은 메일 클라이언트를 열며 서버에 저장하지 않습니다.",
        backHome: "편집기로 돌아가기",
      },
    },
  },
};

export function getSitePagesContent(
  language: InvoiceLanguage,
): SitePagesContent {
  return SITE_PAGES[language] ?? SITE_PAGES.en;
}
