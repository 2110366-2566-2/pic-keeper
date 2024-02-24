import authService from "@/services/auth";
import axios from "axios";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

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

  const makeRequest = async (token: string) => {
    try {
      const { data, status } = await axiosInstance({
        method: req.method,
        url,
        headers: {
          ...req.headers,
          Authorization: `Bearer ${token}`,
        },
        data: req.body,
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
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 500)
    ) {
      try {
        const { refreshed_session_token } = await authService.refreshToken(
          token
        );
        return await makeRequest(refreshed_session_token);
      } catch (refreshError) {
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

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
