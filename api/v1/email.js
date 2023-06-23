import express from "express"
import nodemailer from "nodemailer"

const router = express.Router()

router.route("/")
    .post((req, res) => {
        
        let config = {
            'service': 'gmail',
            'auth': {
                'user': process.env.EMAIL,
                'pass': process.env.EMAIL_PASSWORD
            }
        }

        let transporter = nodemailer.createTransport(config)

        let message = {
            "from": process.env.EMAIL,
            "to": "consultants2022@geekshacking.com",
            "subject": req.body.subject,
            "text": req.body.text
        }

        transporter.sendMail(message).then(() => {
            return res.status(200).json({message: "Email sent"})
        }).catch((err) => {
            return res.status(500).json({error: err})
        })

    })

export default router