import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authUser from './middlewares/authUser.middlewares'
import connectDB from './database/database'
import userRouter from './routers/User.routers'
import Todorouter from './routers/Todo.routers'
import nodemailer from 'nodemailer'

// export const createTodoEmailTemplate = (
//   userName: string,
//   todoTitle: string,
//   todoDescription: string,
//   todoId?: string,
//   appUrl?: string
// ) => {
//   return `
// <!DOCTYPE html>
// <html lang="vi">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Todo Mới - ${todoTitle}</title>
// </head>
// <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
//     <table role="presentation" style="width: 100%; border-collapse: collapse;">
//         <tr>
//             <td style="padding: 40px 20px;">
//                 <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07); overflow: hidden;">
                    
//                     <!-- Header với gradient và icon checklist -->
//                     <tr>
//                         <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
//                             <div style="margin-bottom: 15px;">
//                                 <div style="display: inline-block; width: 64px; height: 64px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
//                                     <span style="font-size: 32px;">✅</span>
//                                 </div>
//                             </div>
//                             <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
//                                 Todo Mới Đã Được Tạo
//                             </h1>
//                             <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 400;">
//                                 Bạn có một nhiệm vụ mới cần hoàn thành
//                             </p>
//                         </td>
//                     </tr>
                    
//                     <!-- Content -->
//                     <tr>
//                         <td style="padding: 40px 30px;">
//                             <p style="margin: 0 0 20px; color: #374151; font-size: 16px; line-height: 1.6;">
//                                 Xin chào <strong style="color: #10b981;">${userName}</strong>,
//                             </p>
                            
//                             <p style="margin: 0 0 25px; color: #6b7280; font-size: 15px; line-height: 1.7;">
//                                 Một todo mới đã được tạo trong tài khoản của bạn. Hãy xem chi tiết bên dưới:
//                             </p>
                            
//                             <!-- Todo Card -->
//                             <div style="margin: 30px 0; padding: 30px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #10b981; border-radius: 12px; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1);">
//                                 <!-- Todo Title -->
//                                 <div style="margin-bottom: 20px;">
//                                     <div style="display: flex; align-items: center; margin-bottom: 8px;">
//                                         <span style="font-size: 20px; margin-right: 10px;">📋</span>
//                                         <h2 style="margin: 0; color: #065f46; font-size: 22px; font-weight: 700; line-height: 1.4;">
//                                             ${todoTitle}
//                                         </h2>
//                                     </div>
//                                 </div>
                                
//                                 <!-- Todo Description -->
//                                 ${todoDescription ? `
//                                 <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(16, 185, 129, 0.2);">
//                                     <p style="margin: 0 0 12px; color: #047857; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
//                                         📝 Mô tả:
//                                     </p>
//                                     <p style="margin: 0; color: #1f2937; font-size: 16px; line-height: 1.7; white-space: pre-wrap;">
//                                         ${todoDescription}
//                                     </p>
//                                 </div>
//                                 ` : ''}
                                
//                                 <!-- Status Badge -->
//                                 <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(16, 185, 129, 0.2);">
//                                     <div style="display: inline-flex; align-items: center; padding: 8px 16px; background-color: #d1fae5; border-radius: 20px;">
//                                         <span style="width: 8px; height: 8px; background-color: #10b981; border-radius: 50%; margin-right: 8px; display: inline-block;"></span>
//                                         <span style="color: #065f46; font-size: 14px; font-weight: 600;">Chưa hoàn thành</span>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             ${appUrl ? `
//                             <!-- Button -->
//                             <table role="presentation" style="margin: 35px auto; border-collapse: collapse;">
//                                 <tr>
//                                     <td style="border-radius: 10px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);">
//                                         <a href="${appUrl}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; letter-spacing: 0.3px;">
//                                             📱 Xem Todo Ngay
//                                         </a>
//                                     </td>
//                                 </tr>
//                             </table>
//                             ` : ''}
                            
//                             <!-- Info Box -->
//                             <div style="margin: 30px 0; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px;">
//                                 <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
//                                     💡 <strong>Lời nhắc:</strong> Hãy kiểm tra danh sách todo của bạn thường xuyên để không bỏ lỡ bất kỳ nhiệm vụ quan trọng nào!
//                                 </p>
//                             </div>
                            
//                             <!-- Divider -->
//                             <div style="margin: 35px 0; height: 1px; background: linear-gradient(to right, transparent, #e5e7eb, transparent);"></div>
                            
//                             <p style="margin: 0; color: #374151; font-size: 15px; font-weight: 500;">
//                                 Chúc bạn hoàn thành tốt công việc!<br>
//                                 <span style="color: #10b981; font-weight: 600;">Đội ngũ Todo App</span>
//                             </p>
//                         </td>
//                     </tr>
                    
//                     <!-- Footer -->
//                     <tr>
//                         <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
//                             <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px; line-height: 1.5;">
//                                 © ${new Date().getFullYear()} Todo App. All rights reserved.
//                             </p>
                            
//                             <p style="margin: 0; color: #9ca3af; font-size: 12px;">
//                                 Email này được gửi tự động từ hệ thống Todo App
//                             </p>
//                         </td>
//                     </tr>
//                 </table>
//             </td>
//         </tr>
//     </table>
// </body>
// </html>
//   `;
// };

dotenv.config()

// export const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.APP_PASSWORD // Sử dụng App Password, không phải mật khẩu thường
//   }
// })

// // Test email - Comment out khi không cần test
//  ;(async () => {
//    try {
//      const info = await transporter.sendMail({
//        from: `"Todo App" <${process.env.EMAIL_USER}>`,
//        to: 'namndtb00921@fpt.edu.vn',
//        subject: '✅ Todo Mới - Hoàn thành báo cáo tuần',
//        text: 'Bạn có một todo mới: Hoàn thành báo cáo tuần',
//        html: createTodoEmailTemplate(
//          'Nam',
//          'Hoàn thành báo cáo tuần',
//          'Cần hoàn thiện và gửi báo cáo công việc tuần này cho quản lý trước thứ 6. Bao gồm các công việc đã hoàn thành, tiến độ dự án và kế hoạch tuần tới.',
//          '507f1f77bcf86cd799439011',
//          'http://localhost:5173/todos'
//        )
//      })
//      console.log('✅ Email sent successfully:', info.messageId)
//    } catch (error) {
//      console.error('❌ Error sending email:', error)
//    }
//  })()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/user', userRouter)

app.use(authUser)
app.use('/api', Todorouter)
// app.get("/", () => console.log("Hello, it's jwt website !"))

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
