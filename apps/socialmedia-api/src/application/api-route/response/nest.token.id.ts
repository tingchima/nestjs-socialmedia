export function nextTokenId(by: { page: number; perPage: number; total: number }): string {
  if (by.page * by.perPage < by.total) {
    return (by.page + 1).toString();
  }
  return "";
}
