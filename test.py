import http.client

conn = http.client.HTTPSConnection("domain-da-pa-check.p.rapidapi.com")

headers = {
    'x-rapidapi-key': "ab4b861672msh5419af363549d62p1490f3jsn158cc35d9ac5",
    'x-rapidapi-host': "domain-da-pa-check.p.rapidapi.com"
}

conn.request("GET", "/?target=www.google.com", headers=headers)

res = conn.getresponse()
data = res.read()

print(data.decode("utf-8"))