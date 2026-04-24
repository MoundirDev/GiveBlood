import { User } from "../models/User.js";
import { Appointment } from "../models/Appointment.js";
import { Hospital } from "../models/Hospital.js";


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

