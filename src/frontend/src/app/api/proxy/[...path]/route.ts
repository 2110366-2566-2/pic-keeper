import authService from "@/services/auth";
import axios, { AxiosRequestConfig } from "axios";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
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
      Authorization: `Bearer ${session.user.session_token}`, // Correctly include the token
    },
  };

  if (req.body && req.method !== "GET" && req.method !== "DELETE") {
    const requestBody = await readRequestBody(req.body);
    const jsonData = tryParseJSON(requestBody);
    if (jsonData) {
      // Conditionally add data if JSON is valid
      config = { ...config, data: jsonData };
    }
  }

  const makeRequest = async (token: string) => {
    try {
      const safeHeaders: { [key: string]: any } = { ...config.headers };
      delete safeHeaders["host"];
      delete safeHeaders["connection"];
      safeHeaders["Authorization"] = `Bearer ${token}`;
      const { data, status } = await axiosInstance({
        ...config,
        headers: safeHeaders,
      });
      return NextResponse.json(data, { status });
    } catch (error) {
      throw error;
    }
  };

  return await processRequestWithTokenRetry(
    session.user.session_token,
    makeRequest
  );
}

async function processRequestWithTokenRetry(
  token: string,
  makeRequest: {
    (token: string): Promise<NextResponse<any> | undefined>;
    (arg0: string): any;
  }
) {
  try {
    return await makeRequest(token);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      try {
        const { refreshed_session_token } = await authService.refreshToken(
          token
        );
        const session = await getServerSession(authOptions);
        if (session) {
          session.user.session_token = refreshed_session_token;
        }

        return await makeRequest(refreshed_session_token);
      } catch (refreshError) {
        //TODO: In current version next-auth cant handle sign out from server side
        return handleError(refreshError);
      }
    } else {
      return handleError(error);
    }
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
