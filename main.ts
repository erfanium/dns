const remoteAddress: Deno.NetAddr = {
  port: 53,
  transport: "udp",
  hostname: "8.8.8.8",
};

const sock = Deno.listenDatagram({
  hostname: "0.0.0.0",
  port: 0,
  transport: "udp",
});

const encoder = new TextEncoder();

const request = new Uint8Array([
  0xdb,
  0x42, // ID
  1,
  0, // Flags
  0,
  1, // QDCOUNT
  0,
  0, // ANCOUNT
  0,
  0, // NSCOUNT
  0,
  0, // ARCOUNT
  6,
  ...encoder.encode("google"),
  3,
  ...encoder.encode("com"),
  0,
  0,
  1, // A Record
  0,
  1,
]);

await sock.send(request, remoteAddress);

const [result] = await sock.receive();

console.log("Response", result);
console.log("IP Address", result.slice(result.length - 4).join("."));
