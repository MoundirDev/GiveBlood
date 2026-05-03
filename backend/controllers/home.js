import { User } from "../models/User.js";
import { Appointment } from "../models/Appointment.js";
import { Hospital } from "../models/Hospital.js";
import { transporter } from "../utils/emailTransporter.js";
import { Event } from "../models/Event.js";


export async function scheduleAppointment(req, res, next) {
  const hospitalName = req.body.hospitalName; //! this field must be added in the frontend in place of city !!!
  const date = req.body.date;
  const bloodType = req.body.bloodType;

  try {
	if (!hospitalName || !date || !bloodType) {
	  return res.status(400).json({ message: "All fields are required." });
	}

	const hospital = await Hospital.findOne({ name: hospitalName });
	if (!hospital) {
	  return res.status(404).json({ message: "Hospital not found" });
	}

	const appointment = new Appointment({
	  donorId: req.user._id,
	  hospitalId: hospital._id,
	  date: new Date(date),
	  bloodType
	});

	await appointment.save();

	return res.status(201).json({ message: "Appointment created successfully" });
  } catch (error) {
	console.log(error);
	return res.status(500).json({ message: "Server side error" });
  }
}


export async function searchDonors(req, res, next){

	const city = req.body.city;
	const bloodType = req.body.bloodType;
	// //! no need to that email field again, already got the user's email

	try{
		if (!city || !bloodType) {
			return res.status(400).json({ message: "City and blood type are required" });
		}
	
		const donors = await User.find({ city, bloodType}).select('-password');

		if (!donors.length) {
			return res.status(404).json({ message: "No donors found" });
		}
		const sender = req.user;

		for (const donor of donors) {
			await transporter.sendMail({
			from: `"GiveBlood 🩸" <${process.env.EMAIL_USER}>`,
			to: donor.email,
			subject: "Urgent Blood Donation Request",

			html: `
			<div style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px;">
				
				<div style="max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
				
				<div style="background-color: #c1121f; color: white; padding: 15px; text-align: center;">
					<h2>🩸 Blood Donation Request</h2>
				</div>

				<div style="padding: 20px; color: #333;">
					<p>Hello,</p>

					<p>
					A patient in <strong style="color:#c1121f;">${city}</strong> urgently needs 
					<strong style="color:#c1121f;">${bloodType}</strong> blood.
					</p>

					<p>
					<strong>Requester Info:</strong><br/>
					Name: ${sender.fullname}<br/>
					Email: ${sender.email}
					</p>

					<p style="margin-top:20px;">
					If you are available, please consider helping save a life ❤️
					</p>

					<div style="text-align:center; margin-top: 25px;">
					<a href="mailto:${sender.email}" 
						style="background-color:#c1121f; color:white; padding:12px 20px; 
								text-decoration:none; border-radius:5px;">
						Contact Now
					</a>
					</div>
				</div>

				<div style="background:#f8f8f8; padding:10px; text-align:center; font-size:12px;">
					Thank you for being a hero 🩸
				</div>

				</div>
			</div>
			`,
		});
		}

    	return res.status(200).json({ message: "Emails sent to donors" });

	}catch(error){
		console.log(error);
		return res.status(500).json({message: "Server Side Error"});
	}

}

export async function createEvent(req, res, next){

	const organizationName = req.body.organizationName;
	const email = validator.normalizeEmail(req.body.email);
	const date = req.body.date;
	const hour = req.body.hour;
	const eventLink = req.body?.eventLink;

	try{
		if(!organizationName || !email || !date || !hour){
			return res.status(400).json({ message: "All fields are required"});
		}
		
		else if (!validator.isEmail(email)) {
			return res.status(400).json({ message: "Invalid email" });
		}
		const parsedDate = new Date(date);
		if (isNaN(parsedDate) || parsedDate < new Date()) {
			return res.status(400).json({ message: "Invalid date" });
		}

		const event = new Event({
			userId: req.user._id,
			organizationName,
			email,
			eventDate: parsedDate,
			hour,
			eventLink,
		});
		await event.save();

		return res.status(201).json({ message: "Event created successfully" });
	}catch(error){
		console.log(error);
		return res.status(500).json({message: "Server side error"});
	}
}

export async function getProfile(req, res, next) {
	try{
		const appointments = await Appointment.find({donorId: req.user._id});
		return res.status(200).json({user: req.user, appointments});
	}
	catch(error){
		console.log(error);
		return res.status(500).json({message: "Server side error"});	
	}
}