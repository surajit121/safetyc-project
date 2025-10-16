import Application from "../src/model/Application.js";

export async function createApplication(req, res) {
  try {
    // Basic server-side validation (production-ready checks)
    const name = (req.body.name || "").toString().trim();
    const email = (req.body.email || "").toString().trim();
    const message = (req.body.message || "").toString().trim();
    const whatsapp = (req.body.whatsapp || "").toString().trim();
    const phone = (req.body.phone || "").toString().trim();
    const address = (req.body.address || "").toString().trim();
    const dob = (req.body.dob || "").toString().trim();
    const pincode = (req.body.pincode || "").toString().trim();

    const errors = {};
    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) errors.email = "Enter a valid email";
    if (name.length > 100) errors.name = "Name is too long";
    if (email.length > 254) errors.email = "Email is too long";
    if (message.length > 2000) errors.message = "Message is too long";
  if (whatsapp && !/^[+0-9\s\-()]{7,30}$/.test(whatsapp)) errors.whatsapp = "Enter a valid WhatsApp number";
  // phone is required
  if (!phone) errors.phone = "Phone is required";
  else if (!/^[+0-9\s\-()]{7,30}$/.test(phone)) errors.phone = "Enter a valid phone number";
    if (address.length > 300) errors.address = "Address is too long";

    // Validation for dob
    if (!dob) errors.dob = "Date of Birth is required";
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) errors.dob = "Enter a valid date (YYYY-MM-DD)";

    // Validation for pincode
    if (!pincode) errors.pincode = "Pincode is required";
    else if (!/^\d{4,10}$/.test(pincode)) errors.pincode = "Enter a valid pincode";

    if (Object.keys(errors).length) {
      return res.status(400).json({ ok: false, errors });
    }

    const payload = {
      jobId: req.body.jobId,
      jobTitle: req.body.jobTitle,
      name,
      email,
      message,
      whatsapp,
      phone,
      address,
      dob,
      pincode,
      source: req.body.source || "website",
    };

    const created = await Application.create(payload);
    res.status(201).json({ ok: true, id: created._id });
  } catch (err) {
    console.error("createApplication error:", err);
    res.status(500).json({ ok: false, error: err.message || "Internal server error" });
  }
}
