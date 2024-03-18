import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import axios, { AxiosRequestConfig } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import authService from "@/services/auth";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

async function handler(
  req: NextApiRequest,
  { params: { path } }: { params: { path: string[] } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.session_token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = `/${path.join("/")}`;
  let config: AxiosRequestConfig = {
    method: req.method,
    url,
    headers: {
      ...req.headers,
      Authorization: `Bearer ${session.user.session_token}`,
    },
  };

  // Dynamically populate headers from the request
  req.headers.forEach((value, key) => {
    if (!["host", "connection"].includes(key)) {
      // Exclude specific headers
      config.headers[key] = value;
    }
  });

  // Handle multipart/form-data and other content types differently
  const contentType = req.headers.get("content-type");
  if (contentType && contentType.includes("multipart/form-data")) {
    // Forward the raw request stream for multipart/form-data
    config.data = req;
  } else if (req.body && req.method !== "GET" && req.method !== "DELETE") {
    const requestBody = await readRequestBody(req.body);
    const jsonData = tryParseJSON(requestBody);
    if (jsonData) {
      // Conditionally add data if JSON is valid
      config = { ...config, data: jsonData };
    }
  }

  return makeRequestAndHandleTokenRefresh(session.user.session_token, config);
}

async function makeRequestAndHandleTokenRefresh(
  token: string,
  config: AxiosRequestConfig
) {
  try {
    const safeHeaders: { [key: string]: any } = { ...config.headers };
    delete safeHeaders.host;
    delete safeHeaders.connection; // Remove connection-specific headers
    safeHeaders.Authorization = `Bearer ${token}`;

    const { data, status } = await axiosInstance({
      ...config,
      headers: safeHeaders,
    });
    return NextResponse.json(data, { status });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const newToken = await tryRefreshingToken(token);
      if (newToken) {
        return makeRequestAndHandleTokenRefresh(newToken, config);
      } else {
        return handleError(error);
      }
    } else {
      return handleError(error);
    }
  }
}

async function tryRefreshingToken(oldToken: string): Promise<string | null> {
  try {
    const { refreshed_session_token } = await authService.refreshToken(
      oldToken
    );
    //TODO: Update the session with the new token if necessary

    return refreshed_session_token;
  } catch (error) {
    //TODO: Handle token refresh error (maybe log out the user or notify them)
    console.log(error);
    return null;
  }
}

function handleError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return NextResponse.json(
      { error: error.response?.data },
      { status: error.response?.status }
    );
  }
  return NextResponse.json(
    { error: "An unexpected error occurred" },
    { status: 500 }
  );
}

async function readRequestBody(request: NextApiRequest) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf-8");
}

function tryParseJSON(jsonString: string) {
  try {
    let obj = JSON.parse(jsonString);
    if (obj && typeof obj === "object") {
      return obj;
    }
  } catch (e) {}
  return false;
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
