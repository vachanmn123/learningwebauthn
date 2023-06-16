import { withSessionAPI } from "@/lib/session";
import { login } from "@/lib/auth";

async function handler(request, response) {
  try {
    const userId = await login(request);
    request.session.userId = userId;
    await request.session.save();

    response.status(200).json(userId);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
}

export default withSessionAPI(handler);
