import { authService } from "../request/config";

export function fetchUploadAvatar(formData: {}) {
  return authService.request({
    method: "post",
    url: "/file/avatar",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}
