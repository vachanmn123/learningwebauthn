import { isLoggedIn } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import { withSession } from "@/lib/session";
import User from "@/models/User";

export default function ProtectedHome({ userID, user }) {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
        Protected Home
      </h1>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <p>
          This page is protected and can only be accessed by authenticated
          users.
        </p>
        <br />
        <div>
          You are logged in as:{" "}
          <span className="font-mono">{user.username}</span>
          <br /> with the email: <span className="font-mono">{user.email}</span>
        </div>
        <br />
        <form method="POST" action="/api/logout">
          <button className=" p-3 rounded-md py-1.5 block bg-blue-600">
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  if (!isLoggedIn(req)) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  await dbConnect();
  const user = await User.findOne({ _id: req.session.userId });

  return {
    props: {
      userID: req.session.userId,
      user: JSON.parse(JSON.stringify(user)),
    },
  };
});
