import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT || 587),
	secure: process.env.SMTP_SECURE === "true",
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

export function generateOtp(length = 6) {
	let otp = "";

	for (let i = 0; i < length; i += 1) {
		otp += Math.floor(Math.random() * 10);
	}

	return otp;
}

export async function sendOtpEmail(receiverEmail, otp = generateOtp()) {
	if (!receiverEmail) {
		throw new Error("receiverEmail is required");
	}

	const senderEmail = process.env.SENDER_EMAIL || process.env.SMTP_USER;

	if (!senderEmail) {
		throw new Error("Set SENDER_EMAIL or SMTP_USER in .env");
	}

	const info = await transporter.sendMail({
		from: senderEmail,
		to: receiverEmail,
		subject: "Your OTP Code",
		text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
		html: `<p>Your OTP is <b>${otp}</b>.</p><p>It will expire in 10 minutes.</p>`,
	});

	return {
		success: true,
		messageId: info.messageId,
		receiverEmail,
		otp,
	};
}
