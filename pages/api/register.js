import { withSessionAPI } from "@/lib/session";

import user from "@/models/User";
import credentials from "@/models/Credentials";
import { verifyCredentials } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";

async function handler(request, response) {
  try {
    await dbConnect();
    const { credentialID, publicKey } = await verifyCredentials(request);
    const cred = await credentials.create({
      name: request.body.username,
      externalId: credentialID,
      publicKey: publicKey,
    });
    const usr = await user.create({
      email: request.body.email,
      username: request.body.username,
      credentials: [cred.id],
    });
    request.session.userId = usr._id;
    await request.session.save();
    response.status(200).json({ userId: usr._id });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

export default withSessionAPI(handler);
