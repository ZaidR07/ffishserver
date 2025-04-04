import mongoose from "mongoose";
import { Resend } from "resend";

export const adduser = async (req, res) => {
  try {
    // Connect to the database
    const db = mongoose.connection.db;
    const { name, email, mobile } = req.body.payload; // Extract data from request

    if (!name || !email || !mobile) {
      return res.status(400).json({ message: "Day and slots are required" });
    }

    // Function to generate user ID (random 6-digit number + timestamp)
    const generateUserId = () => {
      const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
      return `${randomNum}-${Date.now()}`;
    };

    const userid = generateUserId();

    const existingUser = await db.collection("users").findOne({
      $or: [{ email: email }, { mobile: mobile }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User Already exists" });
    }

    await db.collection("users").insertOne({
      name,
      email,
      mobile,
      user: userid,
      createdAt: new Date(),
    });

    return res.status(200).json({ message: "OPD schedule added successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// re_ccuAZtfq_qWsMFDrWjLSwX1vt6qm5GFCp

const resend = new Resend("re_ccuAZtfq_qWsMFDrWjLSwX1vt6qm5GFCp");

export const sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "No email provided" });
    }

    const db = mongoose.connection.db;

    const existingUser = await db.collection("users").findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "Incorrect Email" });
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in user doc with timestamp (optional: add expiry logic)
    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          otp,
          otpGeneratedAt: new Date(),
        },
      }
    );

    const { data, error } = await resend.emails.send({
      from: "ByFFISH <no-reply@t-rexinfotech.in>",
      to: [email],
      subject: "Your OTP Code",
      html: `<p>Your OTP is: <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
    });

    if (error) {
      return res.status(500).json({ message: "Failed to send OTP", error });
    }

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyotp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });


    }


    const db = mongoose.connection.db;

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || !user.otpGeneratedAt) {
      return res.status(400).json({ message: "No OTP found. Please request a new one." });
    }

    // Check if OTP has expired (10 minutes expiry)
    const otpAge = (Date.now() - new Date(user.otpGeneratedAt).getTime()) / 1000; // in seconds
    if (otpAge > 600) {
      return res.status(410).json({ message: "OTP expired. Please request a new one." });
    }

    // Match OTP
    if (user.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // ✅ Success: Clear OTP and mark as verified
    await db.collection("users").updateOne(
      { email },
      {
        $unset: { otp: "", otpGeneratedAt: "" },
        $set: { isVerified: true }, // optional
      }
    );

    return res.status(200).json({ message: "OTP verified successfully" , name : user.name });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "Internal server error"  });
  }
};


export const getopds = async (req, res) => {
  try {
    // Connect to the database
    const db = mongoose.connection.db;

    // Fetch all OPD schedules from the 'opd' collection
    const opdSchedules = await db.collection("opd").find().toArray();

    res
      .status(200)
      .json({ message: "OPD schedules retrieved", payload: opdSchedules });
  } catch (error) {
    console.error("Error fetching OPD schedules:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteopdslot = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Slot ID is required" });
    }

    const db = mongoose.connection.db;

    // Find the OPD entry that contains the slot
    const opdEntry = await db.collection("opd").findOne({ "slots.slotId": id });

    if (!opdEntry) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Update the OPD document by pulling out the slot with the matching slotId
    await db.collection("opd").updateOne(
      { _id: opdEntry._id }, // Match the OPD entry
      { $pull: { slots: { slotId: id } } } // Remove the slot from the slots array
    );

    return res.status(200).json({ message: "Slot removed successfully" });
  } catch (error) {
    console.error("Error in deleteopdslot:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
