import { useEffect, useState } from "react";
import { create, supported } from "@github/webauthn-json";

import { generateChallenge, isLoggedIn } from "@/lib/auth";
import { withSession } from "@/lib/session";
import { useRouter } from "next/router";

export default function Register({ challenge }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [support, setSupport] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const checkAvailability = async () => {
      const available =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      setSupport(available && supported());
    };
    checkAvailability();
  }, []);

  const handleRegister = async (event) => {
    event.preventDefault();

    const userAvailable = await fetch("/api/usercheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username }),
    });

    if (userAvailable.status !== 200) {
      try {
        const { message } = await userAvailable.json();
        setError(message);
        return;
      } catch (e) {
        setError("Something went wrong");
        return;
      }
    }

    const cred = await create({
      publicKey: {
        challenge: challenge,
        rp: {
          // These are seen by the authenticator when selecting which key to use
          name: "WebAuthn Demo",
          id: router.hostname,
        },
        user: {
          // You can choose any id you please, as long as it is unique
          id: window.crypto.randomUUID(),
          name: email,
          displayName: username,
        },

        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        timeout: 60000,
        attestation: "direct",
        authenticatorSelection: {
          residentKey: "required",
          userVerification: "required",
        },
      },
    });

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, cred }),
    });

    if (res.status === 200) {
      router.push("/protected/home");
    } else {
      const { message } = await res.json();
      setError(message);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
        Register
      </h1>
      <pre className="text-center text-red-500">{error}</pre>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {support ? (
          <form method="POST" onSubmit={handleRegister}>
            <div className="p-3">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="block w-full rounded-md border-0 py-1.5 text-black"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="p-3">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="block w-full rounded-md border-0 py-1.5 text-black"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <button
                type="submit"
                className="w-full bg-blue-600 p-3 rounded-md py-1.5 block"
              >
                Register
              </button>
            </div>
          </form>
        ) : (
          <div>Sorry, your browser does not support WebAuthn.</div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps = withSession(async function ({ req, res }) {
  if (isLoggedIn(req)) {
    return {
      redirect: {
        destination: "/protected/home",
        permanent: false,
      },
    };
  }
  const challenge = generateChallenge();
  req.session.challenge = challenge;
  await req.session.save();
  return { props: { challenge } };
});
