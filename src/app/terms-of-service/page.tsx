"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function TermsOfServicePage() {
  const [lang, setLang] = useState<"vi" | "en">("vi");

  return (
    <div className="tos-wrapper">
      <style>{`
        .tos-wrapper {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            min-height: 100vh;
            padding: 20px;
        }
        .tos-inner {
            max-width: 800px;
            margin: 0 auto;
        }
        .tos-container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .tos-container h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-top: 0;
            font-size: 2em;
            font-weight: bold;
        }
        .tos-container h2 {
            color: #34495e;
            margin-top: 30px;
            border-left: 4px solid #3498db;
            padding-left: 15px;
            font-size: 1.5em;
            font-weight: bold;
        }
        .tos-container h3 {
            color: #7f8c8d;
            margin-top: 20px;
            font-size: 1.17em;
            font-weight: bold;
        }
        .tos-highlight {
            background-color: #fff3cd;
            padding: 15px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
        }
        .tos-update-date {
            color: #7f8c8d;
            font-style: italic;
            font-size: 0.9em;
        }
        .tos-container ul, .tos-container ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        .tos-container li {
            margin: 8px 0;
            display: list-item;
        }
        .tos-contact-section {
            background-color: #e8f4f8;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
        }
        .tos-language-toggle {
            text-align: center;
            margin-bottom: 20px;
        }
        .tos-language-toggle button {
            padding: 10px 20px;
            margin: 0 5px;
            border: 2px solid #3498db;
            background: white;
            color: #3498db;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.2s;
        }
        .tos-language-toggle button:hover {
            opacity: 0.8;
        }
        .tos-language-toggle button.active {
            background: #3498db;
            color: white;
        }
        .tos-container p {
            margin-top: 0;
            margin-bottom: 1rem;
        }
        .tos-container a {
            color: #3498db;
            text-decoration: none;
        }
        .tos-container a:hover {
            text-decoration: underline;
        }
        .tos-container table {
            border-collapse: collapse;
            width: 100%;
            margin: 15px 0;
            font-size: 0.95em;
        }
        .tos-container th, .tos-container td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            vertical-align: top;
        }
        .tos-container th {
            background-color: #eef5fb;
        }
      `}</style>

      <div className="tos-inner">
        <div className="tos-language-toggle">
          <button 
            type="button"
            onClick={() => setLang('vi')} 
            className={lang === 'vi' ? 'active' : ''}
          >
            Tiếng Việt
          </button>
          <button 
            type="button"
            onClick={() => setLang('en')} 
            className={lang === 'en' ? 'active' : ''}
          >
            English
          </button>
        </div>

        {lang === 'vi' && (
          <div className="tos-container">
            <h1>Điều Khoản Sử Dụng Sổ Sách Xịn</h1>
            <p className="tos-update-date">Cập nhật lần cuối: 06/08/2026</p>

            <div className="tos-highlight">
                <strong>QUAN TRỌNG:</strong> Bằng cách sử dụng ứng dụng Sổ Sách Xịn, bạn đồng ý với các điều khoản sử dụng này. Vui lòng đọc kỹ trước khi sử dụng ứng dụng.
            </div>

            <h2>1. Chấp Nhận Điều Khoản</h2>
            <p>Bằng cách tải, cài đặt, hoặc sử dụng ứng dụng Sổ Sách Xịn (&quot;Ứng dụng&quot;), bạn đồng ý bị ràng buộc bởi các Điều khoản Sử Dụng này (&quot;Điều khoản&quot;). Nếu bạn không đồng ý với các Điều khoản này, vui lòng không sử dụng Ứng dụng.</p>

            <h2>2. Mô Tả Dịch Vụ</h2>
            <p>Sổ Sách Xịn là ứng dụng quản lý tài chính cá nhân giúp người dùng:</p>
            <ul>
                <li>Ghi chép thu nhập, chi tiêu, và chuyển tiền giữa các ví</li>
                <li>Quản lý ngân sách và đặt cảnh báo chi tiêu</li>
                <li>Theo dõi đầu tư và quỹ khẩn cấp</li>
                <li>Xem báo cáo tài chính theo tuần/tháng/năm</li>
                <li>Đối soát sổ sách với số dư thực tế</li>
            </ul>

            <h2>3. Quyền Riêng Tư và Dữ Liệu</h2>
            <h3>3.1 Thu Thập Dữ Liệu</h3>
            <p>Ứng dụng có thể thu thập các thông tin sau:</p>
            <ul>
                <li><strong>Dữ liệu tài chính:</strong> Giao dịch, số dư ví, ngân sách</li>
                <li><strong>Dữ liệu thiết bị:</strong> Mô hình thiết bị, hệ điều hành</li>
                <li><strong>Dữ liệu sử dụng:</strong> Thời gian sử dụng, tính năng được sử dụng</li>
                <li><strong>Dữ liệu vị trí:</strong> Để cung cấp gợi ý chi tiêu thông minh (tùy chọn)</li>
            </ul>

            <h3>3.2 Bảo Mật Dữ Liệu</h3>
            <p>Chúng tôi cam kết bảo vệ dữ liệu của bạn:</p>
            <ul>
                <li>Dữ liệu được lưu trữ cục bộ trên thiết bị của bạn</li>
                <li>Dữ liệu được mã hóa khi đồng bộ với đám mây</li>
                <li>Chúng tôi không bán dữ liệu cá nhân của bạn cho bên thứ ba</li>
                <li>Bạn có thể xóa dữ liệu của mình bất cứ lúc nào</li>
            </ul>

            <h3>3.3 Xử Lý Bằng AI (Google Gemini)</h3>
            <p>Khi bạn cho phép, các tính năng AI (nhập nhanh, quét hóa đơn, gợi ý tài chính) gửi dữ liệu tới <strong>Google Gemini</strong> (qua Firebase AI Logic của Google) để xử lý:</p>
            <ul>
                <li><strong>Nhập nhanh:</strong> đoạn chữ bạn gõ hoặc đọc (đã chuyển thành chữ)</li>
                <li><strong>Quét hóa đơn:</strong> ảnh hóa đơn bạn chọn</li>
                <li><strong>Gợi ý tài chính:</strong> số liệu thu, chi, nợ, đầu tư tổng hợp theo tháng, cùng tên ngân sách và danh mục</li>
                <li>Kèm theo mỗi yêu cầu: danh sách danh mục, tên ví, loại tiền, ngôn ngữ và ngày hiện tại</li>
            </ul>
            <p>Chúng tôi không gửi tên, email, số điện thoại hay mã tài khoản của bạn. Dữ liệu chỉ dùng để trả kết quả cho yêu cầu của bạn. Google xử lý dữ liệu theo điều khoản của Google dành cho Gemini API. Chúng tôi có thể lưu nhật ký yêu cầu AI để giám sát lỗi và chi phí.</p>
            <p>Chia sẻ dữ liệu với AI mặc định tắt. Chỉ khi bạn đồng ý, dữ liệu mới được gửi. Bạn có thể rút lại bất cứ lúc nào tại Hồ sơ &rarr; Chia sẻ dữ liệu với AI.</p>

            <h3 id="privacy-policy">3.4 Chính Sách Quyền Riêng Tư</h3>
            <p>Mục 3 này là chính sách quyền riêng tư của ứng dụng: nêu dữ liệu chúng tôi thu thập, cách thu thập, mục đích sử dụng và các bên thứ ba nhận dữ liệu (Google, gồm Firebase và Gemini).</p>
            <p>
                <strong>Chính sách quyền riêng tư riêng:</strong> Xem toàn văn tại{" "}
                <a href="#privacy-policy-separate" className="font-semibold underline">
                    Chính sách quyền riêng tư riêng bên dưới
                </a>{" "}
                hoặc truy cập <Link href="/privacy-policy" className="font-semibold underline">trang riêng</Link>.
            </p>

            <h2>4. Trách Nhiệm Người Dùng</h2>
            <p>Bạn đồng ý:</p>
            <ul>
                <li>Cung cấp thông tin chính xác và cập nhật</li>
                <li>Không sử dụng Ứng dụng cho bất kỳ mục đích bất hợp pháp nào</li>
                <li>Không cố gắng truy cập trái phép vào hệ thống hoặc dữ liệu</li>
                <li>Không chia sẻ tài khoản của mình với người khác</li>
                <li>Chịu trách nhiệm về tất cả hoạt động diễn ra trên tài khoản của bạn</li>
            </ul>

            <h2>5. Hạn Chế Trách Nhiệm</h2>
            <p>Ứng dụng được cung cấp &quot;nguyên trạng&quot; mà không có bất kỳ bảo đảm nào, dù là rõ ràng hay ngầm định. Chúng tôi không đảm bảo rằng Ứng dụng sẽ:</p>
            <ul>
                <li>Hoạt động không bị gián đoạn hoặc không có lỗi</li>
                <li>Đáp ứng các yêu cầu cụ thể của bạn</li>
                <li>Tương thích với tất cả các thiết bị</li>
            </ul>
            <p>Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng Ứng dụng.</p>

            <h2>6. Quyền Sở Hữu Trí Tuệ</h2>
            <p>Tất cả nội dung, tính năng, và thiết kế của Ứng dụng thuộc sở hữu của chúng tôi và được bảo vệ bởi luật bản quyền. Bạn không được:</p>
            <ul>
                <li>Sao chép, sửa đổi, hoặc phân phối Ứng dụng</li>
                <li>Sử dụng nội dung của Ứng dụng cho mục đích thương mại</li>
                <li>Tạo các ứng dụng dựa trên Ứng dụng của chúng tôi</li>
            </ul>

            <h2>7. Chấm Dứt Sử Dụng</h2>
            <p>Chúng tôi có quyền:</p>
            <ul>
                <li>Ngừng cung cấp Ứng dụng hoặc tính năng bất cứ lúc nào</li>
                <li>Thu hồi quyền truy cập của bạn nếu bạn vi phạm các Điều khoản này</li>
                <li>Xóa tài khoản của bạn nếu không có hoạt động trong thời gian dài</li>
            </ul>
            <p>Bạn cũng có thể xóa tài khoản của mình bất cứ lúc nào thông qua cài đặt trong Ứng dụng.</p>

            <h2>8. Thay Đổi Điều Khoản</h2>
            <p>Chúng tôi có thể cập nhật các Điều khoản này theo thời gian. Bạn sẽ được thông báo về các thay đổi quan trọng. Việc bạn tiếp tục sử dụng Ứng dụng sau khi thay đổi có hiệu lực đồng nghĩa với việc bạn chấp nhận các Điều khoản mới.</p>

            <h2>9. Giải Quyết Tranh Chấp</h2>
            <p>Mọi tranh chấp phát sinh từ việc sử dụng Ứng dụng sẽ được giải quyết theo luật pháp Việt Nam. Trước khi khởi kiện, chúng tôi khuyến khích bạn liên hệ trực tiếp với chúng tôi để giải quyết vấn đề.</p>

            <h2>10. Thông Tin Liên Hệ</h2>
            <div className="tos-contact-section">
                <p>Nếu bạn có câu hỏi hoặc thắc mắc về các Điều khoản này, vui lòng liên hệ:</p>
                <ul>
                    <li><strong>Email:</strong> support@qltc.app</li>
                    <li><strong>Website:</strong> https://app-qltc.vercel.app</li>
                    <li><strong>Địa chỉ:</strong> [Địa chỉ của bạn]</li>
                </ul>
            </div>

            <h2>11. Điều Khoản Bổ Sung</h2>
            <h3>11.1 Xác Thực</h3>
            <p>Ứng dụng hỗ trợ xác thực qua số điện thoại, Google, và Apple. Bạn đồng ý cung cấp thông tin chính xác và giữ bảo mật thông tin đăng nhập.</p>

            <h3>11.2 Đồng Bộ Dữ Liệu</h3>
            <p>Dữ liệu của bạn có thể được đồng bộ giữa các thiết bị thông qua tài khoản của bạn. Bạn chịu trách nhiệm duy trì bảo mật tài khoản.</p>

            <h3>11.3 Dữ Liệu Tài Chính</h3>
            <p>Ứng dụng là công cụ quản lý tài chính cá nhân và không thay thế cho tư vấn tài chính chuyên nghiệp. Chúng tôi không chịu trách nhiệm cho các quyết định tài chính của bạn.</p>

            <div className="tos-highlight">
                <strong>LƯU Ý QUAN TRỌNG:</strong> Ứng dụng này chỉ là công cụ ghi chép và quản lý tài chính cá nhân. Không có dữ liệu nào được chuyển đến ngân hàng hoặc tổ chức tài chính nào khác mà không có sự đồng ý của bạn.
            </div>

            <hr style={{ margin: "40px 0", border: "0", borderTop: "2px dashed #cbd5e1" }} />

            <div id="privacy-policy-separate">
                <h1>Chính Sách Quyền Riêng Tư Riêng</h1>
                <p className="tos-update-date">Cập nhật lần cuối: 24/11/2026</p>

                <div className="tos-highlight">
                    Chính sách này giải thích ứng dụng Sổ Sách Xịn (&quot;Ứng dụng&quot;, &quot;chúng tôi&quot;) thu thập dữ liệu gì, thu thập bằng cách nào, dùng để làm gì, chia sẻ với ai, lưu trong bao lâu và cách bạn rút lại sự đồng ý hoặc xóa dữ liệu. Chúng tôi không bán dữ liệu của bạn, không hiển thị quảng cáo và không theo dõi bạn trên các ứng dụng hay trang web khác.
                </div>

                <h2>1. Dữ Liệu Chúng Tôi Thu Thập</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Loại dữ liệu</th>
                            <th>Cách thu thập</th>
                            <th>Mục đích</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Thông tin tài khoản: tên, email, số điện thoại, mã định danh tài khoản Apple/Google, ảnh đại diện</td>
                            <td>Khi bạn đăng nhập bằng Apple, Google hoặc số điện thoại</td>
                            <td>Tạo và bảo vệ tài khoản, đồng bộ dữ liệu giữa các thiết bị</td>
                        </tr>
                        <tr>
                            <td>Dữ liệu tài chính bạn nhập: ví, giao dịch, ngân sách, khoản vay/cho mượn, đối soát, danh mục, ghi chú</td>
                            <td>Do bạn nhập trong Ứng dụng</td>
                            <td>Cung cấp tính năng quản lý tài chính; sao lưu lên đám mây khi bạn đăng nhập</td>
                        </tr>
                        <tr>
                            <td>Nội dung gửi cho AI: đoạn chữ bạn gõ hoặc đọc, ảnh hóa đơn bạn chọn, số liệu tổng hợp theo tháng</td>
                            <td>Chỉ khi bạn dùng tính năng AI và đã đồng ý (xem mục 3)</td>
                            <td>Nhập giao dịch nhanh, quét hóa đơn, gợi ý tài chính</td>
                        </tr>
                        <tr>
                            <td>Giọng nói</td>
                            <td>Khi bạn nhấn nút micro; được dịch vụ nhận dạng giọng nói của hệ điều hành (Apple/Google) chuyển thành chữ</td>
                            <td>Nhập giao dịch bằng giọng nói. Ứng dụng chỉ giữ phần chữ, không lưu bản ghi âm</td>
                        </tr>
                        <tr>
                            <td>Ảnh và camera</td>
                            <td>Chỉ ảnh bạn chụp hoặc chọn để quét hóa đơn</td>
                            <td>Đọc nội dung hóa đơn. Ứng dụng không truy cập các ảnh khác</td>
                        </tr>
                        <tr>
                            <td>Vị trí gần đúng</td>
                            <td>Chỉ khi bạn cho phép</td>
                            <td>Gợi ý đơn vị tiền tệ theo quốc gia. Vị trí không được lưu và không được gửi cho chúng tôi</td>
                        </tr>
                        <tr>
                            <td>Dữ liệu thiết bị và chẩn đoán: mẫu máy, hệ điều hành, phiên bản ứng dụng, nhật ký lỗi, dữ liệu hiệu năng</td>
                            <td>Tự động khi Ứng dụng gặp lỗi hoặc hoạt động</td>
                            <td>Tìm và sửa lỗi, cải thiện độ ổn định</td>
                        </tr>
                        <tr>
                            <td>Dữ liệu sử dụng: tính năng được dùng, mã người dùng ẩn danh</td>
                            <td>Tự động qua Firebase Analytics</td>
                            <td>Hiểu tính năng nào hữu ích để cải thiện Ứng dụng</td>
                        </tr>
                        <tr>
                            <td>Mã thông báo đẩy</td>
                            <td>Khi bạn cho phép thông báo</td>
                            <td>Gửi nhắc nhở và thông báo của Ứng dụng</td>
                        </tr>
                        <tr>
                            <td>Phản hồi: đánh giá, nội dung góp ý</td>
                            <td>Khi bạn gửi góp ý trong Ứng dụng</td>
                            <td>Cải thiện Ứng dụng</td>
                        </tr>
                    </tbody>
                </table>
                <p>Nếu bạn dùng Ứng dụng mà không đăng nhập, dữ liệu tài chính chỉ được lưu trên thiết bị của bạn và không được tải lên đám mây.</p>

                <h2>2. Bên Thứ Ba Nhận Dữ Liệu</h2>
                <ul>
                    <li><strong>Google Firebase</strong> (Authentication, Cloud Firestore, Analytics, Crashlytics, Performance Monitoring, Remote Config, Cloud Messaging, App Check): đăng nhập, lưu trữ và đồng bộ dữ liệu tài chính, chẩn đoán lỗi, thống kê sử dụng, thông báo và chống gian lận.</li>
                    <li><strong>Google Gemini</strong> (qua Firebase AI Logic): xử lý nội dung bạn gửi cho các tính năng AI, chỉ khi bạn đã đồng ý (mục 3).</li>
                    <li><strong>Apple và Google</strong>: xác thực khi bạn chọn Đăng nhập với Apple hoặc Google; nhận dạng giọng nói của hệ điều hành.</li>
                    <li><strong>Slack</strong>: kênh nội bộ của đội phát triển nhận báo cáo lỗi (mẫu máy, hệ điều hành, phiên bản ứng dụng, chi tiết lỗi) và nội dung góp ý bạn gửi. Báo cáo lỗi không chứa tên, email hay số điện thoại của bạn.</li>
                </ul>
                <p>Chúng tôi chỉ dùng những nhà cung cấp cam kết bảo vệ dữ liệu ở mức tương đương hoặc cao hơn chính sách này, theo điều khoản xử lý dữ liệu của họ, và chỉ để thực hiện các mục đích nêu trên. Chúng tôi không bán, cho thuê hay chia sẻ dữ liệu của bạn để quảng cáo.</p>

                <h2>3. Chia Sẻ Dữ Liệu Với AI (Google Gemini)</h2>
                <ul>
                    <li>Chia sẻ dữ liệu với AI <strong>mặc định tắt</strong>. Lần đầu bạn dùng tính năng AI, Ứng dụng hiện hộp thoại nêu rõ dữ liệu nào được gửi và gửi tới Google Gemini, rồi hỏi bạn Đồng ý hoặc Không đồng ý. Nếu bạn không đồng ý, không có dữ liệu nào được gửi.</li>
                    <li>Dữ liệu được gửi: <em>Nhập nhanh</em> – đoạn chữ bạn gõ hoặc đọc; <em>Quét hóa đơn</em> – ảnh hóa đơn bạn chọn; <em>Gợi ý tài chính</em> – số liệu thu, chi, nợ, đầu tư tổng hợp theo tháng cùng tên ngân sách và danh mục. Kèm theo mỗi yêu cầu: danh sách danh mục, tên ví, loại tiền, ngôn ngữ và ngày hiện tại.</li>
                    <li>Dữ liệu <strong>không</strong> được gửi: tên, email, số điện thoại và mã tài khoản của bạn.</li>
                    <li>Dữ liệu chỉ dùng để trả kết quả cho yêu cầu của bạn. Google xử lý dữ liệu theo điều khoản của Google dành cho Gemini API. Chúng tôi có thể lưu nhật ký kỹ thuật của yêu cầu AI (không kèm tên, email hay số điện thoại) để giám sát lỗi và chi phí.</li>
                    <li>Bạn có thể rút lại sự đồng ý bất cứ lúc nào tại <strong>Hồ sơ → Chia sẻ dữ liệu với AI</strong>.</li>
                </ul>

                <h2>4. Lưu Trữ Và Xóa Dữ Liệu</h2>
                <ul>
                    <li>Dữ liệu tài chính và thông tin tài khoản được lưu trong thời gian tài khoản của bạn còn tồn tại.</li>
                    <li>Khi bạn <strong>xóa tài khoản</strong> (Hồ sơ → Xóa tài khoản), chúng tôi xóa ngay tài khoản đăng nhập và toàn bộ dữ liệu tài chính của bạn trên đám mây, đồng thời xóa dữ liệu trên thiết bị. Thao tác này không thể hoàn tác. Nếu bạn đăng nhập bằng Apple, quyền truy cập của Ứng dụng vào Apple ID của bạn cũng được thu hồi.</li>
                    <li>Khi bạn đăng xuất, dữ liệu trên thiết bị được xóa sau khi đã sao lưu lên đám mây.</li>
                    <li>Nhật ký lỗi, dữ liệu hiệu năng và thống kê sử dụng được lưu theo thời hạn lưu trữ của Google Firebase và không dùng để nhận dạng cá nhân bạn. Báo cáo lỗi và góp ý trong Slack được xóa khi không còn cần cho việc sửa lỗi, hoặc khi bạn yêu cầu.</li>
                </ul>

                <h2>5. Quyền Và Lựa Chọn Của Bạn</h2>
                <ul>
                    <li>Rút lại đồng ý chia sẻ dữ liệu với AI: Hồ sơ → Chia sẻ dữ liệu với AI.</li>
                    <li>Từ chối hoặc thu hồi quyền vị trí, micro, camera, ảnh, thông báo trong Cài đặt của thiết bị. Ứng dụng vẫn hoạt động, chỉ tính năng tương ứng bị tắt.</li>
                    <li>Xóa tài khoản và toàn bộ dữ liệu: Hồ sơ → Xóa tài khoản.</li>
                    <li>Yêu cầu truy cập, sửa hoặc xóa dữ liệu (kể cả báo cáo lỗi và góp ý): gửi email theo địa chỉ ở mục 9. Chúng tôi phản hồi trong vòng 30 ngày.</li>
                </ul>

                <h2>6. Bảo Mật</h2>
                <p>Dữ liệu được truyền qua kết nối mã hóa (HTTPS/TLS) và lưu trên hạ tầng của Google Firebase. Dữ liệu trên đám mây được lưu riêng theo tài khoản của bạn. Không có biện pháp nào an toàn tuyệt đối, nhưng chúng tôi áp dụng các biện pháp hợp lý để bảo vệ dữ liệu của bạn.</p>

                <h2>7. Trẻ Em</h2>
                <p>Ứng dụng không dành cho trẻ em dưới 13 tuổi và chúng tôi không cố ý thu thập dữ liệu của trẻ em dưới 13 tuổi.</p>

                <h2>8. Thay Đổi Chính Sách</h2>
                <p>Khi chính sách này thay đổi, chúng tôi cập nhật ngày ở đầu trang. Phiên bản mới nhất luôn có trong Ứng dụng tại Hồ sơ → Chính sách quyền riêng tư.</p>

                <div className="tos-contact-section">
                    <h2>9. Liên Hệ</h2>
                    <p>Mọi câu hỏi hoặc yêu cầu về quyền riêng tư, vui lòng liên hệ:</p>
                    <ul>
                        <li>Email: huytd46.fpt@gmail.com</li>
                        <li>Địa chỉ: Vinhome Grand Park, Quận 9, TP. Hồ Chí Minh, Việt Nam</li>
                    </ul>
                </div>
            </div>
          </div>
        )}

        {lang === 'en' && (
          <div className="tos-container">
            <h1>Terms of Service - Sổ Sách Xịn</h1>
            <p className="tos-update-date">Last updated: August 6, 2026</p>

            <div className="tos-highlight">
                <strong>IMPORTANT:</strong> By using the Sổ Sách Xịn application, you agree to these Terms of Service. Please read them carefully before using the application.
            </div>

            <h2>1. Acceptance of Terms</h2>
            <p>By downloading, installing, or using the Sổ Sách Xịn application (&quot;App&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the App.</p>

            <h2>2. Service Description</h2>
            <p>Sổ Sách Xịn is a personal finance management application that helps users:</p>
            <ul>
                <li>Record income, expenses, and transfers between wallets</li>
                <li>Manage budgets and set spending alerts</li>
                <li>Track investments and emergency funds</li>
                <li>View financial reports by week/month/year</li>
                <li>Reconcile book balances with actual balances</li>
            </ul>

            <h2>3. Privacy and Data</h2>
            <h3>3.1 Data Collection</h3>
            <p>The App may collect the following information:</p>
            <ul>
                <li><strong>Financial Data:</strong> Transactions, wallet balances, budgets</li>
                <li><strong>Device Data:</strong> Device model, operating system</li>
                <li><strong>Usage Data:</strong> Usage time, features used</li>
                <li><strong>Location Data:</strong> To provide smart spending suggestions (optional)</li>
            </ul>

            <h3>3.2 Data Protection</h3>
            <p>We are committed to protecting your data:</p>
            <ul>
                <li>Data is stored locally on your device</li>
                <li>Data is encrypted when synced to the cloud</li>
                <li>We do not sell your personal data to third parties</li>
                <li>You can delete your data at any time</li>
            </ul>

            <h3>3.3 AI Processing (Google Gemini)</h3>
            <p>When you allow it, the AI features (quick entry, receipt scan, financial advice) send data to <strong>Google Gemini</strong> (through Google&apos;s Firebase AI Logic) for processing:</p>
            <ul>
                <li><strong>Quick entry:</strong> the text you type or dictate (after speech-to-text)</li>
                <li><strong>Receipt scan:</strong> the receipt photos you choose</li>
                <li><strong>Financial advice:</strong> monthly totals of income, spending, debt and investment, plus budget and category names</li>
                <li>With each request: the category list, wallet names, currency, language and today&apos;s date</li>
            </ul>
            <p>We do not send your name, email, phone number or account ID. The data is used only to return the result of your request. Google processes it under Google&apos;s terms for the Gemini API. We may keep AI request logs to monitor errors and costs.</p>
            <p>Sharing data with AI is off by default. Data is sent only after you agree, and you can withdraw consent at any time in Profile &rarr; Share data with AI.</p>

            <h3 id="privacy-policy-en">3.4 Privacy Policy</h3>
            <p>This Section 3 is the App&apos;s privacy policy: it states what data we collect, how we collect it, how we use it, and the third parties that receive data (Google, including Firebase and Gemini).</p>
            <p>
                <strong>Separate Privacy Policy:</strong> See full details in the{" "}
                <a href="#privacy-policy-separate-en" className="font-semibold underline">
                    Separate Privacy Policy below
                </a>{" "}
                or visit the <Link href="/privacy-policy" className="font-semibold underline">standalone page</Link>.
            </p>

            <h2>4. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul>
                <li>Provide accurate and up-to-date information</li>
                <li>Not use the App for any illegal purposes</li>
                <li>Not attempt to gain unauthorized access to the system or data</li>
                <li>Not share your account with others</li>
                <li>Be responsible for all activities on your account</li>
            </ul>

            <h2>5. Limitation of Liability</h2>
            <p>The App is provided &quot;as is&quot; without any warranties, express or implied. We do not guarantee that the App will:</p>
            <ul>
                <li>Operate uninterrupted or error-free</li>
                <li>Meet your specific requirements</li>
                <li>Be compatible with all devices</li>
            </ul>
            <p>We are not liable for any damages arising from the use or inability to use the App.</p>

            <h2>6. Intellectual Property</h2>
            <p>All content, features, and design of the App are owned by us and are protected by copyright law. You may not:</p>
            <ul>
                <li>Copy, modify, or distribute the App</li>
                <li>Use App content for commercial purposes</li>
                <li>Create applications based on our App</li>
            </ul>

            <h2>7. Termination of Use</h2>
            <p>We reserve the right to:</p>
            <ul>
                <li>Discontinue the App or features at any time</li>
                <li>Revoke your access if you violate these Terms</li>
                <li>Delete your account if inactive for an extended period</li>
            </ul>
            <p>You may also delete your account at any time through the App settings.</p>

            <h2>8. Changes to Terms</h2>
            <p>We may update these Terms from time to time. You will be notified of significant changes. Your continued use of the App after changes take effect constitutes acceptance of the new Terms.</p>

            <h2>9. Dispute Resolution</h2>
            <p>Any disputes arising from the use of the App will be resolved under Vietnamese law. Before filing a lawsuit, we encourage you to contact us directly to resolve issues.</p>

            <h2>10. Contact Information</h2>
            <div className="tos-contact-section">
                <p>If you have questions or concerns about these Terms, please contact:</p>
                <ul>
                    <li><strong>Email:</strong> support@qltc.app</li>
                    <li><strong>Website:</strong> https://app-qltc.vercel.app</li>
                    <li><strong>Address:</strong> [Your Address]</li>
                </ul>
            </div>

            <h2>11. Additional Terms</h2>
            <h3>11.1 Authentication</h3>
            <p>The App supports authentication via phone number, Google, and Apple. You agree to provide accurate information and keep your login credentials secure.</p>

            <h3>11.2 Data Synchronization</h3>
            <p>Your data may be synchronized across devices through your account. You are responsible for maintaining account security.</p>

            <h3>11.3 Financial Data</h3>
            <p>The App is a personal finance management tool and does not replace professional financial advice. We are not responsible for your financial decisions.</p>

            <div className="tos-highlight">
                <strong>IMPORTANT NOTE:</strong> This application is only a personal finance recording and management tool. No data is transferred to any bank or financial institution without your consent.
            </div>

            <hr style={{ margin: "40px 0", border: "0", borderTop: "2px dashed #cbd5e1" }} />

            <div id="privacy-policy-separate-en">
                <h1>Privacy Policy</h1>
                <p className="tos-update-date">Last updated: November 24, 2026</p>

                <div className="tos-highlight">
                    This policy explains what data the Sổ Sách Xịn app (&quot;App&quot;, &quot;we&quot;) collects, how it is collected, what it is used for, who it is shared with, how long it is kept, and how you can withdraw consent or delete your data. We do not sell your data, show ads, or track you across other apps or websites.
                </div>

                <h2>1. Data We Collect</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>How it is collected</th>
                            <th>Purpose</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Account information: name, email, phone number, Apple/Google account identifier, profile photo</td>
                            <td>When you sign in with Apple, Google or your phone number</td>
                            <td>Create and protect your account, sync your data across devices</td>
                        </tr>
                        <tr>
                            <td>Financial data you enter: wallets, transactions, budgets, borrowing/lending, reconciliations, categories, notes</td>
                            <td>Entered by you in the App</td>
                            <td>Provide the finance features; back up to the cloud when you are signed in</td>
                        </tr>
                        <tr>
                            <td>Content sent to AI: text you type or speak, receipt photos you choose, monthly summary figures</td>
                            <td>Only when you use an AI feature and have agreed (see section 3)</td>
                            <td>Quick entry, receipt scanning, financial advice</td>
                        </tr>
                        <tr>
                            <td>Voice</td>
                            <td>When you tap the microphone; converted to text by your device&apos;s speech recognition service (Apple/Google)</td>
                            <td>Enter transactions by voice. The App keeps only the text, never the recording</td>
                        </tr>
                        <tr>
                            <td>Photos and camera</td>
                            <td>Only the photo you take or pick to scan a receipt</td>
                            <td>Read the receipt. The App does not access your other photos</td>
                        </tr>
                        <tr>
                            <td>Approximate location</td>
                            <td>Only if you allow it</td>
                            <td>Suggest your currency based on your country. Location is not stored and not sent to us</td>
                        </tr>
                        <tr>
                            <td>Device and diagnostics: device model, OS, app version, crash logs, performance data</td>
                            <td>Automatically, when the App runs or crashes</td>
                            <td>Find and fix bugs, improve stability</td>
                        </tr>
                        <tr>
                            <td>Usage data: features used, pseudonymous user ID</td>
                            <td>Automatically, through Firebase Analytics</td>
                            <td>Understand which features are useful so we can improve the App</td>
                        </tr>
                        <tr>
                            <td>Push notification token</td>
                            <td>When you allow notifications</td>
                            <td>Send the App&apos;s reminders and notifications</td>
                        </tr>
                        <tr>
                            <td>Feedback: rating and comments</td>
                            <td>When you send feedback in the App</td>
                            <td>Improve the App</td>
                        </tr>
                    </tbody>
                </table>
                <p>If you use the App without signing in, your financial data stays only on your device and is not uploaded to the cloud.</p>

                <h2>2. Third Parties That Receive Data</h2>
                <ul>
                    <li><strong>Google Firebase</strong> (Authentication, Cloud Firestore, Analytics, Crashlytics, Performance Monitoring, Remote Config, Cloud Messaging, App Check): sign-in, storing and syncing your financial data, crash diagnostics, usage statistics, notifications and abuse prevention.</li>
                    <li><strong>Google Gemini</strong> (through Firebase AI Logic): processes the content you send to the AI features, only after you agree (section 3).</li>
                    <li><strong>Apple and Google</strong>: authentication when you choose Sign in with Apple or Google; your device&apos;s speech recognition.</li>
                    <li><strong>Slack</strong>: the development team&apos;s internal channel that receives crash reports (device model, OS, app version, error details) and the feedback you send. Crash reports do not contain your name, email or phone number.</li>
                </ul>
                <p>We only use providers that commit to protecting data at a level equal to or higher than this policy, under their data processing terms, and only for the purposes above. We do not sell, rent or share your data for advertising.</p>

                <h2>3. Sharing Data with AI (Google Gemini)</h2>
                <ul>
                    <li>AI data sharing is <strong>off by default</strong>. The first time you use an AI feature, the App shows a dialog that explains what data is sent and that it goes to Google Gemini, and asks you to Allow or Decline. If you decline, nothing is sent.</li>
                    <li>What is sent: <em>Quick entry</em> – the text you type or speak; <em>Receipt scan</em> – the receipt photo you choose; <em>Financial advice</em> – monthly totals of income, expenses, debt and investments, with budget and category names. Each request also includes your category list, wallet names, currency, language and today&apos;s date.</li>
                    <li>What is <strong>not</strong> sent: your name, email, phone number and account ID.</li>
                    <li>The data is used only to answer your request. Google processes it under Google&apos;s terms for the Gemini API. We may keep technical logs of AI requests (without your name, email or phone number) to monitor errors and costs.</li>
                    <li>You can withdraw consent at any time in <strong>Profile → Share data with AI</strong>.</li>
                </ul>

                <h2>4. Data Retention and Deletion</h2>
                <ul>
                    <li>Your financial data and account information are kept for as long as your account exists.</li>
                    <li>When you <strong>delete your account</strong> (Profile → Delete account), we immediately delete your sign-in account and all of your financial data in the cloud, and clear the data on your device. This cannot be undone. If you signed in with Apple, the App&apos;s access to your Apple ID is also revoked.</li>
                    <li>When you log out, the data on your device is cleared after it has been backed up to the cloud.</li>
                    <li>Crash logs, performance data and usage statistics are kept according to Google Firebase&apos;s retention periods and are not used to identify you personally. Crash reports and feedback in Slack are deleted when no longer needed to fix issues, or when you ask.</li>
                </ul>

                <h2>5. Your Rights and Choices</h2>
                <ul>
                    <li>Withdraw consent to AI data sharing: Profile → Share data with AI.</li>
                    <li>Deny or revoke location, microphone, camera, photos and notification permissions in your device Settings. The App keeps working; only the related feature is turned off.</li>
                    <li>Delete your account and all of its data: Profile → Delete account.</li>
                    <li>Request access to, correction or deletion of your data (including crash reports and feedback): email us at the address in section 9. We reply within 30 days.</li>
                </ul>

                <h2>6. Security</h2>
                <p>Data is sent over encrypted connections (HTTPS/TLS) and stored on Google Firebase infrastructure. Cloud data is stored separately under your account. No method is perfectly secure, but we use reasonable measures to protect your data.</p>

                <h2>7. Children</h2>
                <p>The App is not intended for children under 13, and we do not knowingly collect data from children under 13.</p>

                <h2>8. Changes to This Policy</h2>
                <p>When this policy changes, we update the date at the top of this page. The latest version is always available in the App under Profile → Privacy Policy.</p>

                <div className="tos-contact-section">
                    <h2>9. Contact</h2>
                    <p>For any privacy question or request, please contact:</p>
                    <ul>
                        <li>Email: huytd46.fpt@gmail.com</li>
                        <li>Address: Vinhome Grand Park, District 9, Ho Chi Minh City, Vietnam</li>
                    </ul>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
