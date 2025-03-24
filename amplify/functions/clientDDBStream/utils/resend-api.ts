import { Resend } from 'resend'
import { env } from '$amplify/env/clientDDBStream'

const resend = new Resend(env.SUM_DRIP_RESEND_API_KEY)

export const sendEmail = async (to: string, subject: string) => {
	const { data, error } = await resend.emails.send({
		from: 'stylist@mail.focusotter.com',
		to,
		subject,
		html: `<div>
			<p>${subject}</p>
			<a href="http://localhost:5173/rooms/" style="background-color: #000; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none;"	>View Room</a>
		</div>`,
	})

	if (error) {
		console.error(error)
	}
	return data
}
