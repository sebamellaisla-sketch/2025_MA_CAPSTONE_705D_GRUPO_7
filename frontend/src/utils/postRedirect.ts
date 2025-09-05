export function postRedirect(url: string, params: Record<string, string>) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;

  Object.entries(params).forEach(([k, v]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = k;
    input.value = v;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}
