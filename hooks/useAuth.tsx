import { http } from "common/services";
import { useQuery } from "react-query";

interface IAuthData {
  success: boolean;
  user_id?: number;
  profileImage?: string;
  username?: string;
}

export const fetchAuth = async (cookie?: any) => {
  const res = await http.get<IAuthData>("/auth", {
    ...(cookie && { headers: { cookie } }),
  });
  return res.data;
};

export default function useAuth(data?: {
  initialData?: IAuthData;
  cookie?: any;
}): IAuthData {
  const { data: auth } = useQuery(
    "auth",
    () => (data?.cookie ? fetchAuth(data.cookie) : fetchAuth()),
    {
      ...(data?.initialData && { initialData: data.initialData }),
    }
  );
  return auth || { success: false };
}
